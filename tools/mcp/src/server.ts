import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { absoluteStorybookUrl, checkVersion, findComponent } from './catalog.js';
import {
  generateUsage,
  getTokens,
  recommendComponents,
  searchComponents,
  validateUsage,
} from './engine.js';
import type { ArgfitCatalog, CatalogComponent, ComponentStatus, Platform, Theme } from './types.js';

const readOnlyAnnotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
} as const;

export interface ArgfitMcpServerOptions {
  readonly catalog: ArgfitCatalog;
  readonly storybookOrigin?: string;
}

export function createArgfitMcpServer(options: ArgfitMcpServerOptions): McpServer {
  const { catalog, storybookOrigin } = options;
  const server = new McpServer(
    { name: 'argfit-ui', version: catalog.library.version },
    {
      instructions: [
        `This server describes ArgFit UI ${catalog.library.version}.`,
        "Prefer public components from '@argfit-ui/adaptive' and semantic --af-* tokens.",
        'Never infer undocumented inputs or outputs. Components marked legacy-undocumented are discoverable but not recommended by default.',
        'ArgFit UI owns reusable presentation; consumer applications retain routing, OAuth, data fetching and business state.',
      ].join(' '),
    },
  );

  registerResources(server, catalog, storybookOrigin);
  registerTools(server, catalog, storybookOrigin);
  registerPrompts(server, catalog);
  return server;
}

function registerResources(server: McpServer, catalog: ArgfitCatalog, origin?: string): void {
  server.registerResource(
    'argfit-ui-catalog',
    'argfit://catalog',
    {
      title: `ArgFit UI ${catalog.library.version} catalog`,
      description: 'Generated component, API, token and Storybook catalog.',
      mimeType: 'application/json',
    },
    (uri) => resource(uri, catalog),
  );

  server.registerResource(
    'argfit-ui-components',
    new ResourceTemplate('argfit://components/{componentId}', {
      list: () => ({
        resources: catalog.components.map((component) => ({
          name: component.name,
          title: component.title,
          description: component.description || `Status: ${component.status}`,
          uri: `argfit://components/${component.id}`,
          mimeType: 'application/json',
        })),
      }),
      complete: {
        componentId: (value) => catalog.components
          .filter((component) => component.id.startsWith(value) || component.name.toLowerCase().startsWith(value.toLowerCase()))
          .slice(0, 20)
          .map((component) => component.id),
      },
    }),
    {
      title: 'ArgFit UI component',
      description: 'Public API, examples and Storybook evidence for one component.',
      mimeType: 'application/json',
    },
    (uri, variables) => {
      const component = findComponent(catalog, String(variables['componentId'] ?? ''));
      return component
        ? resource(uri, componentWithLinks(catalog, component, origin))
        : textResource(uri, `Unknown ArgFit UI component: ${String(variables['componentId'] ?? '')}`);
    },
  );

  server.registerResource(
    'argfit-ui-tokens',
    new ResourceTemplate('argfit://tokens/{theme}', {
      list: () => ({
        resources: (['dark', 'light'] as const).map((theme) => ({
          name: `${theme} tokens`,
          title: `ArgFit UI ${theme} tokens`,
          uri: `argfit://tokens/${theme}`,
          mimeType: 'application/json',
        })),
      }),
      complete: { theme: () => ['dark', 'light'] },
    }),
    {
      title: 'ArgFit UI design tokens',
      description: 'Semantic theme token values.',
      mimeType: 'application/json',
    },
    (uri, variables) => {
      const theme = String(variables['theme'] ?? 'dark');
      if (theme !== 'dark' && theme !== 'light') return textResource(uri, `Unknown theme: ${theme}`);
      return resource(uri, { version: catalog.library.version, theme, tokens: getTokens(catalog, { theme }) });
    },
  );

  server.registerResource(
    'argfit-ui-component-workflow',
    'argfit://guides/component-workflow',
    {
      title: 'ArgFit UI component workflow',
      description: 'Canonical Storybook-first workflow for creating and documenting components.',
      mimeType: 'text/markdown',
    },
    (uri) => ({
      contents: [{ uri: uri.toString(), mimeType: 'text/markdown', text: catalog.guides[0]?.content ?? '' }],
    }),
  );

  server.registerResource(
    'argfit-ui-storybook',
    new ResourceTemplate('argfit://storybook/{storyId}', {
      list: () => ({
        resources: catalog.components.flatMap((component) => component.stories.map((story) => ({
          name: story.id,
          title: `${component.name} / ${story.name}`,
          uri: `argfit://storybook/${story.id}`,
          description: `Storybook story for ${component.name}.`,
          mimeType: 'application/json',
        }))),
      }),
      complete: {
        storyId: (value) => catalog.components
          .flatMap((component) => component.stories)
          .filter((story) => story.id.startsWith(value))
          .slice(0, 20)
          .map((story) => story.id),
      },
    }),
    {
      title: 'ArgFit UI Storybook story',
      description: 'Resolvable link to a canonical Storybook story.',
      mimeType: 'application/json',
    },
    (uri, variables) => {
      const storyId = String(variables['storyId'] ?? '');
      for (const component of catalog.components) {
        const story = component.stories.find((candidate) => candidate.id === storyId);
        if (story) {
          return resource(uri, {
            version: catalog.library.version,
            component: component.name,
            story: story.name,
            url: absoluteStorybookUrl(catalog, story.url, origin),
          });
        }
      }
      return textResource(uri, `Unknown Storybook story: ${storyId}`);
    },
  );
}

