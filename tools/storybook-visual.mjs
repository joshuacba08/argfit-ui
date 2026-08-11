import AxeBuilder from '@axe-core/playwright';
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { mkdir, readFile, stat } from 'node:fs/promises';
import { extname, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const buildRoot = resolve(workspaceRoot, 'dist', 'storybook', 'showcase');
const screenshotRoot = resolve(workspaceRoot, '.tmp', 'storybook-visual');
const mode = process.argv.find((argument) => argument.startsWith('--')) ?? '--smoke';
const canonicalStoryIds = [
  'components-actions-button--primary',
  'components-surfaces-card--default',
  'components-forms-input--primary',
  'components-forms-select--searchable',
  'components-forms-textarea--default',
  'components-identity-badge--default',
  'components-identity-avatar--default',
  'components-identity-chip--default',
  'feedback-inlinemessage--default',
  'feedback-progress--default',
  'components-overlays-dialog--default',
  'components-forms-segmentedcontrol--default',
  'components-forms-datepicker--default',
  'experimental-imagecropper--default',
  'data-metriccard--default',
  'data-datatable--default',
  'patterns-authentication-unifiedaccess--access',
];
const storyIds = process.env['STORYBOOK_STORY']
  ? [process.env['STORYBOOK_STORY']]
  : canonicalStoryIds;
const criticalA11yStories = new Set([
  'components-actions-button--primary',
  'components-forms-input--primary',
  'components-forms-select--searchable',
  'components-overlays-dialog--default',
  'components-forms-datepicker--default',
  'experimental-imagecropper--default',
  'patterns-authentication-unifiedaccess--access',
]);
const matrices = [
  { platform: 'desktop', theme: 'dark', width: 1280, height: 800 },
  { platform: 'desktop', theme: 'light', width: 1280, height: 800 },
  { platform: 'mobile', theme: 'dark', width: 390, height: 844 },
  { platform: 'mobile', theme: 'light', width: 390, height: 844 },
];
const failures = [];

if (!['--smoke', '--a11y', '--visual'].includes(mode)) {
  throw new Error('Unknown mode ' + mode + '. Use --smoke, --a11y or --visual.');
}

if (!existsSync(resolve(buildRoot, 'index.html'))) {
  throw new Error('Storybook build not found. Run pnpm build-storybook first.');
}

if (mode === '--visual') {
  await mkdir(screenshotRoot, { recursive: true });
}

const server = await startStaticServer();
const browser = await chromium.launch({ headless: true });

try {
  for (const storyId of storyIds) {
    for (const matrix of matrices) {
      if (mode === '--a11y' && !criticalA11yStories.has(storyId)) {
        continue;
      }

      await validateStory(browser, server.url, storyId, matrix);
    }
  }
} finally {
  await browser.close();
  await server.close();
}

if (failures.length > 0) {
  console.error('Storybook ' + mode.slice(2) + ' validation failed:');
  failures.forEach((failure) => console.error('- ' + failure));
  process.exit(1);
}

const validatedStories = mode === '--a11y' ? criticalA11yStories.size : storyIds.length;
console.log(
  'Storybook ' +
    mode.slice(2) +
    ' passed: ' +
    validatedStories +
    ' stories across ' +
    matrices.length +
    ' platform/theme matrices.',
);

async function validateStory(browserInstance, baseUrl, storyId, matrix) {
  const label = storyId + ' [' + matrix.platform + '/' + matrix.theme + ']';
  const context = await browserInstance.newContext({
    viewport: { width: matrix.width, height: matrix.height },
    colorScheme: matrix.theme,
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const failedResponses = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400) {
      failedResponses.push(response.status() + ' ' + response.url());
    }
  });

  try {
    const globals = 'theme:' + matrix.theme + ';platform:' + matrix.platform;
    const url =
      baseUrl +
      '/iframe.html?id=' +
      storyId +
      '&viewMode=story&globals=' +
      encodeURIComponent(globals);
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 });

    if (!response?.ok()) {
      failures.push(label + ': HTTP ' + (response?.status() ?? 'unknown') + '.');
      return;
    }

    await page.locator('#storybook-root').waitFor({ state: 'attached', timeout: 15_000 });
    await page.waitForFunction(
      () => {
        const root = document.querySelector('#storybook-root');
        const token = getComputedStyle(document.documentElement)
          .getPropertyValue('--af-bg-main')
          .trim();
        return Boolean(root?.children.length && token);
      },
      undefined,
      { timeout: 15_000 },
    );

    const state = await page.evaluate(() => {
      const root = document.querySelector('#storybook-root');
      const visibleSurface =
        document.querySelector('[role="dialog"]') ?? root?.firstElementChild ?? root;
      const bounds = visibleSurface?.getBoundingClientRect();
      return {
        theme: document.documentElement.dataset['theme'],
        platform: document.documentElement.dataset['afPlatform'],
        backgroundToken: getComputedStyle(document.documentElement)
          .getPropertyValue('--af-bg-main')
          .trim(),
        childCount: root?.children.length ?? 0,
        width: bounds?.width ?? 0,
        height: bounds?.height ?? 0,
      };
    });

    if (state.theme !== matrix.theme) {
      failures.push(
        label +
          ': expected data-theme=' +
          matrix.theme +
          ', received ' +
          (state.theme ?? 'none') +
          '.',
      );
    }
    if (state.platform !== matrix.platform) {
      failures.push(
        label +
          ': expected data-af-platform=' +
          matrix.platform +
          ', received ' +
          (state.platform ?? 'none') +
          '.',
      );
    }
    if (!state.backgroundToken) {
      failures.push(label + ': --af-bg-main is missing.');
    }
    if (state.childCount === 0 || state.width < 1 || state.height < 1) {
      failures.push(label + ': Storybook canvas is empty.');
    }

    if (mode === '--a11y') {
      const axeTarget = (await page.locator('[role="dialog"]').count())
        ? '[role="dialog"]'
        : '#storybook-root';
      const results = await new AxeBuilder({ page }).include(axeTarget).analyze();
      const blocking = results.violations.filter((violation) =>
        ['serious', 'critical'].includes(violation.impact ?? ''),
      );
      blocking.forEach((violation) =>
        failures.push(
          label +
            ': axe ' +
            violation.id +
            ' (' +
            violation.impact +
            ') — ' +
            violation.help +
            '. ' +
            violation.nodes
              .map((node) => node.target.join(' ') + ': ' + node.failureSummary)
              .join(' | '),
        ),
      );
    }

    if (mode === '--visual') {
      await page.screenshot({
        path: resolve(
          screenshotRoot,
          storyId + '-' + matrix.platform + '-' + matrix.theme + '.png',
        ),
        fullPage: true,
      });
    }

    consoleErrors.forEach((error) => failures.push(label + ': console error — ' + error));
    failedResponses.forEach((error) => failures.push(label + ': failed response — ' + error));
  } catch (error) {
    failures.push(label + ': ' + (error instanceof Error ? error.message : String(error)));
  } finally {
    await context.close();
  }
}

