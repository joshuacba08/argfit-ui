import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const showcaseDirectory = resolve(repoRoot, 'dist', 'showcase', 'browser');
const showcaseIndex = resolve(showcaseDirectory, 'index.html');
const rootManifest = JSON.parse(readFileSync(resolve(repoRoot, 'package.json'), 'utf8'));
const betaVersion = rootManifest.version;
const tarballDirectory = resolve(repoRoot, 'dist', 'beta-tarballs');

if (!existsSync(showcaseIndex)) {
  throw new Error('Missing dist/showcase/browser/index.html. Run pnpm build:all before measuring beta performance.');
}

if (!existsSync(tarballDirectory)) {
  throw new Error('Missing dist/beta-tarballs. Run pnpm pack:beta:dist before measuring beta performance.');
}

const indexHtml = readFileSync(showcaseIndex, 'utf8');
const initialAssetNames = Array.from(
  new Set(
    [...indexHtml.matchAll(/<(?:link|script)[^>]+(?:href|src)="([^"]+\.(?:css|js))"/g)]
      .map((match) => match[1])
      .filter((asset) => !asset.startsWith('http')),
  ),
);

const initialAssets = initialAssetNames.map((assetName) => {
  const assetPath = resolve(showcaseDirectory, assetName);

  if (!existsSync(assetPath)) {
    throw new Error(`Showcase build is missing expected initial asset ${assetName}.`);
  }

  return {
    name: assetName,
    bytes: statSync(assetPath).size,
  };
});

const tarballAssets = ['argfit-ui-core', 'argfit-ui-chart-runtime', 'argfit-ui-primitives', 'argfit-ui-desktop', 'argfit-ui-mobile', 'argfit-ui-adaptive']
  .map((prefix) => {
    const assetName = `${prefix}-${betaVersion}.tgz`;
    const assetPath = resolve(tarballDirectory, assetName);

    if (!existsSync(assetPath)) {
      throw new Error(`Missing expected tarball ${assetName}.`);
    }

    return {
      name: assetName,
      bytes: statSync(assetPath).size,
    };
  });

console.log('Showcase initial assets:');

for (const asset of initialAssets) {
  console.log(`- ${asset.name}: ${formatBytes(asset.bytes)}`);
}

console.log(`Initial total: ${formatBytes(sumBytes(initialAssets))}`);
console.log('');
console.log('Beta tarballs:');

for (const asset of tarballAssets) {
  console.log(`- ${asset.name}: ${formatBytes(asset.bytes)}`);
}

console.log(`Tarball total: ${formatBytes(sumBytes(tarballAssets))}`);

function sumBytes(assets) {
  return assets.reduce((total, asset) => total + asset.bytes, 0);
}

function formatBytes(bytes) {
  const units = ['B', 'kB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const decimals = unitIndex === 0 || value >= 10 ? 0 : 2;
  return `${value.toFixed(decimals)} ${units[unitIndex]}`;
}
