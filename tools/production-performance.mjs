import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const PRODUCTION_VERSION = JSON.parse(
  readFileSync(resolve(repoRoot, 'package.json'), 'utf8'),
).version;
const showcaseDirectory = resolve(repoRoot, 'dist', 'showcase', 'browser');
const showcaseIndex = resolve(showcaseDirectory, 'index.html');
const tarballDirectory = resolve(repoRoot, 'dist', 'production-tarballs');

// Recalibrated for 2.0.0 after moving the chart engine to a lazy technical runtime.
// Measured: initial 2,146,111 B, main 2,080,618 B, core 99,901 B,
// chart-runtime 71,384 B, primitives 26,249 B, adaptive 227,478 B,
// desktop 340,327 B, mobile 299,490 B, MCP 67,053 B and
// tarballs 1,131,882 B.
// Each changed budget sits roughly 5 % above its measurement so the ratchet still
// catches unintended growth: these are
// ceilings to justify raising, not targets to grow into. Raise them only alongside
// a release that says in its notes what was added.
const budgets = {
  initialTotal: 2_254_000,
  mainBundle: 2_185_000,
  stylesBundle: 41_000,
  tarballTotal: 1_183_000,
  tarballs: {
    'argfit-ui-core': 104_000,
    'argfit-ui-chart-runtime': 75_000,
    'argfit-ui-primitives': 27_600,
    'argfit-ui-adaptive': 238_000,
    'argfit-ui-desktop': 357_000,
    'argfit-ui-mobile': 313_000,
    'argfit-ui-mcp': 70_000,
  },
};

const failures = [];

if (!existsSync(showcaseIndex)) {
  throw new Error('Missing dist/showcase/browser/index.html. Run pnpm build:all before measuring production performance.');
}

if (!existsSync(tarballDirectory)) {
  throw new Error('Missing dist/production-tarballs. Run pnpm pack:production:dist before measuring production performance.');
}

const initialAssets = readInitialAssets();
const initialTotal = sumBytes(initialAssets);
const mainBundle = findRequiredAsset(initialAssets, (asset) => asset.name.startsWith('main-') && asset.name.endsWith('.js'), 'main bundle');
const stylesBundle = findRequiredAsset(initialAssets, (asset) => asset.name.startsWith('styles-') && asset.name.endsWith('.css'), 'styles bundle');
const tarballAssets = readTarballAssets();
const tarballTotal = sumBytes(tarballAssets);

checkBudget('showcase initial total', initialTotal, budgets.initialTotal);
checkBudget('showcase main bundle', mainBundle.bytes, budgets.mainBundle);
checkBudget('showcase styles bundle', stylesBundle.bytes, budgets.stylesBundle);
checkBudget('production tarball total', tarballTotal, budgets.tarballTotal);

for (const tarballAsset of tarballAssets) {
  const budget = budgets.tarballs[tarballAsset.prefix];
  checkBudget(`${tarballAsset.prefix} tarball`, tarballAsset.bytes, budget);
}

console.log('Production performance budgets:');
console.log(`- showcase initial total: ${formatBytes(initialTotal)} / ${formatBytes(budgets.initialTotal)}`);
console.log(`- showcase main bundle: ${formatBytes(mainBundle.bytes)} / ${formatBytes(budgets.mainBundle)}`);
console.log(`- showcase styles bundle: ${formatBytes(stylesBundle.bytes)} / ${formatBytes(budgets.stylesBundle)}`);
console.log(`- production tarball total: ${formatBytes(tarballTotal)} / ${formatBytes(budgets.tarballTotal)}`);

for (const tarballAsset of tarballAssets) {
  console.log(`- ${tarballAsset.fileName}: ${formatBytes(tarballAsset.bytes)} / ${formatBytes(budgets.tarballs[tarballAsset.prefix])}`);
}

if (failures.length > 0) {
  console.error('Production performance budgets failed:');

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exit(1);
}

console.log('Production performance budgets passed.');

function readInitialAssets() {
  const indexHtml = readFileSync(showcaseIndex, 'utf8');
  const assetNames = Array.from(
    new Set(
      [...indexHtml.matchAll(/<(?:link|script)[^>]+(?:href|src)="([^"]+\.(?:css|js))"/g)]
        .map((match) => match[1])
        .filter((asset) => !asset.startsWith('http')),
    ),
  );

  return assetNames.map((assetName) => {
    const assetPath = resolve(showcaseDirectory, assetName);

    if (!existsSync(assetPath)) {
      throw new Error(`Showcase build is missing expected asset ${assetName}.`);
    }

    return {
      name: assetName,
      bytes: statSync(assetPath).size,
    };
  });
}

function readTarballAssets() {
  const tarballFiles = readdirSync(tarballDirectory).filter((entry) => entry.endsWith('.tgz'));

  return Object.keys(budgets.tarballs).map((prefix) => {
    // Se exige el tarball de la versión que se está publicando. Antes se resolvía por
    // prefijo, así que un `.tgz` de un release anterior que hubiera quedado en el
    // directorio podía ser el medido, y los presupuestos pasaban sin haber examinado
    // el artefacto real.
    const expectedFileName = `${prefix}-${PRODUCTION_VERSION}.tgz`;
    const fileName = tarballFiles.find((entry) => entry === expectedFileName);

    if (!fileName) {
      throw new Error(
        `Missing expected tarball ${expectedFileName}. Run pnpm pack:production:dist first.`,
      );
    }

    return {
      prefix,
      fileName,
      bytes: statSync(resolve(tarballDirectory, fileName)).size,
    };
  });
}

function findRequiredAsset(assets, predicate, description) {
  const asset = assets.find(predicate);

  if (!asset) {
    throw new Error(`Could not find ${description} in showcase initial assets.`);
  }

  return asset;
}

function checkBudget(label, value, budget) {
  if (value > budget) {
    failures.push(`${label} exceeds budget: ${formatBytes(value)} > ${formatBytes(budget)}`);
  }
}

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
