import { Component, computed, signal } from '@angular/core';
import type { AfFormOption, AfSelectLoadMoreEvent } from '@argfit-ui/core';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { AfSelectComponent } from './af-select.component';

const INFINITE_OPTIONS: readonly AfFormOption[] = Array.from({ length: 120 }, (_, index) => ({
  value: String(index + 1),
  label: `Player ${String(index + 1).padStart(3, '0')}`,
}));

@Component({
  selector: 'af-select-infinite-scroll-story',
  imports: [AfSelectComponent],
  template: `
    <div class="af-select-story-frame">
      <af-select
        label="Select a player"
        placeholder="Choose one..."
        searchPlaceholder="Search players..."
        [options]="options()"
        [searchable]="true"
        [scrollLoad]="true"
        [loadingMore]="loadingMore()"
        [hasMore]="hasMore()"
        (loadMore)="loadNextPage($event)"
      />
      <p class="af-select-story-caption" aria-live="polite">
        {{ options().length }} of {{ total }} players loaded
      </p>
    </div>
  `,
  styles: `
    .af-select-story-frame {
      max-width: 34rem;
    }

    .af-select-story-caption {
      color: var(--af-text-soft, var(--af-text-muted));
      font: 500 var(--af-text-xs) / var(--af-line-height-normal) var(--af-font-body);
      margin: var(--af-space-2) 0 0;
    }
  `,
})
class AfSelectInfiniteScrollStoryComponent {
  readonly total = INFINITE_OPTIONS.length;
  readonly options = signal<readonly AfFormOption[]>(INFINITE_OPTIONS.slice(0, 20));
  readonly loadingMore = signal(false);
  readonly hasMore = computed(() => this.options().length < this.total);

  loadNextPage(event: AfSelectLoadMoreEvent): void {
    if (this.loadingMore() || !this.hasMore()) {
      return;
    }

    this.loadingMore.set(true);
    window.setTimeout(() => {
      this.options.set(INFINITE_OPTIONS.slice(0, Math.min(event.offset + 20, this.total)));
      this.loadingMore.set(false);
    }, 450);
  }
}

const meta: Meta<AfSelectComponent> = {
  title: 'Components/Forms/Select',
  component: AfSelectComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [AfSelectInfiniteScrollStoryComponent] })],
  parameters: {
    argfit: {
      category: 'Forms',
      importName: 'AfSelect',
      useWhen: ['selecting from fixed or remote options', 'searchable selection with infinite scroll'],
      avoidWhen: ['free-form text entry', 'two or three immediately visible choices'],
      platforms: ['desktop', 'mobile'],
      tokens: ['--af-input-bg', '--af-input-border', '--af-bg-elevated'],
      related: ['AfInput', 'AfDataTable'],
    },
    docs: {
      description: { component: 'Adaptive single-select control with search and loading states.' },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    state: {
      control: 'select',
      options: ['default', 'error', 'success'],
    },
    searchMode: {
      control: 'select',
      options: ['client', 'server'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    searchable: { control: 'boolean' },
    scrollLoad: { control: 'boolean' },
    hasMore: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `<div style="max-width: 34rem">
    <af-select
      [options]="options"
      [label]="label"
      [placeholder]="placeholder"
      [hint]="hint"
      [searchable]="searchable"
      [searchPlaceholder]="searchPlaceholder"
      [searchEmptyText]="searchEmptyText"
      [searchMode]="searchMode"
      [loading]="loading"
      [loadingMore]="loadingMore"
      [scrollLoad]="scrollLoad"
      [hasMore]="hasMore"
      [scrollThreshold]="scrollThreshold"
      [debounceTime]="debounceTime"
      [error]="error"
      [state]="state"
      [size]="size"
      [required]="required"
      [disabled]="disabled"
      (valueChange)="valueChange($event)"
      (searchChange)="searchChange($event)"
      (loadMore)="loadMore($event)"
    ></af-select>
    </div>`,
  }),
};

export default meta;
type Story = StoryObj<AfSelectComponent>;

const DEFAULT_OPTIONS = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
  { value: '4', label: 'Option 4' },
];

export const Primary: Story = {
  args: {
    options: DEFAULT_OPTIONS,
    label: 'Select an option',
    placeholder: 'Choose one...',
    size: 'md',
    state: 'default',
    disabled: false,
    loading: false,
    searchable: false,
    scrollLoad: false,
    hasMore: true,
  },
};

export const Searchable: Story = {
  args: {
    ...Primary.args,
    options: Array.from({ length: 60 }, (_, index) => ({
      value: String(index + 1),
      label: `Player ${String(index + 1).padStart(2, '0')}`,
    })),
    searchable: true,
    searchPlaceholder: 'Search options...',
    scrollLoad: true,
  },
};

export const LoadingMore: Story = {
  args: {
    ...Searchable.args,
    loadingMore: true,
  },
};

export const InfiniteScroll: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Loads 20 options at a time when the list reaches the configured scroll threshold. The component emits `loadMore`; the application remains responsible for fetching and appending data.',
      },
    },
  },
  render: () => ({
    template: '<af-select-infinite-scroll-story />',
  }),
};

export const Disabled: Story = {
  args: {
    ...Primary.args,
    disabled: true,
  },
};

export const WithError: Story = {
  args: {
    ...Primary.args,
    state: 'error',
    error: 'This field is required',
  },
};
