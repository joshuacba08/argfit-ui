import { resolve } from 'node:path';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const cliPath = resolve(import.meta.dirname, 'cli.js');
const transport = new StdioClientTransport({
  command: process.execPath,
  args: [cliPath],
  stderr: 'pipe',
});
const client = new Client({ name: 'argfit-ui-mcp-smoke', version: '1.0.0' });

try {
  await client.connect(transport);
  const tools = await client.listTools();
  if (tools.tools.length !== 6) {
    throw new Error(`Expected 6 tools, received ${tools.tools.length}.`);
  }
  const response = await client.callTool({
    name: 'search_components',
    arguments: { query: 'selector con búsqueda y carga por scroll' },
  });
  const content = response['content'];
  const text = Array.isArray(content)
    ? content.find(
        (item): item is { type: 'text'; text: string } =>
          typeof item === 'object' && item !== null && item.type === 'text' && typeof item.text === 'string',
      )
    : undefined;
  if (!text || !text.text.includes('AfSelect')) {
    throw new Error('STDIO smoke did not find AfSelect.');
  }
  console.log('ArgFit UI MCP STDIO smoke passed.');
} finally {
  await client.close();
}
