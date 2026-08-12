import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { LucideAlarmClock } from '@lucide/angular';
import { heroUser } from '@ng-icons/heroicons/outline';
import { tablerBallFootball } from '@ng-icons/tabler-icons';
import type { Meta, StoryObj } from '@storybook/angular-vite';

import { AF_ICON_NAMES } from '@argfit-ui/core';

import { AfIconComponent } from './af-icon.component';
import { provideAfLucideIcons, provideAfNgIcons } from './af-icon.providers';

@Component({
  selector: 'af-icon-gallery-story',
  imports: [AfIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="gallery-search">
      <span>Buscar en el catálogo incluido</span>
      <input
        type="search"
        [value]="query()"
        (input)="setQuery($event)"
        placeholder="Ej. calendar, arrow, user"
      />
    </label>
    <div class="gallery-grid">
      @for (icon of filteredIcons(); track icon) {
        <div class="gallery-item">
          <af-icon [name]="icon" size="lg" decorative />
          <code>{{ icon }}</code>
        </div>
      } @empty {
        <p>No hay iconos que coincidan con la búsqueda.</p>
      }
    </div>
  `,
  styles: `
    :host {
      display: grid;
      gap: 1rem;
      color: var(--af-text-main);
    }
    .gallery-search {
      display: grid;
      gap: 0.4rem;
      max-width: 28rem;
      font: inherit;
    }
    .gallery-search span {
      color: var(--af-text-muted);
      font-size: 0.875rem;
    }
    .gallery-search input {
      border: 1px solid var(--af-border);
      border-radius: var(--af-radius-md);
      background: var(--af-surface);
      color: var(--af-text-main);
      min-height: 2.75rem;
      padding: 0 0.75rem;
    }
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
      gap: 0.75rem;
    }
    .gallery-item {
      align-items: center;
      border: 1px solid var(--af-border);
      border-radius: var(--af-radius-md);
      display: flex;
      gap: 0.6rem;
      min-width: 0;
      padding: 0.75rem;
    }
    .gallery-item code {
      color: var(--af-text-muted);
      font-size: 0.75rem;
      overflow-wrap: anywhere;
    }
  `,
})
class AfIconGalleryStoryComponent {
  protected readonly query = signal('');
  protected readonly filteredIcons = computed(() => {
    const query = this.query().trim().toLowerCase();
    return query ? AF_ICON_NAMES.filter((name) => name.includes(query)) : AF_ICON_NAMES;
  });

  protected setQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}

@Component({
  selector: 'af-external-icons-story',
  imports: [AfIconComponent],
  providers: [
    provideAfLucideIcons(LucideAlarmClock),
    provideAfNgIcons('hero', { user: heroUser }),
    provideAfNgIcons('tabler', { 'ball-football': tablerBallFootball }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="examples">
      <span
        ><af-icon name="lucide:alarm-clock" size="lg" decorative /><code
          >lucide:alarm-clock</code
        ></span
      >
      <span><af-icon name="hero:user" size="lg" decorative /><code>hero:user</code></span>
      <span
        ><af-icon name="tabler:ball-football" size="lg" decorative /><code
          >tabler:ball-football</code
        ></span
      >
    </div>
  `,
  styles: `
    .examples {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      color: var(--af-text-main);
    }
    .examples span {
      align-items: center;
      display: flex;
      gap: 0.5rem;
      padding: 0.75rem;
    }
  `,
})
class AfExternalIconsStoryComponent {}

interface AfIconStoryArgs {
  name: (typeof AF_ICON_NAMES)[number];
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  tone: 'default' | 'muted' | 'primary' | 'success' | 'warning' | 'danger';
  strokeWidth: number;
  decorative: boolean;
  ariaLabel: string;
}

const meta: Meta<AfIconStoryArgs> = {
  title: 'Components/Foundation/Icon',
  component: AfIconComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Components',
      importName: 'AfIconComponent',
      useWhen: ['Representar acciones, estados o conceptos con iconografía consistente.'],
      avoidWhen: [
        'El texto comunica mejor la intención o el icono sería la única etiqueta accesible sin ariaLabel.',
      ],
      platforms: ['desktop', 'mobile'],
      tokens: [
        '--af-text-main',
        '--af-text-muted',
        '--af-primary',
        '--af-success',
        '--af-warning',
        '--af-danger',
      ],
      related: ['AfButton', 'AfIconField'],
    },
    docs: {
      description: {
        component:
          '`AfIconComponent` incluye un catálogo Lucide estable y permite registrar cualquier otro Lucide o definición de `@ng-icons/*` sin importar catálogos completos. Los iconos externos usan nombres con namespace.',
      },
    },
  },
  argTypes: {
    name: { control: 'select', options: AF_ICON_NAMES },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    tone: {
      control: 'select',
      options: ['default', 'muted', 'primary', 'success', 'warning', 'danger'],
    },
    strokeWidth: { control: { type: 'range', min: 1, max: 4, step: 0.25 } },
    decorative: { control: 'boolean' },
    ariaLabel: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<AfIconStoryArgs>;

export const Default: Story = {
  args: {
    name: 'search',
    size: 'md',
    tone: 'default',
    strokeWidth: 2,
    decorative: false,
    ariaLabel: 'Buscar',
  },
};

export const BuiltInGallery: Story = {
  render: () => ({ template: '<af-icon-gallery-story />', imports: [AfIconGalleryStoryComponent] }),
  parameters: { controls: { disable: true } },
};

export const ExternalCollections: Story = {
  render: () => ({
    template: '<af-external-icons-story />',
    imports: [AfExternalIconsStoryComponent],
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: `providers: [
  provideAfLucideIcons(LucideAlarmClock),
  provideAfNgIcons('hero', { user: heroUser }),
  provideAfNgIcons('tabler', { 'ball-football': tablerBallFootball }),
]`,
      },
    },
  },
};

export const SizesAndTones: Story = {
  render: () => ({
    template: `
      <div style="display:flex;align-items:center;gap:1rem">
        <af-icon name="info" size="xs" tone="muted" decorative />
        <af-icon name="info" size="sm" tone="primary" decorative />
        <af-icon name="circle-check" size="md" tone="success" decorative />
        <af-icon name="alert-triangle" size="lg" tone="warning" decorative />
        <af-icon name="circle-alert" size="xl" tone="danger" decorative />
      </div>
    `,
    imports: [AfIconComponent],
  }),
  parameters: { controls: { disable: true } },
};