function registerTools(server: McpServer, catalog: ArgfitCatalog, origin?: string): void {
  const versionSchema = z.string().max(50).optional().describe('ArgFit UI version or latest.');

  server.registerTool(
    'search_components',
    {
      title: 'Search ArgFit UI components',
      description: 'Find documented ArgFit UI components by name, intent, category, platform or API capability.',
      inputSchema: {
        query: z.string().min(1).max(500),
        category: z.string().max(80).optional(),
        platform: z.enum(['desktop', 'mobile']).optional(),
        status: z.enum(['documented', 'experimental', 'legacy-undocumented']).optional(),
        includeLegacy: z.boolean().default(false),
        limit: z.number().int().min(1).max(20).default(8),
        version: versionSchema,
      },
      annotations: readOnlyAnnotations,
    },
    ({ query, category, platform, status, includeLegacy, limit, version }) => {
      const notice = checkVersion(catalog, version);
      if (!notice.compatible) return toolError(notice.message, catalog);
      const results = searchComponents(catalog, {
        query,
        category,
        platform: platform as Platform | undefined,
        status: status as ComponentStatus | undefined,
        includeLegacy,
        limit,
      }).map(({ component, score, matches }) => ({
        ...componentSummary(catalog, component, origin),
        score,
        matches,
      }));
      return toolResult(catalog, { query, results, version: notice });
    },
  );

  server.registerTool(
    'get_component',
    {
      title: 'Get an ArgFit UI component',
      description: 'Return the exact public API, canonical example, tokens and Storybook links for one component.',
      inputSchema: {
        component: z.string().min(1).max(120),
        version: versionSchema,
      },
      annotations: readOnlyAnnotations,
    },
    ({ component: identifier, version }) => {
      const notice = checkVersion(catalog, version);
      if (!notice.compatible) return toolError(notice.message, catalog);
      const component = findComponent(catalog, identifier);
      if (!component) return toolError(`Unknown ArgFit UI component: ${identifier}.`, catalog);
      return toolResult(catalog, { component: componentWithLinks(catalog, component, origin), version: notice });
    },
  );

  server.registerTool(
    'recommend_components',
    {
      title: 'Recommend an ArgFit UI composition',
      description: 'Recommend documented components for a UI intent while keeping business logic in the application.',
      inputSchema: {
        intent: z.string().min(1).max(1000),
        platform: z.enum(['desktop', 'mobile']).optional(),
        version: versionSchema,
      },
      annotations: readOnlyAnnotations,
    },
    ({ intent, platform, version }) => {
      const notice = checkVersion(catalog, version);
      if (!notice.compatible) return toolError(notice.message, catalog);
      const recommendations = recommendComponents(catalog, intent, platform as Platform | undefined).map(
        ({ component, ...recommendation }) => ({
          ...recommendation,
          component: componentSummary(catalog, component, origin),
        }),
      );
      return toolResult(catalog, {
        intent,
        recommendations,
        boundary: 'Keep routing, OAuth, fetching, timers and business state in the consumer application.',
        version: notice,
      });
    },
  );

  server.registerTool(
    'generate_usage',
    {
      title: 'Generate ArgFit UI usage',
      description: 'Return deterministic Angular imports and canonical Storybook markup without writing files.',
      inputSchema: {
        components: z.array(z.string().min(1).max(120)).min(1).max(8),
        version: versionSchema,
      },
      annotations: readOnlyAnnotations,
    },
    ({ components, version }) => {
      const notice = checkVersion(catalog, version);
      if (!notice.compatible) return toolError(notice.message, catalog);
      const result = generateUsage(catalog, components);
      const unknown = components.filter((identifier) => !findComponent(catalog, identifier));
      if (unknown.length > 0) return toolError(`Unknown components: ${unknown.join(', ')}.`, catalog);
      return toolResult(catalog, {
        imports: result.imports,
        template: result.template,
        warnings: result.warnings,
        evidence: result.components.map((component) => componentSummary(catalog, component, origin)),
        version: notice,
      });
    },
  );

  server.registerTool(
    'validate_usage',
    {
      title: 'Validate ArgFit UI usage',
      description: 'Statically inspect a snippet for invalid APIs, vendor leakage, raw colors, unknown tokens and basic accessibility gaps.',
      inputSchema: {
        snippet: z.string().min(1).max(65_536),
        version: versionSchema,
      },
      annotations: readOnlyAnnotations,
    },
    ({ snippet, version }) => {
      const notice = checkVersion(catalog, version);
      if (!notice.compatible) return toolError(notice.message, catalog);
      const diagnostics = validateUsage(catalog, snippet);
      return toolResult(catalog, {
        valid: !diagnostics.some((diagnostic) => diagnostic.severity === 'error'),
        diagnostics,
        summary: {
          errors: diagnostics.filter((diagnostic) => diagnostic.severity === 'error').length,
          warnings: diagnostics.filter((diagnostic) => diagnostic.severity === 'warning').length,
          info: diagnostics.filter((diagnostic) => diagnostic.severity === 'info').length,
        },
        version: notice,
      });
    },
  );

  server.registerTool(
    'get_design_tokens',
    {
      title: 'Get ArgFit UI design tokens',
      description: 'Query supported semantic design tokens by theme, family or text.',
      inputSchema: {
        theme: z.enum(['dark', 'light']).default('dark'),
        family: z.string().max(80).optional(),
        query: z.string().max(120).optional(),
        version: versionSchema,
      },
      annotations: readOnlyAnnotations,
    },
    ({ theme, family, query, version }) => {
      const notice = checkVersion(catalog, version);
      if (!notice.compatible) return toolError(notice.message, catalog);
      return toolResult(catalog, {
        theme,
        tokens: getTokens(catalog, { theme: theme as Theme, family, query }),
        version: notice,
      });
    },
  );
}

