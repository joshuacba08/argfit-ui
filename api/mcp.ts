import type { ServerResponse } from 'node:http';

import {
  handleArgfitMcpRequest,
  type ArgfitHttpRequest,
} from '../tools/mcp/src/http.js';

export const config = {
  maxDuration: 10,
};

export default async function handler(
  request: ArgfitHttpRequest,
  response: ServerResponse,
): Promise<void> {
  await handleArgfitMcpRequest(request, response);
}
