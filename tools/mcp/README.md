# @argfit-ui/mcp

Read-only Model Context Protocol server generated from the canonical ArgFit UI Storybook,
public Angular API and design tokens.

```bash
npx -y @argfit-ui/mcp
```

For local development inside this repository use `pnpm mcp`. The server exposes component
search, exact API lookup, composition recommendations, canonical usage generation, static
usage validation and token lookup. It never writes consumer files or invents undocumented APIs.

The remote Streamable HTTP endpoint is deployed with the ArgFit UI portal at `/mcp`.
Complete client setup and the source-of-truth workflow live in Storybook under
**Getting Started / AI & MCP**.
