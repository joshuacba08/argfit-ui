import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { AfStepperComponent } from './af-stepper.component';

const meta: Meta<AfStepperComponent> = {
  title: 'Components/Navigation/Stepper',
  component: AfStepperComponent,
  tags: ['autodocs'],
  parameters: {
    argfit: {
      category: 'Navigation',
      importName: 'AfStepper',
      useWhen: ['Para procesos de varios pasos cuyo progreso debe permanecer visible.'],
      avoidWhen: ['Para navegación entre vistas equivalentes; usa AfTabs.'],
      platforms: ['desktop', 'mobile'],
      tokens: ["--af-border","--af-text-main"],
      related: ["AfProgress","AfTabs"],
    },
    docs: { description: { component: 'Secuencia de pasos con estado, modo lineal y panel adaptativo.' } },
  },
  argTypes: {
    linear: { control: 'boolean' },
    density: { control: 'select', options: ['compact', 'comfortable'] },
    disabled: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `<af-stepper [steps]="steps" [activeId]="activeId" [linear]="linear" [density]="density" [disabled]="disabled" (activeIdChange)="activeIdChange($event)" />`,
  }),
};

export default meta;
type Story = StoryObj<AfStepperComponent>;

export const Default: Story = {
  args: {
    steps: [{ id: 'details', label: 'Datos', description: 'Información del jugador', state: 'completed' }, { id: 'documents', label: 'Documentos', description: 'Licencia y contrato' }, { id: 'review', label: 'Revisión', description: 'Confirmar alta', optional: true }],
    activeId: 'documents',
    linear: true,
    activeIdChange: fn(),
  },
};

export const NonLinear: Story = {
  args: { linear: false, activeId: 'review' },
};
