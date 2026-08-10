import type { Meta, StoryObj } from '@storybook/angular-vite';
import { AfSelectComponent } from './af-select.component';

const meta: Meta<AfSelectComponent> = {
  title: 'Adaptive/Select',
  component: AfSelectComponent,
  tags: ['autodocs'],
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
  },
  render: (args) => ({
    props: args,
    template: `<af-select
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
    ></af-select>`,
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
