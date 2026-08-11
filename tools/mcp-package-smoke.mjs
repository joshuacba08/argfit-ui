import { existsSync } from 'node:fs';
import { mkdtemp, mkdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const repositoryRoot = resolve(import.meta.dirname, '..');
const workspaceRequire = createRequire(join(repositoryRoot, 'tools', 'mcp', 'package.json'));
const { Client } = await import(pathToFileURL(
  workspaceRequire.resolve('@modelcontextprotocol/sdk/client/index.js'),
).href);
const { StdioClientTransport } = await import(pathToFileURL(
  workspaceRequire.resolve('@modelcontextprotocol/sdk/client/stdio.js'),
).href);
const stagedPackage = join(repositoryRoot, 'dist', 'argfit-ui-mcp');
const temporaryRoot = await mkdtemp(join(tmpdir(), 'argfit-ui-mcp-npx-'));
const packageDirectory = join(temporaryRoot, 'package');
const consumerDirectory = join(temporaryRoot, 'consumer');

try {
  await mkdir(packageDirectory, { recursive: true });
  await mkdir(consumerDirectory, { recursive: true });

  const pack = runNpm([
    'pack',
    stagedPackage,
    '--pack-destination',
    packageDirectory,
    '--json',
  ], repositoryRoot);
  const [{ filename }] = JSON.parse(pack.stdout);
  const tarball = join(packageDirectory, filename);

  runNpm([
    'install',
    '--ignore-scripts',
    '--no-audit',
    '--no-fund',
    '--prefix',
    consumerDirectory,
    tarball,
  ], repositoryRoot);

  const installedManifest = JSON.parse(await readFile(
    join(consumerDirectory, 'node_modules', '@argfit-ui', 'mcp', 'package.json'),
    'utf8',
  ));
  const npx = npmExecutable('npx', ['--no-install', 'argfit-ui-mcp']);
  const transport = new StdioClientTransport({
    command: npx.command,
    args: npx.args,
    cwd: consumerDirectory,
    stderr: 'pipe',
  });
  const client = new Client({ name: 'argfit-ui-mcp-package-smoke', version: '1.0.0' });

  try {
    await client.connect(transport);
    const tools = await client.listTools();
    if (tools.tools.length !== 6) {
      throw new Error(`Expected 6 tools from the packed package, received ${tools.tools.length}.`);
    }
    const result = await client.callTool({
      name: 'get_component',
      arguments: { component: 'AfSelect', version: installedManifest.version },
    });
    if (result.isError || JSON.stringify(result).includes('AfSelectComponent') === false) {
      throw new Error('The packed MCP did not return the AfSelect public contract.');
    }
  } finally {
    await client.close();
  }

  console.log(`ArgFit UI MCP npx package smoke passed (${installedManifest.version}).`);
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed:\n${result.error?.message ?? result.stderr ?? result.stdout}`);
  }
  return result;
}

function runNpm(args, cwd) {
  const invocation = npmExecutable('npm', args);
  return run(invocation.command, invocation.args, cwd);
}

function npmExecutable(name, args) {
  if (process.platform !== 'win32') return { command: name, args };
  const cliName = `${name}-cli.js`;
  const candidates = [
    join(dirname(process.execPath), 'node_modules', 'npm', 'bin', cliName),
    resolve(dirname(process.execPath), '..', 'lib', 'node_modules', 'npm', 'bin', cliName),
  ];
  const cli = candidates.find((candidate) => existsSync(candidate));
  if (!cli) throw new Error(`Unable to locate ${cliName} beside ${process.execPath}.`);
  return { command: process.execPath, args: [cli, ...args] };
}
