import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const toolsDirectory = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(toolsDirectory, '..');
const componentsDirectory = resolve(
  workspaceRoot,
  'projects/argfit-ui-adaptive/src/lib/components',
);
const allowlistPath = resolve(toolsDirectory, 'storybook-story-allowlist.json');
const allowlist = new Set(JSON.parse(readFileSync(allowlistPath, 'utf8')));

const componentDirectories = readdirSync(componentsDirectory, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => {
    const directory = resolve(componentsDirectory, name);
    return readdirSync(directory).some((file) => file.endsWith('.component.ts'));
  })
  .sort();

const missingStories = componentDirectories.filter((name) => {
  const directory = resolve(componentsDirectory, name);
  return !readdirSync(directory).some((file) => file.endsWith('.stories.ts'));
});

const undocumentedStories = componentDirectories.filter((name) => {
  const directory = resolve(componentsDirectory, name);
  const files = readdirSync(directory);
  const storyFile = files.find((file) => file.endsWith('.stories.ts'));

  if (!storyFile) {
    return false;
  }

  const hasMdxDocumentation = files.some((file) => file.endsWith('.docs.mdx'));
  const storySource = readFileSync(resolve(directory, storyFile), 'utf8');
  return !hasMdxDocumentation && !storySource.includes('autodocs');
});

const storiesWithoutMcpMetadata = componentDirectories.filter((name) => {
  const directory = resolve(componentsDirectory, name);
  const storyFile = readdirSync(directory).find((file) => file.endsWith('.stories.ts'));
  if (!storyFile) return false;
  const storySource = readFileSync(resolve(directory, storyFile), 'utf8');
  return ![
    'argfit:',
    'category:',
    'importName:',
    'useWhen:',
    'avoidWhen:',
    'platforms:',
    'tokens:',
    'related:',
  ].every((field) => storySource.includes(field));
});

const uncovered = missingStories.filter((name) => !allowlist.has(name));
const staleAllowlist = [...allowlist].filter(
  (name) => !missingStories.includes(name) || !existsSync(resolve(componentsDirectory, name)),
);

if (
  uncovered.length > 0 ||
  undocumentedStories.length > 0 ||
  storiesWithoutMcpMetadata.length > 0 ||
  staleAllowlist.length > 0
) {
  if (uncovered.length > 0) {
    console.error('Adaptive components without a Storybook story:');
    uncovered.forEach((name) => console.error(`- ${name}`));
  }
  if (staleAllowlist.length > 0) {
    console.error('Remove resolved or invalid entries from the Storybook allowlist:');
    staleAllowlist.forEach((name) => console.error(`- ${name}`));
  }
  if (undocumentedStories.length > 0) {
    console.error('Adaptive stories without an autodocs tag or a sibling .docs.mdx page:');
    undocumentedStories.forEach((name) => console.error(`- ${name}`));
  }
  if (storiesWithoutMcpMetadata.length > 0) {
    console.error('Adaptive stories without complete parameters.argfit MCP metadata:');
    storiesWithoutMcpMetadata.forEach((name) => console.error(`- ${name}`));
  }
  process.exit(1);
}

console.log(
  `Storybook coverage guard passed: ${componentDirectories.length - missingStories.length}/${componentDirectories.length} adaptive components documented; ${missingStories.length} historical exceptions remain.`,
);
