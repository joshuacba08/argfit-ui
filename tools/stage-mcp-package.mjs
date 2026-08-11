import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const toolsRoot = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(toolsRoot, '..');
const sourceRoot = resolve(workspaceRoot, 'tools/mcp');
const outputRoot = resolve(workspaceRoot, 'dist/argfit-ui-mcp');
const expectedParent = resolve(workspaceRoot, 'dist');

if (!outputRoot.startsWith(`${expectedParent}\\`) && !outputRoot.startsWith(`${expectedParent}/`)) {
  throw new Error(`Refusing to stage MCP package outside ${expectedParent}.`);
}

rmSync(outputRoot, { recursive: true, force: true });
mkdirSync(outputRoot, { recursive: true });
cpSync(resolve(sourceRoot, 'dist'), resolve(outputRoot, 'dist'), { recursive: true });
for (const file of ['argfit-catalog.json', 'README.md', 'LICENSE']) {
  cpSync(resolve(sourceRoot, file), resolve(outputRoot, file));
}

const manifest = JSON.parse(readFileSync(resolve(sourceRoot, 'package.json'), 'utf8'));
delete manifest.scripts;
delete manifest.devDependencies;
writeFileSync(resolve(outputRoot, 'package.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

console.log('Staged dist/argfit-ui-mcp.');
