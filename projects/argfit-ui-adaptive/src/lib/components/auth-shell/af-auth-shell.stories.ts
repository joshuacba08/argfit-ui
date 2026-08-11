import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';

import { AfButtonComponent } from '../button/af-button.component';
import { AfInlineMessageComponent } from '../inline-message/af-inline-message.component';
import { AfProgressComponent } from '../progress/af-progress.component';
import {
  AfAuthShellAsideDirective,
  AfAuthShellBackgroundDirective,
  AfAuthShellBrandDirective,
  AfAuthShellFooterDirective,
} from './af-auth-shell-slots.directive';
import { AfAuthShellComponent } from './af-auth-shell.component';

type AuthState = 'access' | 'expired' | 'preparing' | 'error';

interface AuthShellStoryArgs {
  variant: 'split' | 'centered';
  state: AuthState;
}

const meta: Meta<AuthShellStoryArgs> = {
  title: 'Patterns/Authentication/UnifiedAccess',
  component: AfAuthShellComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        AfButtonComponent,
        AfInlineMessageComponent,
        AfProgressComponent,
        AfAuthShellAsideDirective,
        AfAuthShellBackgroundDirective,
        AfAuthShellBrandDirective,
        AfAuthShellFooterDirective,
      ],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
    argfit: {
      category: 'Authentication',
      importName: 'AfAuthShell',
      useWhen: ['login and account access', 'onboarding access panels', 'expired session recovery'],
      avoidWhen: ['OAuth orchestration', 'navigation or authentication state machines'],
      platforms: ['desktop', 'mobile'],
      tokens: ['--af-bg-main', '--af-bg-surface', '--af-space-6'],
      related: ['AfInput', 'AfButton', 'AfInlineMessage', 'AfProgress'],
    },
    docs: {
      description: {
        component:
          'Reusable access layout. It owns responsive composition and visual hierarchy, never authentication or navigation state.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['split', 'centered'] },
    state: { control: 'select', options: ['access', 'expired', 'preparing', 'error'] },
  },
  render: (args) => ({
    props: args,
    template: `
      <af-auth-shell [variant]="variant" ariaLabel="Acceso unificado a ArgFit">
        <div afAuthShellBackground class="af-auth-story__background"></div>

        <div afAuthShellBrand class="af-auth-story__brand" aria-label="ArgFit">
          <span class="af-auth-story__mark">AF</span>
          <span>ARGFIT</span>
        </div>

        <div afAuthShellAside class="af-auth-story__aside">
          <p class="af-auth-story__eyebrow">ARGFIT FOOTBALL</p>
          <h2>La ciencia del deporte merece tecnología real.</h2>
          <p>Plantel, entrenamientos y rendimiento en un único espacio operativo.</p>
        </div>

        <div class="af-auth-story__content">
          @if (state === 'preparing') {
            <header>
              <p class="af-auth-story__eyebrow">PREPARANDO TU ESPACIO</p>
              <h1>ArgFit Football</h1>
              <p>Estamos restaurando permisos, equipo y datos locales.</p>
            </header>
            <ol class="af-auth-story__steps">
              <li data-state="done">Identidad validada</li>
              <li data-state="active">Cargando permisos</li>
              <li>Restaurando equipo y temporada</li>
              <li>Preparando datos locales</li>
            </ol>
            <af-progress [value]="42" ariaLabel="Preparación completada al 42 por ciento" />
          } @else {
            <header>
              <p class="af-auth-story__eyebrow">ARGFIT FOOTBALL</p>
              <h1>Acceso unificado</h1>
              <p>Autentícate una sola vez y accede a todo el ecosistema ArgFit.</p>
            </header>

            @if (state === 'expired') {
              <af-inline-message severity="warning" title="Tu sesión expiró" description="Vuelve a ingresar para continuar. Conservamos la pantalla en la que estabas." />
            }

            @if (state === 'error') {
              <af-inline-message severity="danger" title="No pudimos preparar tu espacio" description="Conservamos tus datos locales. Puedes reintentar sin perder cambios." />
              <div class="af-story-row"><af-button>Reintentar</af-button><af-button variant="secondary">Volver</af-button></div>
            } @else {
              <af-button size="lg" fullWidth icon="log-in" ariaLabel="Ingresar con ArgFit Identity">Ingresar</af-button>
              <p class="af-auth-story__hint">Single sign-on · OAuth 2.0 / OIDC</p>
            }
          }
        </div>

        <p afAuthShellFooter>Sports technology · Buenos Aires</p>
      </af-auth-shell>
    `,
  }),
};

export default meta;
type Story = StoryObj<AuthShellStoryArgs>;

export const Access: Story = { args: { variant: 'split', state: 'access' } };
export const SessionExpired: Story = { args: { variant: 'split', state: 'expired' } };
export const Preparing: Story = { args: { variant: 'centered', state: 'preparing' } };
export const Error: Story = { args: { variant: 'centered', state: 'error' } };
export const Centered: Story = { args: { variant: 'centered', state: 'access' } };
