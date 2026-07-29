import { copyFileSync, mkdirSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const targetRoot = resolve(repoRoot, 'projects/argfit-ui-docs/public/content');

const SOURCE_DIRECTORIES = ['docs/productive', 'docs/pwa'];

function copyMarkdownDir(relativeSourceDir) {
  const sourceDir = resolve(repoRoot, relativeSourceDir);
  const targetDir = resolve(targetRoot, relativeSourceDir.replace(/^docs\//, ''));

  mkdirSync(targetDir, { recursive: true });

  const files = readdirSync(sourceDir).filter((file) => file.endsWith('.md'));
  for (const file of files) {
    const from = join(sourceDir, file);
    const to = join(targetDir, file);
    mkdirSync(dirname(to), { recursive: true });
    copyFileSync(from, to);
  }

  return files.length;
}

let total = 0;
for (const dir of SOURCE_DIRECTORIES) {
  total += copyMarkdownDir(dir);
}

console.log(`Synced ${total} markdown files into projects/argfit-ui-docs/public/content/`);
