import { createServer } from 'node:http';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { afterEach, describe, expect, it } from 'vitest';

import { handleArgfitMcpRequest } from './http.js';

describe('ArgFit MCP Streamable HTTP transport', () => {
  const cleanup: Array<() => Promise<void>> = [];

  afterEach(async () => {
    await Promise.all(cleanup.splice(0).map((close) => close()));
  });

  it('serves tools through a stateless HTTP endpoint', async () => {
    const httpServer = createServer((request, response) => {
      void handleArgfitMcpRequest(request, response, {
        storybookOrigin: 'https://ui.argfit.example',
      });
    });
    await new Promise<void>((resolve) => httpServer.listen(0, '127.0.0.1', resolve));
    const address = httpServer.address();
    if (!address || typeof address === 'string') throw new Error('HTTP test server has no TCP address.');

    const transport = new StreamableHTTPClientTransport(
      new URL(`http://127.0.0.1:${address.port}/mcp`),
    );
    const client = new Client({ name: 'argfit-http-test', version: '1.0.0' });
    cleanup.push(async () => {
      await client.close();
      await new Promise<void>((resolve, reject) => {
        httpServer.close((error) => error ? reject(error) : resolve());
      });
    });

    await client.connect(transport);
    const tools = await client.listTools();
    expect(tools.tools).toHaveLength(6);
    const result = await client.callTool({
      name: 'get_component',
      arguments: { component: 'AfSelect' },
    });
    const text = result.content.find((item) => item.type === 'text');
    expect(text?.type === 'text' ? text.text : '').toContain('loadMore');
  });

  it('rejects oversized public requests before protocol handling', async () => {
    const httpServer = createServer((request, response) => {
      void handleArgfitMcpRequest(request, response);
    });
    await new Promise<void>((resolve) => httpServer.listen(0, '127.0.0.1', resolve));
    const address = httpServer.address();
    if (!address || typeof address === 'string') throw new Error('HTTP test server has no TCP address.');
    cleanup.push(() => new Promise<void>((resolve, reject) => {
      httpServer.close((error) => error ? reject(error) : resolve());
    }));

    const response = await fetch(`http://127.0.0.1:${address.port}/mcp`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ payload: 'x'.repeat(66_000) }),
    });
    expect(response.status).toBe(413);
  });
});
