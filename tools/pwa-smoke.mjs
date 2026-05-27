import { createServer } from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const appRoot = resolve(repoRoot, 'dist', 'argfit-ui-pwa-starter', 'browser');
const manifestPath = resolve(appRoot, 'manifest.webmanifest');
const serviceWorkerManifestPath = resolve(appRoot, 'ngsw.json');
const serviceWorkerPath = resolve(appRoot, 'ngsw-worker.js');
const failures = [];

validateBuiltFiles();
validateManifest();
await validateBrowserSmoke();

if (failures.length > 0) {
  console.error('PWA smoke failed:');

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exit(1);
}

console.log('PWA smoke passed.');

function validateBuiltFiles() {
  for (const filePath of [manifestPath, serviceWorkerManifestPath, serviceWorkerPath]) {
    if (!existsSync(filePath)) {
      failures.push(`${relative(filePath)} is missing. Run ng build argfit-ui-pwa-starter --configuration production first.`);
    }
  }
}

function validateManifest() {
  if (!existsSync(manifestPath)) {
    return;
  }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

  if (manifest.display !== 'standalone') {
    failures.push('manifest.webmanifest must use display=standalone.');
  }

  for (const size of ['192x192', '512x512']) {
    const icon = manifest.icons?.find((entry) => entry.sizes === size);

    if (!icon) {
      failures.push(`manifest.webmanifest is missing a ${size} icon.`);
      continue;
    }

    if (!existsSync(resolve(appRoot, icon.src))) {
      failures.push(`manifest icon ${icon.src} is missing from the build output.`);
    }
  }
}

async function validateBrowserSmoke() {
  if (failures.length > 0) {
    return;
  }

  const server = await startStaticServer();
  const browser = await chromium.launch();

  try {
    const context = await browser.newContext({
      viewport: {
        width: 1440,
        height: 1100,
      },
    });
    await context.addInitScript(() => {
      Object.defineProperty(window, 'isSecureContext', {
        configurable: true,
        value: true,
      });
      Object.defineProperty(navigator, 'bluetooth', {
        configurable: true,
        value: {
          getAvailability: async () => true,
          requestDevice: async () => {
            const gatt = {
              connected: false,
              connect: async function connect() {
                this.connected = true;
                return this;
              },
              disconnect() {
                this.connected = false;
              },
              getPrimaryService: async () => ({
                getCharacteristic: async () => ({
                  readValue: async () => new DataView(Uint8Array.of(82).buffer),
                  writeValue: async () => undefined,
                }),
              }),
            };

            return {
              id: 'mock-battery-strap',
              name: 'Mock Battery Strap',
              gatt,
              addEventListener: () => undefined,
            };
          },
        },
      });
    });

    const page = await context.newPage();
    await page.goto(server.url, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="device-demo-page"]', { timeout: 10_000 });

    const hasServiceWorker = await page.evaluate(() => 'serviceWorker' in navigator);
    const hasMockBluetooth = await page.evaluate(() => Boolean(navigator.bluetooth?.requestDevice));

    if (!hasServiceWorker) {
      failures.push('Browser runtime does not expose navigator.serviceWorker.');
    }

    if (!hasMockBluetooth) {
      failures.push('Mock Web Bluetooth was not installed in the browser context.');
    }

    await page.waitForFunction(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.some((button) => button.textContent?.includes('Connect BLE') && !button.disabled);
    }, undefined, { timeout: 10_000 });
    await page.getByRole('button', { name: 'Connect BLE' }).click();
    await page.getByText('Mock Battery Strap', { exact: true }).waitFor({ timeout: 10_000 });

    await page.goto(`${server.url}install`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="install-page"]', { timeout: 10_000 });

    await page.goto(`${server.url}offline`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="offline-page"]', { timeout: 10_000 });

    await context.close();
  } catch (error) {
    failures.push(error instanceof Error ? error.message : String(error));
  } finally {
    await browser.close();
    await new Promise((resolveClose) => server.instance.close(resolveClose));
  }
}

function startStaticServer() {
  const instance = createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? '/', 'http://127.0.0.1');
      const requestPath = url.pathname === '/' ? '/index.html' : url.pathname;
      const filePath = resolve(appRoot, `.${normalize(requestPath)}`);
      const rootWithSeparator = `${appRoot}${process.platform === 'win32' ? '\\' : '/'}`;

      if (!filePath.startsWith(rootWithSeparator)) {
        response.writeHead(403);
        response.end('Forbidden');
        return;
      }

      let resolvedPath = filePath;

      if (!existsSync(resolvedPath) || (await stat(resolvedPath)).isDirectory()) {
        resolvedPath = join(appRoot, 'index.html');
      }

      response.writeHead(200, {
        'content-type': getContentType(resolvedPath),
      });
      response.end(await readFile(resolvedPath));
    } catch (error) {
      response.writeHead(500);
      response.end(error instanceof Error ? error.message : String(error));
    }
  });

  return new Promise((resolveListen) => {
    instance.listen(0, '127.0.0.1', () => {
      const address = instance.address();

      if (!address || typeof address === 'string') {
        throw new Error('Could not resolve PWA smoke server address.');
      }

      resolveListen({
        instance,
        url: `http://127.0.0.1:${address.port}/`,
      });
    });
  });
}

function getContentType(filePath) {
  switch (extname(filePath)) {
    case '.html':
      return 'text/html; charset=utf-8';
    case '.js':
      return 'text/javascript; charset=utf-8';
    case '.css':
      return 'text/css; charset=utf-8';
    case '.json':
    case '.webmanifest':
      return 'application/manifest+json; charset=utf-8';
    case '.svg':
      return 'image/svg+xml';
    case '.png':
      return 'image/png';
    default:
      return 'application/octet-stream';
  }
}

function relative(filePath) {
  return filePath.replace(`${repoRoot}\\`, '').replace(`${repoRoot}/`, '');
}
