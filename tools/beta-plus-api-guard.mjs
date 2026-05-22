import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const declarationRoots = [
  resolve(repoRoot, 'dist', 'argfit-ui-adaptive'),
  resolve(repoRoot, 'dist', 'argfit-ui-core'),
];
const failures = [];

const forbiddenPatterns = [
  { pattern: /\bprimeng\b/i, label: 'PrimeNG reference' },
  { pattern: /@ionic\/angular/i, label: 'Ionic Angular reference' },
  { pattern: /@ionic\/core/i, label: 'Ionic Core reference' },
  { pattern: /\bIon[A-Z][A-Za-z0-9_]*/g, label: 'Ionic type name' },
  { pattern: /\bSelectChangeEvent\b/g, label: 'PrimeNG select event type' },
  { pattern: /\bTreeSelect[A-Za-z0-9_]*\b/g, label: 'PrimeNG tree select type' },
  { pattern: /\bOverlayPanel[A-Za-z0-9_]*\b/g, label: 'PrimeNG overlay type' },
];

for (const declarationRoot of declarationRoots) {
  if (!existsSync(declarationRoot)) {
    fail(`Missing built package output at ${declarationRoot}. Run pnpm build:libs first.`);
  }

  for (const filePath of listDeclarationFiles(declarationRoot)) {
    const source = readFileSync(filePath, 'utf8');

    for (const forbiddenPattern of forbiddenPatterns) {
      if (forbiddenPattern.pattern.test(source)) {
        failures.push(`${filePath}: found forbidden ${forbiddenPattern.label}.`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error('Beta+ API guard failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Beta+ API guard passed. No PrimeNG or Ionic types leaked through built public declarations.');

function listDeclarationFiles(directoryPath) {
  const declarationFiles = [];

  for (const entry of readdirSync(directoryPath)) {
    const entryPath = resolve(directoryPath, entry);
    const entryStats = statSync(entryPath);

    if (entryStats.isDirectory()) {
      declarationFiles.push(...listDeclarationFiles(entryPath));
      continue;
    }

    if (entryPath.endsWith('.d.ts')) {
      declarationFiles.push(entryPath);
    }
  }

  return declarationFiles;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
