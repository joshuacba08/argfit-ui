# ArgFit UI agent instructions

Storybook is the single source of truth for public component behavior and documentation.

Before creating or changing a public component, read and follow the canonical workflow:

`projects/showcase/src/stories/component-workflow.docs.mdx`

When an MCP client is available, use the project server (`pnpm mcp`) to search components,
inspect their exact API and validate consumer snippets. MCP output is generated from Storybook
and Compodoc; it never overrides the source stories or public TypeScript API.

Do not add new component documentation to `projects/argfit-ui-docs`. Keep stories and
MDX beside the adaptive component, expose vendor-neutral APIs, validate desktop/mobile
and dark/light, and run the checks required by the workflow before declaring the work
complete.
