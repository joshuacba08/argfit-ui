#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { loadCatalog } from './catalog.js';
import { createArgfitMcpServer } from './server.js';

const catalog = loadCatalog();
const server = createArgfitMcpServer({
  catalog,
  storybookOrigin: process.env['ARGFIT_STORYBOOK_ORIGIN'],
});
const transport = new StdioServerTransport();

process.on('SIGINT', () => {
  void server.close().finally(() => process.exit(0));
});
process.on('SIGTERM', () => {
  void server.close().finally(() => process.exit(0));
});

await server.connect(transport);
