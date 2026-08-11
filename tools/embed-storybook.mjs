import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const storybookRoot = resolve(workspaceRoot, 'dist', 'storybook', 'showcase');
const docsRoot = resolve(workspaceRoot, 'dist', 'argfit-ui-docs', 'browser');
const targetRoot = resolve(docsRoot, 'storybook');

if (!existsSync(resolve(storybookRoot, 'index.html'))) {
  throw new Error('Storybook build not found. Run pnpm build-storybook first.');
}

if (!existsSync(resolve(docsRoot, 'index.html'))) {
  throw new Error('Angular documentation build not found. Run pnpm build:docs first.');
}

if (!targetRoot.startsWith(docsRoot + '\\') && !targetRoot.startsWith(docsRoot + '/')) {
  throw new Error('Refusing to replace Storybook outside the documentation build: ' + targetRoot);
}

rmSync(targetRoot, { recursive: true, force: true });
mkdirSync(targetRoot, { recursive: true });
cpSync(storybookRoot, targetRoot, { recursive: true });

console.log('Embedded Storybook at ' + targetRoot);
