import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const packageDirectory = resolve(repoRoot, 'dist', 'argfit-ui-primitives');
const manifestPath = resolve(packageDirectory, 'package.json');
const bundlePath = resolve(packageDirectory, 'fesm2022', 'argfit-ui-primitives.mjs');

if (!existsSync(manifestPath) || !existsSync(bundlePath)) {
  throw new Error('Build @argfit-ui/primitives before running the icon bundle smoke.');
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const bundle = readFileSync(bundlePath, 'utf8');

if (!manifest.peerDependencies?.['@ng-icons/core']) {
  throw new Error('@ng-icons/core must remain a peer dependency of @argfit-ui/primitives.');
}

for (const unusedDefinition of ['heroUser', 'tablerBallFootball', 'lucide:alarm-clock']) {
  if (bundle.includes(unusedDefinition)) {
    throw new Error(
      `Unused external icon definition leaked into the primitives bundle: ${unusedDefinition}`,
    );
  }
}

if (!bundle.includes('provideAfLucideIcons') || !bundle.includes('provideAfNgIcons')) {
  throw new Error('The built primitives package does not expose the external icon providers.');
}

console.log(
  'Icon bundle smoke passed: providers exported and external icon packs remain consumer-selected.',
);
