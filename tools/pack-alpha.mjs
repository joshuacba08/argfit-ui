import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import process from 'node:process';

const ALPHA_VERSION = '0.1.0-alpha.0';
const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const isDryRun = process.argv.includes('--dry-run');
const tarballDestination = resolve(repoRoot, 'dist', 'alpha-tarballs');
const rootLicensePath = resolve(repoRoot, 'LICENSE');

const packageDefinitions = [
  {
    name: '@argfit-ui/core',
    distDirectory: 'dist/argfit-ui-core',
    internalPeers: [],
    requiredPeers: ['@angular/common', '@angular/core'],
  },
  {
    name: '@argfit-ui/primitives',
    distDirectory: 'dist/argfit-ui-primitives',
    internalPeers: ['@argfit-ui/core'],
    requiredPeers: ['@angular/cdk', '@angular/common', '@angular/core', '@lucide/angular'],
  },
  {
    name: '@argfit-ui/desktop',
    distDirectory: 'dist/argfit-ui-desktop',
    internalPeers: ['@argfit-ui/core', '@argfit-ui/primitives'],
    requiredPeers: ['@angular/cdk', '@angular/common', '@angular/core', '@angular/forms', 'primeng', 'echarts'],
  },
  {
    name: '@argfit-ui/mobile',
    distDirectory: 'dist/argfit-ui-mobile',
    internalPeers: ['@argfit-ui/core', '@argfit-ui/primitives'],
    requiredPeers: ['@angular/cdk', '@angular/common', '@angular/core', '@ionic/angular', 'echarts'],
  },
  {
    name: '@argfit-ui/adaptive',
    distDirectory: 'dist/argfit-ui-adaptive',
    internalPeers: ['@argfit-ui/core', '@argfit-ui/primitives', '@argfit-ui/desktop', '@argfit-ui/mobile'],
    requiredPeers: ['@angular/common', '@angular/core', '@angular/forms'],
  },
];

const forbiddenPackFilePatterns = [
  /^src\//,
  /^projects\//,
  /^showcase\//,
  /^node_modules\//,
  /^\.tmp\//,
  /(^|\/)\.env/,
  /(^|\/).*\.log$/,
  /(^|\/)package-lock\.json$/,
  /(^|\/)pnpm-lock\.yaml$/,
];

if (!isDryRun) {
  mkdirSync(tarballDestination, { recursive: true });
}

for (const packageDefinition of packageDefinitions) {
  const packageDirectory = resolve(repoRoot, packageDefinition.distDirectory);
  const manifestPath = resolve(packageDirectory, 'package.json');

  if (!existsSync(manifestPath)) {
    fail(`Missing built package manifest for ${packageDefinition.name}. Run pnpm build:libs first.`);
  }

  ensureLicenseFile(packageDirectory);

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  validateManifest(packageDefinition, manifest);

  const packArguments = ['pack', '--json'];

  if (isDryRun) {
    packArguments.push('--dry-run');
  } else {
    packArguments.push('--pack-destination', tarballDestination);
  }

  const packResult = runNpmPack(packageDirectory, packArguments);

  if (packResult.error) {
    fail(`npm pack failed for ${packageDefinition.name}: ${packResult.error.message}`);
  }

  if (packResult.status !== 0) {
    fail(`npm pack failed for ${packageDefinition.name}:\n${packResult.stderr || packResult.stdout}`);
  }

  const npmPackEntries = parseNpmPackJson(packageDefinition.name, packResult.stdout);
  const npmPackEntry = npmPackEntries[0];

  validatePackEntry(packageDefinition, npmPackEntry);

  const modeLabel = isDryRun ? 'dry-run' : 'packed';
  console.log(
    `${modeLabel}: ${npmPackEntry.name}@${npmPackEntry.version} -> ${npmPackEntry.filename} (${npmPackEntry.files.length} files)`,
  );
}

if (!isDryRun) {
  console.log(`Tarballs written to ${tarballDestination}`);
}

