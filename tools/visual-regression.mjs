import { existsSync, mkdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const outputDirectory = resolve(repoRoot, '.tmp', 'visual-regression', 'current');
const distDirectory = resolveDistDirectory();
const failures = [];

rmSync(outputDirectory, { recursive: true, force: true });
mkdirSync(outputDirectory, { recursive: true });

const server = createStaticServer(distDirectory);
await new Promise((resolveServer) => server.listen(0, '127.0.0.1', resolveServer));

const address = server.address();

if (!address || typeof address === 'string') {
  server.close();
  throw new Error('Visual beta smoke could not bind a local HTTP port.');
}

const baseUrl = `http://127.0.0.1:${address.port}`;
const browser = await chromium.launch({ headless: true });

try {
  await runScenario(browser, {
    name: 'beta-plus-overview-desktop-dark',
    viewport: { width: 1440, height: 900 },
    execute: async (page) => {
      await setPlatform(page, 'desktop');
      await setTheme(page, 'dark');
      await openDesktopSection(page, 'Beta+', '[data-qa="section-alpha"]');
      await assertMinimumCount(page, 'af-card-desktop', 3, 'alpha cards');
      await assertContainsText(page, '[data-qa="section-alpha"]', 'Adaptive API');
      await assertContainsText(page, '[data-qa="section-alpha"]', 'Beta+ wave 5 current slice');
    },
  });

  await runScenario(browser, {
    name: 'beta-plus-forms-desktop-dark',
    viewport: { width: 1440, height: 1200 },
    execute: async (page) => {
      await setPlatform(page, 'desktop');
      await setTheme(page, 'dark');
      await openDesktopSection(page, 'Beta+', '[data-qa="section-alpha"]');
      await waitForVisible(page, '.alpha-wave-grid--forms');
      await page.locator('.alpha-wave-grid--forms').first().scrollIntoViewIfNeeded();
      await assertMinimumCount(page, '.alpha-wave-grid--forms af-input-count-desktop', 1, 'input count controls');
      await assertMinimumCount(page, '.alpha-wave-grid--forms af-multi-select-desktop', 1, 'multi select controls');
      await assertMinimumCount(page, '.alpha-wave-grid--forms af-date-picker-desktop', 1, 'date picker controls');
      await assertMinimumCount(page, '.alpha-wave-grid--forms af-listbox-desktop', 1, 'listbox controls');
      await assertContainsText(page, '[data-qa="section-alpha"]', 'Advanced forms: DatePicker, Listbox y field composition');
    },
  });

  await runScenario(browser, {
    name: 'beta-plus-kanban-desktop-dark',
    viewport: { width: 1440, height: 1500 },
    execute: async (page) => {
      await setPlatform(page, 'desktop');
      await setTheme(page, 'dark');
      await openDesktopSection(page, 'Beta+', '[data-qa="section-alpha"]');
      await waitForVisible(page, 'af-kanban-desktop');
      await page.locator('af-kanban-desktop').first().scrollIntoViewIfNeeded();
      await assertMinimumCount(page, '.af-kanban-desktop__column', 4, 'kanban desktop columns');
      await assertMinimumCount(page, '.af-kanban-desktop__card', 6, 'kanban desktop cards');
      await assertContainsText(page, '[data-qa="section-alpha"]', 'Workflow Beta+: AfKanban');
    },
  });

  await runScenario(browser, {
    name: 'beta-plus-kanban-drop-active-desktop-dark',
    viewport: { width: 1440, height: 1500 },
    execute: async (page) => {
      await setPlatform(page, 'desktop');
      await setTheme(page, 'dark');
      await openDesktopSection(page, 'Beta+', '[data-qa="section-alpha"]');
      await waitForVisible(page, 'af-kanban-desktop');
      await page.locator('af-kanban-desktop').first().scrollIntoViewIfNeeded();
      await page.evaluate(() => {
        document.querySelectorAll('.af-kanban-desktop__column')[1]?.classList.add('af-kanban-desktop__column--drop-active');
      });
      await assertMinimumCount(page, '.af-kanban-desktop__column--drop-active', 1, 'active kanban drop target');
    },
  });

  await runScenario(browser, {
    name: 'beta-plus-kanban-mobile-dark',
    viewport: { width: 390, height: 844 },
    execute: async (page) => {
      await setPlatform(page, 'mobile');
      await setTheme(page, 'dark');
      await openMobileTab(page, 'Beta+', '[data-qa="section-alpha"]');
      await waitForVisible(page, 'af-kanban-mobile');
      await page.locator('af-kanban-mobile').first().scrollIntoViewIfNeeded();
      await assertMinimumCount(page, '.af-kanban-mobile__column', 4, 'kanban mobile columns');
      await assertMinimumCount(page, '.af-kanban-mobile__card', 4, 'kanban mobile cards');
      await assertContainsText(page, '[data-qa="section-alpha"]', 'Workflow Beta+: AfKanban');
    },
  });

  await runScenario(browser, {
    name: 'dashboard-desktop-light',
    viewport: { width: 1440, height: 900 },
    execute: async (page) => {
      await setPlatform(page, 'desktop');
      await setTheme(page, 'light');
      await waitForVisible(page, '[data-qa="section-dashboard"]');
      await assertMinimumCount(page, '.metric-grid af-metric-card-desktop', 4, 'dashboard metrics');
    },
  });

  await runScenario(browser, {
    name: 'dashboard-tablet-dark',
    viewport: { width: 768, height: 1024 },
    execute: async (page) => {
      await setPlatform(page, 'mobile');
      await setTheme(page, 'dark');
      await openMobileTab(page, 'Inicio', '[data-qa="section-dashboard"]');
      await waitForVisible(page, 'af-page-shell-mobile');
      await assertMinimumCount(page, '.metric-grid af-metric-card-mobile', 4, 'tablet mobile metrics');
    },
  });

  await runScenario(browser, {
    name: 'data-table-desktop-dark',
    viewport: { width: 1440, height: 900 },
    execute: async (page) => {
      await setPlatform(page, 'desktop');
      await setTheme(page, 'dark');
      await openDesktopSection(page, 'Tabla avanzada', '[data-qa="section-data-table"]');
      await waitForVisible(page, 'af-data-table-desktop');
      await assertMinimumCount(page, 'tbody tr[tabindex="0"]', 8, 'desktop data rows');
    },
  });

  await runScenario(browser, {
    name: 'data-table-mobile-dark',
    viewport: { width: 1440, height: 900 },
    execute: async (page) => {
      await setPlatform(page, 'desktop');
      await setTheme(page, 'dark');
      await openDesktopSection(page, 'Tabla avanzada', '[data-qa="section-data-table"]');
      await setPlatform(page, 'mobile');
      await page.setViewportSize({ width: 390, height: 844 });
      await waitForVisible(page, 'af-page-shell-mobile');
      await waitForVisible(page, 'af-data-table-mobile');
      await assertCountEquals(page, 'af-data-table-desktop', 0, 'desktop table host in mobile mode');
      await assertMinimumCount(page, 'af-data-table-mobile [role="listitem"]', 8, 'mobile data rows');
    },
  });

  await runScenario(browser, {
    name: 'analytics-desktop-dark',
    viewport: { width: 1440, height: 900 },
    execute: async (page) => {
      await setPlatform(page, 'desktop');
      await setTheme(page, 'dark');
      await openDesktopSection(page, 'Analytics', '[data-qa="section-analytics"]');
      await assertMinimumCount(page, 'af-analytics-card-desktop', 7, 'analytics cards');
      await assertMinimumCount(page, 'af-chart-desktop', 7, 'analytics charts');
    },
  });

  await runScenario(browser, {
    name: 'forms-desktop-dark',
    viewport: { width: 1440, height: 900 },
    execute: async (page) => {
      await setPlatform(page, 'desktop');
      await setTheme(page, 'dark');
      await openDesktopSection(page, 'Formularios', '[data-qa="section-forms"]');
      await waitForVisible(page, 'af-password-desktop');
      await waitForVisible(page, 'af-segmented-control-desktop');
    },
  });

  await runScenario(browser, {
    name: 'forms-mobile-dark',
    viewport: { width: 390, height: 844 },
    execute: async (page) => {
      await setPlatform(page, 'mobile');
      await setTheme(page, 'dark');
      await openMobileTab(page, 'Formularios', '[data-qa="section-forms"]');
      await waitForVisible(page, 'af-password-mobile');
      await assertMinimumCount(page, 'af-password-mobile ion-input-password-toggle', 1, 'mobile password toggles');
      await assertCountEquals(page, 'af-password-desktop', 0, 'desktop password host in mobile mode');
    },
  });

  await runScenario(browser, {
    name: 'feedback-desktop-dark',
    viewport: { width: 1440, height: 900 },
    execute: async (page) => {
      await setPlatform(page, 'desktop');
      await setTheme(page, 'dark');
      await openDesktopSection(page, 'Feedback', '[data-qa="section-feedback"]');
      await assertMinimumCount(page, 'af-inline-message-desktop', 3, 'inline feedback messages');
      await clickByText(page, 'af-button-desktop button', 'Exito');
      await waitForVisible(page, 'af-toast-desktop');
    },
  });

  await runScenario(browser, {
    name: 'dialog-desktop-dark',
    viewport: { width: 1440, height: 900 },
    execute: async (page) => {
      await setPlatform(page, 'desktop');
      await setTheme(page, 'dark');
      await waitForVisible(page, '[data-qa="section-dashboard"]');
      await clickByText(page, '.dialog-trigger-grid af-button-desktop button', 'Ver dispositivo');
      await waitForVisible(page, '.af-dialog-desktop__panel');
      await assertContainsText(page, '.af-dialog-desktop__panel', 'Detalles del dispositivo');
    },
  });
} finally {
  await browser.close();
  await new Promise((resolveServer) => server.close(resolveServer));
}

if (failures.length > 0) {
  console.error('Visual beta smoke failed:');

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exit(1);
}

console.log(`Visual beta smoke passed. Screenshots written to ${outputDirectory}.`);

async function runScenario(browserInstance, scenario) {
  const context = await browserInstance.newContext({
    colorScheme: 'dark',
    viewport: scenario.viewport,
  });
  const page = await context.newPage();

  try {
    console.log(`Running scenario: ${scenario.name}`);
    await page.route('https://fonts.googleapis.com/**', (route) => route.abort());
    await page.route('https://fonts.gstatic.com/**', (route) => route.abort());
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await waitForShellReady(page);
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
    resolve(repoRoot, 'dist', 'showcase', 'browser'),
    resolve(repoRoot, 'dist', 'showcase'),
  ];

  for (const candidate of candidates) {
    if (existsSync(resolve(candidate, 'index.html'))) {
      return candidate;
    }
  }

  throw new Error('Visual beta smoke expected a built showcase in dist/showcase. Run pnpm build:all first.');
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

async function setPlatform(page, platform) {
  const labelByPlatform = {
    auto: 'Auto',
    desktop: 'Desktop',
    mobile: 'Mobile',
  };

  await clickByText(page, '.platform-switch button', labelByPlatform[platform]);

  if (platform === 'desktop') {
    await waitForVisible(page, 'main.af-page-shell-desktop__content');
    return;
  }

  if (platform === 'mobile') {
    await waitForVisible(page, 'main.af-page-shell-mobile__content');
  }
}

async function setTheme(page, theme) {
  const currentTheme = await page.evaluate(() => document.documentElement.dataset.theme ?? 'dark');

  if (currentTheme === theme) {
    return;
  }

  await page.locator('[data-qa="theme-toggle"]').click();
  await page.waitForFunction((expectedTheme) => document.documentElement.dataset.theme === expectedTheme, theme);
}

async function openDesktopSection(page, label, selector) {
  await clickByText(page, 'button.af-sidebar-desktop__item', label);
  await waitForVisible(page, selector);
}

async function openMobileTab(page, label, selector) {
  await clickByText(page, 'button.af-bottom-tabs-mobile__item', label);
  await waitForVisible(page, selector);
}

async function clickByText(page, selector, text) {
  const locator = page.locator(selector).filter({ hasText: text });

  if ((await locator.count()) === 0) {
    throw new Error(`Expected to find ${selector} with text ${JSON.stringify(text)}.`);
  }

  await locator.first().click();
}

async function clickHostButton(page, selector) {
  const locator = page.locator(`${selector} button`);

  if ((await locator.count()) === 0) {
    throw new Error(`Expected to find host button ${selector}.`);
  }

  await locator.first().click();
}

async function waitForVisible(page, selector) {
  await page.locator(selector).first().waitFor({ state: 'visible' });
}

async function waitForShellReady(page) {
  await Promise.race([
    page.locator('main.af-page-shell-desktop__content').first().waitFor({ state: 'visible' }),
    page.locator('main.af-page-shell-mobile__content').first().waitFor({ state: 'visible' }),
  ]);
}

async function assertMinimumCount(page, selector, minimum, label) {
  const count = await page.locator(selector).count();

  if (count < minimum) {
    throw new Error(`Expected at least ${minimum} ${label}, found ${count}.`);
  }
}

async function assertCountEquals(page, selector, expected, label) {
  const count = await page.locator(selector).count();

  if (count !== expected) {
    throw new Error(`Expected ${label} to equal ${expected}, found ${count}.`);
  }
}

async function assertContainsText(page, selector, expectedText) {
  const text = (await page.locator(selector).first().textContent())?.replace(/\s+/g, ' ').trim() ?? '';

  if (!text.includes(expectedText)) {
    throw new Error(`Expected ${selector} to include ${JSON.stringify(expectedText)}.`);
  }
}

async function assertNonEmptyScreenshotTarget(page) {
  const section = page.locator('.shell-section').first();
  const text = (await section.textContent())?.replace(/\s+/g, ' ').trim() ?? '';

  if (text.length < 40) {
    throw new Error('Visual beta smoke detected an unexpectedly empty shell section.');
  }
}
