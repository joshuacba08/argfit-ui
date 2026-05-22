import { existsSync, mkdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const outputDirectory = resolve(repoRoot, '.tmp', 'visual-regression', 'beta-plus');
const distDirectory = resolveDistDirectory();
const failures = [];

rmSync(outputDirectory, { recursive: true, force: true });
mkdirSync(outputDirectory, { recursive: true });

const server = createStaticServer(distDirectory);
await new Promise((resolveServer) => server.listen(0, '127.0.0.1', resolveServer));

const address = server.address();

if (!address || typeof address === 'string') {
  server.close();
  throw new Error('Visual Beta+ smoke could not bind a local HTTP port.');
}

const baseUrl = `http://127.0.0.1:${address.port}`;
const browser = await chromium.launch({ headless: true });

try {
  await runScenario(browser, {
    name: 'beta-plus-overlays-desktop-dark',
    viewport: { width: 1440, height: 1100 },
    execute: async (page) => {
      await setPlatform(page, 'desktop');
      await setTheme(page, 'dark');
      await waitForVisible(page, '[data-qa="overlays"]');
      await page.locator('[data-qa="overlays"]').scrollIntoViewIfNeeded();
      await clickQa(page, 'popover-toggle');
      await clickQa(page, 'drawer-open');
      await waitForVisible(page, 'af-drawer-desktop');
      await assertMinimumCount(page, 'af-tooltip-desktop', 1, 'desktop tooltips');
      await assertMinimumCount(page, 'af-popover-desktop', 1, 'desktop popovers');
      await assertMinimumCount(page, 'af-drawer-desktop', 1, 'desktop drawers');
      await assertContainsText(page, '[data-qa="overlays"]', 'Overlay surfaces');
    },
  });

  await runScenario(browser, {
    name: 'beta-plus-forms-desktop-dark',
    viewport: { width: 1440, height: 1250 },
    execute: async (page) => {
      await setPlatform(page, 'desktop');
      await setTheme(page, 'dark');
      await waitForVisible(page, '[data-qa="forms"]');
      await page.locator('[data-qa="forms"]').scrollIntoViewIfNeeded();
      await openDesktopMultiSelect(page);
      await assertMinimumCount(page, '[data-qa="input-count-control"] af-input-count-desktop', 1, 'desktop input-count controls');
      await assertMinimumCount(page, '[data-qa="multi-select-control"] af-multi-select-desktop', 1, 'desktop multi-select controls');
      await assertMinimumCount(page, '[data-qa="date-picker-control"] af-date-picker-desktop', 1, 'desktop date-picker controls');
      await assertMinimumCount(page, '[data-qa="listbox-control"] af-listbox-desktop', 1, 'desktop listbox controls');
    },
  });

  await runScenario(browser, {
    name: 'beta-plus-forms-desktop-light',
    viewport: { width: 1440, height: 1250 },
    execute: async (page) => {
      await setPlatform(page, 'desktop');
      await setTheme(page, 'light');
      await waitForVisible(page, '[data-qa="forms"]');
      await page.locator('[data-qa="forms"]').scrollIntoViewIfNeeded();
      await openDesktopMultiSelect(page);
      await assertMinimumCount(page, '[data-qa="input-count-control"] af-input-count-desktop', 1, 'light input-count controls');
      await assertMinimumCount(page, '[data-qa="multi-select-control"] .af-popover-desktop__panel', 1, 'open multi-select desktop popovers');
      await assertMinimumCount(page, '[data-qa="date-picker-control"] af-date-picker-desktop', 1, 'light date-picker controls');
      await assertMinimumCount(page, '[data-qa="listbox-control"] af-listbox-desktop', 1, 'light listbox controls');
    },
  });

  await runScenario(browser, {
    name: 'beta-plus-data-layout-desktop-dark',
    viewport: { width: 1440, height: 1600 },
    execute: async (page) => {
      await setPlatform(page, 'desktop');
      await setTheme(page, 'dark');
      await waitForVisible(page, '[data-qa="data"]');
      await page.locator('[data-qa="data"]').scrollIntoViewIfNeeded();
      await assertMinimumCount(page, '[data-qa="data-view-control"] af-data-view-desktop', 1, 'desktop data view components');
      await assertMinimumCount(page, '[data-qa="timeline-control"] af-timeline-desktop', 1, 'desktop timeline components');
      await assertMinimumCount(page, '[data-qa="tree-control"] af-tree-desktop', 1, 'desktop tree components');
      await assertMinimumCount(page, '[data-qa="tabs-control"] af-tabs-desktop', 1, 'desktop tabs components');
      await assertMinimumCount(page, '[data-qa="stepper-control"] af-stepper-desktop', 1, 'desktop stepper components');
      await assertMinimumCount(page, '[data-qa="splitter-control"] af-splitter-desktop', 1, 'desktop splitter components');
    },
  });

  await runScenario(browser, {
    name: 'beta-plus-mobile-suite-dark',
    viewport: { width: 390, height: 1200 },
    execute: async (page) => {
      await setPlatform(page, 'mobile');
      await setTheme(page, 'dark');
      await waitForVisible(page, '[data-qa="forms"]');
      await page.locator('[data-qa="forms"]').scrollIntoViewIfNeeded();
      await openMobileMultiSelect(page);
      await assertMinimumCount(page, '[data-qa="input-count-control"] af-input-count-mobile', 1, 'mobile input-count controls');
      await assertMinimumCount(page, '[data-qa="multi-select-control"] af-multi-select-mobile', 1, 'mobile multi-select controls');
      await assertMinimumCount(page, 'af-drawer-mobile', 1, 'touch-first multi-select drawers');
      await assertMinimumCount(page, '[data-qa="date-picker-control"] af-date-picker-mobile', 1, 'mobile date-picker controls');
      await assertMinimumCount(page, '[data-qa="listbox-control"] af-listbox-mobile', 1, 'mobile listbox controls');
      await assertMinimumCount(page, '[data-qa="data-view-control"] af-data-view-mobile', 1, 'mobile data view components');
      await assertMinimumCount(page, '[data-qa="timeline-control"] af-timeline-mobile', 1, 'mobile timeline components');
      await assertMinimumCount(page, '[data-qa="tree-control"] af-tree-mobile', 1, 'mobile tree components');
      await assertMinimumCount(page, '[data-qa="tabs-control"] af-tabs-mobile', 1, 'mobile tabs components');
      await assertMinimumCount(page, '[data-qa="stepper-control"] af-stepper-mobile', 1, 'mobile stepper components');
      await assertMinimumCount(page, '[data-qa="splitter-control"] af-splitter-mobile', 1, 'mobile splitter components');
    },
  });

  await runScenario(browser, {
    name: 'beta-plus-kanban-desktop-dark',
    viewport: { width: 1440, height: 1500 },
    execute: async (page) => {
      await setPlatform(page, 'desktop');
      await setTheme(page, 'dark');
      await waitForVisible(page, '[data-qa="workflow"]');
      await page.locator('[data-qa="workflow"]').scrollIntoViewIfNeeded();
      await assertMinimumCount(page, 'af-kanban-desktop', 1, 'desktop kanban hosts');
      await assertMinimumCount(page, '.af-kanban-desktop__column', 4, 'desktop kanban columns');
      await assertMinimumCount(page, '.af-kanban-desktop__card', 6, 'desktop kanban cards');
      await assertContainsText(page, '[data-qa="workflow"]', 'Workflow Beta+: AfKanban');
    },
  });

  await runScenario(browser, {
    name: 'beta-plus-kanban-drop-active-desktop-dark',
    viewport: { width: 1440, height: 1500 },
    execute: async (page) => {
      await setPlatform(page, 'desktop');
      await setTheme(page, 'dark');
      await waitForVisible(page, '[data-qa="workflow"]');
      await page.locator('[data-qa="workflow"]').scrollIntoViewIfNeeded();
      await page.evaluate(() => {
        document.querySelectorAll('.af-kanban-desktop__column')[1]?.classList.add('af-kanban-desktop__column--drop-active');
      });
      await assertMinimumCount(page, '.af-kanban-desktop__column--drop-active', 1, 'active kanban drop targets');
    },
  });

  await runScenario(browser, {
    name: 'beta-plus-kanban-mobile-dark',
    viewport: { width: 390, height: 1100 },
    execute: async (page) => {
      await setPlatform(page, 'mobile');
      await setTheme(page, 'dark');
      await waitForVisible(page, '[data-qa="workflow"]');
      await page.locator('[data-qa="workflow"]').scrollIntoViewIfNeeded();
      await assertMinimumCount(page, 'af-kanban-mobile', 1, 'mobile kanban hosts');
      await assertMinimumCount(page, '.af-kanban-mobile__column', 4, 'mobile kanban columns');
      await assertMinimumCount(page, '.af-kanban-mobile__card', 4, 'mobile kanban cards');
    },
  });
} finally {
  await browser.close();
  await new Promise((resolveServer) => server.close(resolveServer));
}

if (failures.length > 0) {
  console.error('Visual Beta+ smoke failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Visual Beta+ smoke passed. Screenshots written to ${outputDirectory}.`);

async function runScenario(browserInstance, scenario) {
  const context = await browserInstance.newContext({
    colorScheme: 'dark',
    viewport: scenario.viewport,
  });
  const page = await context.newPage();

  try {
    console.log(`Running scenario: ${scenario.name}`);
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await waitForVisible(page, '[data-qa="consumer-shell"]');
    await scenario.execute(page);
    await assertNonEmptyScreenshotTarget(page);
    await page.screenshot({
      path: resolve(outputDirectory, `${scenario.name}.png`),
      fullPage: true,
    });
    console.log(`Completed scenario: ${scenario.name}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failures.push(`${scenario.name}: ${message}`);
  } finally {
    await context.close();
  }
}

function resolveDistDirectory() {
  const candidates = [
    resolve(repoRoot, '.tmp', 'beta-plus-consumer', 'dist', 'beta-plus-consumer', 'browser'),
    resolve(repoRoot, '.tmp', 'beta-plus-consumer', 'dist', 'beta-plus-consumer'),
  ];

  for (const candidate of candidates) {
    if (existsSync(resolve(candidate, 'index.html'))) {
      return candidate;
    }
  }

  throw new Error('Visual Beta+ smoke expected a built consumer app in .tmp/beta-plus-consumer/dist. Run pnpm beta-plus:consumer-smoke first.');
}

function createStaticServer(rootDirectory) {
  return createServer((request, response) => {
    const requestPath = request.url?.split('?')[0] ?? '/';
    const filePath = resolveRequestPath(rootDirectory, requestPath);

    try {
      const selectedPath = statSync(filePath).isDirectory() ? resolve(filePath, 'index.html') : filePath;
      const content = readFileSync(selectedPath);
      response.statusCode = 200;
      response.setHeader('Content-Type', contentTypeFor(selectedPath));
      response.end(content);
    } catch {
      const fallbackPath = resolve(rootDirectory, 'index.html');

      if (!existsSync(fallbackPath)) {
        response.statusCode = 404;
        response.end('Not found');
        return;
      }

      response.statusCode = 200;
      response.setHeader('Content-Type', 'text/html; charset=utf-8');
      response.end(readFileSync(fallbackPath));
    }
  });
}

function resolveRequestPath(rootDirectory, requestPath) {
  const normalizedPath = requestPath === '/' ? '/index.html' : requestPath;
  const resolvedPath = resolve(rootDirectory, `.${normalizedPath}`);

  if (!resolvedPath.startsWith(rootDirectory)) {
    return resolve(rootDirectory, 'index.html');
  }

  return resolvedPath;
}

function contentTypeFor(filePath) {
  switch (extname(filePath)) {
    case '.html':
      return 'text/html; charset=utf-8';
    case '.js':
      return 'application/javascript; charset=utf-8';
    case '.css':
      return 'text/css; charset=utf-8';
    case '.svg':
      return 'image/svg+xml';
    case '.json':
      return 'application/json; charset=utf-8';
    case '.png':
      return 'image/png';
    case '.woff2':
      return 'font/woff2';
    default:
      return 'application/octet-stream';
  }
}

async function clickQa(page, dataQa) {
  const locator = page.locator(`[data-qa="${dataQa}"]`);
  if ((await locator.count()) === 0) {
    throw new Error(`Expected to find data-qa selector ${dataQa}.`);
  }
  await locator.first().click({ force: true });
}

async function setPlatform(page, platform) {
  await clickQa(page, `platform-${platform}`);
  await page.waitForFunction(
    (expectedPlatform) => document.querySelector('[data-qa="consumer-shell"]')?.getAttribute('data-platform') === expectedPlatform,
    platform,
  );
}

async function setTheme(page, theme) {
  const currentTheme = await page.evaluate(() => document.documentElement.dataset.theme ?? 'dark');
  if (currentTheme === theme) {
    return;
  }

  await clickQa(page, `theme-${theme}`);
  await page.waitForFunction((expectedTheme) => document.documentElement.dataset.theme === expectedTheme, theme);
}

async function openDesktopMultiSelect(page) {
  const trigger = page.locator('[data-qa="multi-select-control"] .af-popover-desktop__trigger');
  if ((await trigger.count()) === 0) {
    throw new Error('Expected a desktop multi-select trigger.');
  }
  await trigger.first().click({ force: true });
  await waitForVisible(page, '[data-qa="multi-select-control"] .af-popover-desktop__panel');
}

async function openMobileMultiSelect(page) {
  const trigger = page.locator('[data-qa="multi-select-control"] .af-multi-select-mobile__trigger');
  if ((await trigger.count()) === 0) {
    throw new Error('Expected a mobile multi-select trigger.');
  }
  await trigger.first().click({ force: true });
  await waitForVisible(page, '[data-qa="multi-select-control"] af-drawer-mobile[data-open]');
}

async function waitForVisible(page, selector) {
  await page.locator(selector).first().waitFor({ state: 'visible' });
}

async function assertMinimumCount(page, selector, minimum, label) {
  const count = await page.locator(selector).count();
  if (count < minimum) {
    throw new Error(`Expected at least ${minimum} ${label}, found ${count}.`);
  }
}

async function assertContainsText(page, selector, text) {
  const locator = page.locator(selector).filter({ hasText: text });
  if ((await locator.count()) === 0) {
    throw new Error(`Expected ${selector} to contain ${JSON.stringify(text)}.`);
  }
}

async function assertNonEmptyScreenshotTarget(page) {
  const textContent = (await page.locator('body').textContent())?.trim() ?? '';
  if (textContent.length === 0) {
    throw new Error('Screenshot target rendered no visible text content.');
  }
}
