import type { IncomingMessage, ServerResponse } from 'node:http';

import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

import { loadCatalog } from './catalog.js';
import { createArgfitMcpServer } from './server.js';

const maximumBodyBytes = 65_536;

export interface ArgfitHttpRequest extends IncomingMessage {
  readonly body?: unknown;
}

export interface ArgfitHttpOptions {
  readonly storybookOrigin?: string;
}

export async function handleArgfitMcpRequest(
  request: ArgfitHttpRequest,
  response: ServerResponse,
  options: ArgfitHttpOptions = {},
): Promise<void> {
  const startedAt = performance.now();
  const catalog = loadCatalog();
  applyHeaders(response);

  if (request.method === 'OPTIONS') {
    response.writeHead(204).end();
    return;
  }
  if (request.method !== 'POST') {
    jsonRpcError(response, 405, -32000, 'Method not allowed. Use POST for stateless Streamable HTTP.');
    return;
  }

  const contentLength = Number(request.headers['content-length'] ?? 0);
  const parsedBodySize = request.body === undefined ? 0 : Buffer.byteLength(JSON.stringify(request.body));
  if (contentLength > maximumBodyBytes || parsedBodySize > maximumBodyBytes) {
    jsonRpcError(response, 413, -32001, 'Request body exceeds the 64 KiB public limit.');
    return;
  }

  const storybookOrigin = options.storybookOrigin ?? inferOrigin(request);
  const server = createArgfitMcpServer({ catalog, storybookOrigin });
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  let closed = false;
  const close = async (): Promise<void> => {
    if (closed) return;
    closed = true;
    await transport.close();
    await server.close();
    console.info(JSON.stringify({
      service: 'argfit-ui-mcp',
      method: request.method,
      status: response.statusCode,
      durationMs: Math.round(performance.now() - startedAt),
      version: catalog.library.version,
    }));
  };

  response.once('close', () => void close());
  try {
    await server.connect(transport);
    await transport.handleRequest(request, response, request.body);
  } catch {
    if (!response.headersSent) {
      jsonRpcError(response, 500, -32603, 'Internal MCP server error.');
    }
    await close();
  }
}

function applyHeaders(response: ServerResponse): void {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Accept, MCP-Protocol-Version, MCP-Session-Id, Last-Event-ID',
  );
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');
}

function inferOrigin(request: IncomingMessage): string | undefined {
  const host = firstHeader(request.headers['x-forwarded-host']) ?? request.headers.host;
  if (!host) return undefined;
  const protocol = firstHeader(request.headers['x-forwarded-proto']) ?? 'https';
  return `${protocol}://${host}`;
}

function firstHeader(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value?.split(',')[0]?.trim();
}

function jsonRpcError(
  response: ServerResponse,
  status: number,
  code: number,
  message: string,
): void {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify({ jsonrpc: '2.0', error: { code, message }, id: null }));
}