async function startStaticServer() {
  const serverInstance = createServer(async (request, response) => {
    const rawPath = new URL(request.url ?? '/', 'http://localhost').pathname;
    const relativePath = rawPath === '/' ? 'index.html' : decodeURIComponent(rawPath.slice(1));
    const filePath = resolve(buildRoot, normalize(relativePath));

    if (
      filePath !== buildRoot &&
      !filePath.startsWith(buildRoot + '\\') &&
      !filePath.startsWith(buildRoot + '/')
    ) {
      response.writeHead(403).end('Forbidden');
      return;
    }

    try {
      const fileStat = await stat(filePath);
      const resolvedFile = fileStat.isDirectory() ? resolve(filePath, 'index.html') : filePath;
      const body = await readFile(resolvedFile);
      response.writeHead(200, { 'content-type': mimeType(resolvedFile) });
      response.end(body);
    } catch {
      response.writeHead(404).end('Not found');
    }
  });

  await new Promise((resolveListen) => serverInstance.listen(0, '127.0.0.1', resolveListen));
  const address = serverInstance.address();
  if (!address || typeof address === 'string') {
    throw new Error('Could not start Storybook validation server.');
  }

  return {
    url: 'http://127.0.0.1:' + address.port,
    close: () =>
      new Promise((resolveClose, rejectClose) =>
        serverInstance.close((error) => (error ? rejectClose(error) : resolveClose())),
      ),
  };
}

function mimeType(filePath) {
  return (
    {
      '.css': 'text/css',
      '.html': 'text/html',
      '.ico': 'image/x-icon',
      '.js': 'text/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.svg': 'image/svg+xml',
      '.woff2': 'font/woff2',
    }[extname(filePath)] ?? 'application/octet-stream'
  );
}
