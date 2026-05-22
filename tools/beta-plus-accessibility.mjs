import { existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

import { chromium } from 'playwright';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const distDirectory = resolveDistDirectory();
const failures = [];

const server = createStaticServer(distDirectory);
await new Promise((resolveServer) => server.listen(0, '127.0.0.1', resolveServer));

const address = server.address();

if (!address || typeof address === 'string') {
  server.close();
  throw new Error('Beta+ accessibility audit could not bind a local HTTP port.');
}

const baseUrl = `http://127.0.0.1:${address.port}`;
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await waitForVisible(page, '[data-qa="consumer-shell"]');

  await setPlatform(page, 'desktop');
  await setTheme(page, 'dark');
  await openDesktopMultiSelect(page);

  await assertByLabel(page, 'Edad', 'input-count accessible label');
  await assertByLabel(page, 'Fecha de sesion', 'date-picker accessible label');
  await assertLocatorVisible(page, '[aria-label="Athlete avatar"]', 'avatar aria label');
  await assertLocatorVisible(page, '[role="progressbar"][aria-label="Workload progress"]', 'progressbar semantics');
  await assertLocatorVisible(page, '[role="tooltip"]', 'tooltip role');
  await assertLocatorVisible(page, '[role="tablist"]', 'tablist semantics');
  await assertLocatorVisible(page, '[role="tree"]', 'tree semantics');

  await page.close();

  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 1100 } });
  await mobilePage.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await waitForVisible(mobilePage, '[data-qa="consumer-shell"]');

  await setPlatform(mobilePage, 'mobile');
  await setTheme(mobilePage, 'dark');
  await openMobileMultiSelect(mobilePage);
  await assertLocatorVisible(mobilePage, '[data-qa="multi-select-control"] af-drawer-mobile[data-open]', 'mobile drawer disclosure');
  await assertLocatorVisible(mobilePage, 'af-kanban-mobile', 'mobile kanban host');

  await mobilePage.close();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  failures.push(message);
} finally {
  await browser.close();
  await new Promise((resolveServer) => server.close(resolveServer));
}

if (failures.length > 0) {
  console.error('Beta+ accessibility audit failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Beta+ accessibility audit passed.');

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

  throw new Error('Beta+ accessibility audit expected a built consumer app in .tmp/beta-plus-consumer/dist. Run pnpm beta-plus:consumer-smoke first.');
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
      response.statusCode = existsSync(fallbackPath) ? 200 : 404;
      response.setHeader('Content-Type', 'text/html; charset=utf-8');
      response.end(existsSync(fallbackPath) ? readFileSync(fallbackPath) : 'Not found');
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

async function assertByLabel(page, label, description) {
  const locator = page.getByLabel(label);
  if ((await locator.count()) === 0) {
    throw new Error(`Expected accessible label ${JSON.stringify(label)} for ${description}.`);
  }
  await locator.first().waitFor({ state: 'visible' });
}

async function assertLocatorVisible(page, selector, description) {
  const locator = page.locator(selector);
  if ((await locator.count()) === 0) {
    throw new Error(`Expected ${description} at selector ${selector}.`);
  }
  await locator.first().waitFor({ state: 'visible' });
}