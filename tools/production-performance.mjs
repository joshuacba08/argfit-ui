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

const budgets = {
  initialTotal: 2_900_000,
  mainBundle: 2_750_000,
  stylesBundle: 60_000,
  tarballTotal: 650_000,
  tarballs: {
    'argfit-ui-core': 35_000,
    'argfit-ui-primitives': 15_000,
    'argfit-ui-adaptive': 130_000,
    'argfit-ui-desktop': 250_000,
    'argfit-ui-mobile': 230_000,
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
