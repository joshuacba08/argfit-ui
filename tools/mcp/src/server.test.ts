import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { afterEach, describe, expect, it } from 'vitest';

import { loadCatalog } from './catalog.js';
import { createArgfitMcpServer } from './server.js';

describe('ArgFit MCP protocol', () => {
  const cleanup: Array<() => Promise<void>> = [];

  afterEach(async () => {
    await Promise.all(cleanup.splice(0).map((close) => close()));
  });

  it('exposes tools, resources and prompts through MCP', async () => {
    const catalog = loadCatalog();
    const server = createArgfitMcpServer({ catalog, storybookOrigin: 'https://ui.argfit.example' });
    const client = new Client({ name: 'argfit-mcp-test', version: '1.0.0' });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    cleanup.push(async () => {
      await client.close();
      await server.close();
    });

    await server.connect(serverTransport);
    await client.connect(clientTransport);

    const tools = await client.listTools();
    expect(tools.tools.map((tool) => tool.name)).toEqual(
      expect.arrayContaining([
        'search_components',
        'get_component',
        'recommend_components',
        'generate_usage',
        'validate_usage',
        'get_design_tokens',
      ]),
    );

    const result = await client.callTool({
      name: 'search_components',
      arguments: { query: 'searchable select with infinite scroll' },
    });
    const text = result.content.find((content) => content.type === 'text');
    expect(text?.type === 'text' ? text.text : '').toContain('AfSelect');

    const commandPalette = await client.callTool({
      name: 'get_component',
      arguments: { component: 'AfCommandPalette' },
    });
    const commandPaletteText = commandPalette.content.find((content) => content.type === 'text');
    expect(commandPaletteText?.type === 'text' ? commandPaletteText.text : '')
      .toContain('commandExecution');

    const usage = await client.callTool({
      name: 'validate_usage',
      arguments: {
        snippet: `import { AfCommandPalette } from '@argfit-ui/adaptive';
          import { provideAfCommandPalette, provideAfCommandExecutor } from '@argfit-ui/core';
          const providers = [
            provideAfCommandPalette({ version: 1, id: 'main', commands: [] }),
            provideAfCommandExecutor('navigate', () => ({ payload }) => navigate(payload)),
          ];
          <af-command-palette (commandExecution)="trackCommand($event)" />`,
      },
    });
    const usageText = usage.content.find((content) => content.type === 'text');
    expect(usageText?.type === 'text' ? usageText.text : '').toContain('"valid": true');

    const component = await client.readResource({ uri: 'argfit://components/select' });
    expect(component.contents[0]?.text).toContain('https://ui.argfit.example/storybook/');

    const prompts = await client.listPrompts();
    expect(prompts.prompts.map((prompt) => prompt.name)).toEqual(
      expect.arrayContaining(['compose-with-argfit', 'review-argfit-usage']),
    );
  });

  it('rejects an unavailable library version instead of mixing contracts', async () => {
    const catalog = loadCatalog();
    const server = createArgfitMcpServer({ catalog });
    const client = new Client({ name: 'argfit-version-test', version: '1.0.0' });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    cleanup.push(async () => {
      await client.close();
      await server.close();
    });
    await server.connect(serverTransport);
    await client.connect(clientTransport);

    const result = await client.callTool({
      name: 'get_component',
      arguments: { component: 'AfButton', version: '0.1.0' },
    });
    expect(result.isError).toBe(true);
    const text = result.content.find((content) => content.type === 'text');
    expect(text?.type === 'text' ? text.text : '').toContain('only contains ArgFit UI');
  });
});