function validateManifest(packageDefinition, manifest) {
  if (manifest.name !== packageDefinition.name) {
    fail(`${packageDefinition.name} manifest name mismatch: ${manifest.name}`);
  }

  if (!manifest.name.startsWith('@argfit-ui/')) {
    fail(`${packageDefinition.name} must use the @argfit-ui scope.`);
  }

  if (manifest.version !== ALPHA_VERSION) {
    fail(`${packageDefinition.name} must be version ${ALPHA_VERSION}, found ${manifest.version}.`);
  }

  if (manifest.private === true) {
    fail(`${packageDefinition.name} must not be private for alpha packaging.`);
  }

  for (const fieldName of ['description', 'keywords', 'author', 'license', 'repository', 'homepage', 'bugs']) {
    if (!manifest[fieldName]) {
      fail(`${packageDefinition.name} is missing package metadata field: ${fieldName}.`);
    }
  }

  if (manifest.license !== 'MIT') {
    fail(`${packageDefinition.name} must use the MIT license for public npm distribution.`);
  }

  if (manifest.sideEffects !== false) {
    fail(`${packageDefinition.name} must set sideEffects to false.`);
  }

  if (manifest.publishConfig?.tag !== 'alpha') {
    fail(`${packageDefinition.name} publishConfig.tag must be alpha.`);
  }

  if (manifest.publishConfig?.access !== 'public') {
    fail(`${packageDefinition.name} publishConfig.access must be public for npm distribution.`);
  }

  const peerDependencies = manifest.peerDependencies ?? {};

  for (const peerName of packageDefinition.requiredPeers) {
    if (!peerDependencies[peerName]) {
      fail(`${packageDefinition.name} is missing peer dependency ${peerName}.`);
    }
  }

  for (const internalPeerName of packageDefinition.internalPeers) {
    if (peerDependencies[internalPeerName] !== ALPHA_VERSION) {
      fail(
        `${packageDefinition.name} peer ${internalPeerName} must be ${ALPHA_VERSION}, found ${peerDependencies[internalPeerName]}.`,
      );
    }
  }

  const dependencyNames = Object.keys(manifest.dependencies ?? {});
  const internalDependencies = dependencyNames.filter((dependencyName) => dependencyName.startsWith('@argfit-ui/'));

  if (internalDependencies.length > 0) {
    fail(`${packageDefinition.name} must keep internal @argfit-ui packages in peerDependencies: ${internalDependencies.join(', ')}.`);
  }
}

function validatePackEntry(packageDefinition, npmPackEntry) {
  if (!npmPackEntry || npmPackEntry.name !== packageDefinition.name || npmPackEntry.version !== ALPHA_VERSION) {
    fail(`${packageDefinition.name} npm pack metadata does not match the alpha manifest.`);
  }

  const filePaths = (npmPackEntry.files ?? []).map((packFile) => packFile.path);

  for (const requiredPath of ['package.json', 'README.md', 'LICENSE']) {
    if (!filePaths.includes(requiredPath)) {
      fail(`${packageDefinition.name} tarball is missing ${requiredPath}.`);
    }
  }

  for (const filePath of filePaths) {
    if (forbiddenPackFilePatterns.some((pattern) => pattern.test(filePath))) {
      fail(`${packageDefinition.name} tarball includes forbidden file: ${filePath}.`);
    }
  }
}

function parseNpmPackJson(packageName, stdout) {
  const trimmedOutput = stdout.trim();
  const jsonStart = trimmedOutput.indexOf('[');
  const jsonEnd = trimmedOutput.lastIndexOf(']');

  if (jsonStart === -1 || jsonEnd === -1) {
    fail(`Could not parse npm pack JSON output for ${packageName}:\n${stdout}`);
  }

  try {
    return JSON.parse(trimmedOutput.slice(jsonStart, jsonEnd + 1));
  } catch (error) {
    fail(`Could not parse npm pack JSON output for ${packageName}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function runNpmPack(packageDirectory, packArguments) {
  if (process.platform === 'win32') {
    return spawnSync('cmd.exe', ['/d', '/s', '/c', ['npm', ...packArguments].map(quoteWindowsArgument).join(' ')], {
      cwd: packageDirectory,
      encoding: 'utf8',
    });
  }

  return spawnSync('npm', packArguments, {
    cwd: packageDirectory,
    encoding: 'utf8',
  });
}

function ensureLicenseFile(packageDirectory) {
  if (!existsSync(rootLicensePath)) {
    fail('Repository LICENSE file is required for public npm distribution.');
  }

  copyFileSync(rootLicensePath, resolve(packageDirectory, 'LICENSE'));
}

function quoteWindowsArgument(argument) {
  if (/^[a-zA-Z0-9_./:@\\-]+$/.test(argument)) {
    return argument;
  }

  return `"${argument.replaceAll('"', '\\"')}"`;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
