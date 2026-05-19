import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const workspaceRoot = process.cwd();
const sourceExtensions = new Set(['.ts']);

const boundaries = [
  {
    project: 'argfit-ui-core',
    forbidden: [
      /^primeng(\/|$)/,
      /^@ionic\/angular(\/|$)/,
      /^@argfit-ui\/primitives$/,
      /^@argfit-ui\/desktop$/,
      /^@argfit-ui\/mobile$/,
      /^@argfit-ui\/adaptive$/,
    ],
  },
  {
    project: 'argfit-ui-primitives',
    forbidden: [
      /^primeng(\/|$)/,
      /^@ionic\/angular(\/|$)/,
      /^@argfit-ui\/desktop$/,
      /^@argfit-ui\/mobile$/,
      /^@argfit-ui\/adaptive$/,
    ],
  },
  {
    project: 'argfit-ui-desktop',
    forbidden: [/^@ionic\/angular(\/|$)/, /^@argfit-ui\/mobile$/, /^@argfit-ui\/adaptive$/],
  },
  {
    project: 'argfit-ui-mobile',
    forbidden: [/^primeng(\/|$)/, /^@argfit-ui\/desktop$/, /^@argfit-ui\/adaptive$/],
  },
  {
    project: 'argfit-ui-adaptive',
    forbidden: [/^primeng(\/|$)/, /^@ionic\/angular(\/|$)/],
  },
];

const importPattern =
  /(?:import|export)\s+(?:type\s+)?(?:[^'"]+\s+from\s+)?['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)/g;

const violations = [];

for (const boundary of boundaries) {
  const projectRoot = join(workspaceRoot, 'projects', boundary.project, 'src');

  for (const filePath of listSourceFiles(projectRoot)) {
    const source = readFileSync(filePath, 'utf8');

    for (const specifier of readImportSpecifiers(source)) {
      const forbiddenRule = boundary.forbidden.find((rule) => rule.test(specifier));

      if (forbiddenRule) {
        violations.push({
          filePath,
          project: boundary.project,
          specifier,
        });
      }
    }
  }
}

if (violations.length > 0) {
  console.error('Architecture boundary violations found:');

  for (const violation of violations) {
    console.error(`- ${violation.project}: ${violation.filePath} imports ${violation.specifier}`);
  }

  process.exit(1);
}

console.log('Architecture boundaries are clean.');

function listSourceFiles(directory) {
  if (!existsSync(directory)) {
    return [];
  }

  const files = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...listSourceFiles(entryPath));
      continue;
    }

    if (sourceExtensions.has(getExtension(entry.name))) {
      files.push(entryPath);
    }
  }

  return files;
}

function readImportSpecifiers(source) {
  const specifiers = [];
  let match = importPattern.exec(source);

  while (match) {
    specifiers.push(match[1] ?? match[2]);
    match = importPattern.exec(source);
  }

  return specifiers;
}

function getExtension(fileName) {
  const lastDotIndex = fileName.lastIndexOf('.');
  return lastDotIndex === -1 ? '' : fileName.slice(lastDotIndex);
}