function registerPrompts(server: McpServer, catalog: ArgfitCatalog): void {
  server.registerPrompt(
    'compose-with-argfit',
    {
      title: 'Compose a screen with ArgFit UI',
      description: 'Guide an agent to discover and compose documented adaptive components.',
      argsSchema: { intent: z.string().min(1).max(1000) },
    },
    ({ intent }) => ({
      description: `Compose ${intent} using ArgFit UI ${catalog.library.version}.`,
      messages: [{
        role: 'user',
        content: {
          type: 'text',
          text: `Use recommend_components for this intent: ${intent}. Inspect each result with get_component, then call generate_usage. Prefer @argfit-ui/adaptive and --af-* tokens. Keep routing, OAuth, fetching and business state outside ArgFit UI. Cite the returned Storybook evidence.`,
        },
      }],
    }),
  );

  server.registerPrompt(
    'review-argfit-usage',
    {
      title: 'Review ArgFit UI usage',
      description: 'Review an Angular snippet for duplicated UI, invalid APIs and design-system violations.',
      argsSchema: { snippet: z.string().min(1).max(65_536) },
    },
    ({ snippet }) => ({
      description: `Review code against ArgFit UI ${catalog.library.version}.`,
      messages: [{
        role: 'user',
        content: {
          type: 'text',
          text: `Call validate_usage with the following snippet. For each diagnostic, use search_components and get_component to propose a documented adaptive replacement. Do not invent APIs or edit files.\n\n${snippet}`,
        },
      }],
    }),
  );
}

function componentSummary(catalog: ArgfitCatalog, component: CatalogComponent, origin?: string): Record<string, unknown> {
  return {
    id: component.id,
    name: component.name,
    selector: component.selector,
    category: component.category,
    status: component.status,
    description: component.description,
    importStatement: component.importStatement,
    useWhen: component.useWhen,
    docsUrl: absoluteStorybookUrl(catalog, component.docsUrl, origin),
  };
}

function componentWithLinks(catalog: ArgfitCatalog, component: CatalogComponent, origin?: string): Record<string, unknown> {
  return {
    ...component,
    docsUrl: absoluteStorybookUrl(catalog, component.docsUrl, origin),
    stories: component.stories.map((story) => ({
      ...story,
      url: absoluteStorybookUrl(catalog, story.url, origin),
    })),
  };
}

function resource(uri: URL, value: unknown) {
  return {
    contents: [{ uri: uri.toString(), mimeType: 'application/json', text: JSON.stringify(value, null, 2) }],
  };
}

function textResource(uri: URL, text: string) {
  return { contents: [{ uri: uri.toString(), mimeType: 'text/plain', text }] };
}

function toolResult(catalog: ArgfitCatalog, value: Record<string, unknown>) {
  const payload = {
    catalog: {
      version: catalog.library.version,
      schemaVersion: catalog.schemaVersion,
      gitSha: catalog.library.gitSha,
    },
    ...value,
  };
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(payload, null, 2) }],
    structuredContent: payload,
  };
}

function toolError(message: string, catalog: ArgfitCatalog) {
  return {
    isError: true,
    content: [{
      type: 'text' as const,
      text: JSON.stringify({ error: message, availableVersion: catalog.library.version }, null, 2),
    }],
  };
}
