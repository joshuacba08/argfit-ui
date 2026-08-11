import type { Meta, StoryObj } from '@storybook/angular-vite';

const meta: Meta = {
  title: 'Foundations/DesignTokens',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Live reference for the semantic color, spacing and typography tokens used by every ArgFit UI component.',
      },
    },
  },
  render: () => ({
    template: `
      <article class="af-foundations af-story-surface af-story-stack">
        <header><p class="af-auth-story__eyebrow">FOUNDATIONS</p><h1>ArgFit design tokens</h1><p>Change the theme from the toolbar to verify the semantic contract.</p></header>
        <section><h2>Surfaces</h2><div class="af-foundations__grid"><div data-token="--af-bg-main">Main</div><div data-token="--af-bg-surface">Surface</div><div data-token="--af-bg-elevated">Elevated</div><div data-token="--af-bg-interactive">Interactive</div></div></section>
        <section><h2>Semantic colors</h2><div class="af-foundations__grid"><div data-token="--af-primary">Primary</div><div data-token="--af-accent">Accent</div><div data-token="--af-success">Success</div><div data-token="--af-warning">Warning</div><div data-token="--af-danger">Danger</div></div></section>
        <section><h2>Typography</h2><p class="af-foundations__display">Performance, clearly explained.</p><p>Body text remains legible across dense dashboards and focused mobile flows.</p><code>--af-font-mono · 240 / 240</code></section>
      </article>
    `,
  }),
};

export default meta;
type Story = StoryObj;
export const Overview: Story = {};
