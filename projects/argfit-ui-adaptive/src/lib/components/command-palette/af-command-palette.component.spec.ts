import { Component, inject, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AfCommandPaletteService,
  provideAfCommandExecutor,
  provideAfCommandPalette,
  provideArgfitUi,
  type AfCommandExecutionContext,
  type AfCommandExecutionEvent,
  type AfCommandPaletteConfig,
} from '@argfit-ui/core';

import { AfCommandPaletteCommandDirective } from './af-command-palette-command.directive';
import { AfCommandPaletteEntityDirective } from './af-command-palette-entity.directive';
import { AfCommandPaletteComponent } from './af-command-palette.component';

const CONFIG: AfCommandPaletteConfig = {
  version: 1,
  id: 'test',
  shortcut: 'Mod+K',
  defaultMode: 'all',
  modes: [
    { id: 'all', label: 'Todo' },
    { id: 'navigation', label: 'Navegación', prefix: '/' },
  ],
  commands: [
    {
      id: 'admin',
      label: 'Administración',
      enabledWhen: "role == 'admin'",
      disabledReason: 'Requiere permisos',
      executorId: 'run',
    },
    {
      id: 'dashboard',
      label: 'Ir al resumen',
      description: 'Vista principal del equipo',
      keywords: ['inicio'],
      modes: ['all', 'navigation'],
      executorId: 'run',
    },
    {
      id: 'export',
      label: 'Exportar informe',
      executorId: 'run',
      parameters: [
        { id: 'format', label: 'Formato', type: 'select', required: true, options: [
          { value: 'pdf', label: 'PDF' }, { value: 'xlsx', label: 'Excel' },
        ] },
        { id: 'name', label: 'Nombre', type: 'text', required: true },
        { id: 'confirm', label: 'Generar exportación', type: 'confirm' },
      ],
    },
    { id: 'missing', label: 'Sin ejecutor', executorId: 'missing' },
  ],
};

@Component({
  imports: [AfCommandPaletteComponent],
  template: '<af-command-palette (commandExecution)="events.push($event)" />',
})
class HostComponent {
  readonly palette = inject(AfCommandPaletteService);
  readonly events: AfCommandExecutionEvent[] = [];
}

describe('AfCommandPaletteComponent V2', () => {
  let executions: AfCommandExecutionContext[];

  beforeEach(() => { executions = []; });
  afterEach(() => {
    document.body.style.overflow = '';
    TestBed.resetTestingModule();
  });

  async function createHost(platform: 'desktop' | 'mobile' = 'desktop', ssr = false) {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        provideArgfitUi({ platform }),
        provideAfCommandPalette(CONFIG),
        provideAfCommandExecutor('run', () => (context) => { executions.push(context); }),
        ...(ssr ? [{ provide: PLATFORM_ID, useValue: 'server' }] : []),
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('opens the single global host and delegates to desktop or mobile', async () => {
    const desktop = await createHost();
    (desktop.nativeElement.querySelector('.af-command-palette-desktop__trigger') as HTMLElement).click();
    desktop.detectChanges();
    expect(desktop.nativeElement.querySelector('[role="dialog"]')).not.toBeNull();
    expect(desktop.nativeElement.querySelector('af-command-palette-desktop')).not.toBeNull();

    TestBed.resetTestingModule();
    const mobile = await createHost('mobile');
    mobile.componentInstance.palette.open();
    mobile.detectChanges();
    expect(mobile.nativeElement.querySelector('.af-command-palette-mobile__panel')).not.toBeNull();
  });

  it('uses fuzzy search, mode prefixes and context clauses', async () => {
    const fixture = await createHost();
    const palette = fixture.componentInstance.palette;
    palette.open();
    palette.setQuery('irsmen');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('[role="option"]').length).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Ir al resumen');

    palette.setQuery('/');
    fixture.detectChanges();
    expect(palette.modeId()).toBe('navigation');
    expect(fixture.nativeElement.textContent).not.toContain('Administración');

    palette.setMode('all');
    palette.setContext('role', 'member');
    fixture.detectChanges();
    const admin = [...fixture.nativeElement.querySelectorAll('[role="option"]')]
      .find((option: Element) => option.textContent?.includes('Administración')) as HTMLElement;
    expect(admin.getAttribute('aria-disabled')).toBe('true');
  });

  it('opens with Mod+K, skips an unavailable executor and dispatches a registered command', async () => {
    const fixture = await createHost();
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'k', ctrlKey: true, bubbles: true, cancelable: true,
    }));
    fixture.detectChanges();
    expect(fixture.componentInstance.palette.isOpen()).toBe(true);

    const missing = [...fixture.nativeElement.querySelectorAll('[role="option"]')]
      .find((option: Element) => option.textContent?.includes('Sin ejecutor')) as HTMLElement;
    expect(missing.getAttribute('aria-disabled')).toBe('true');

    fixture.componentInstance.palette.activate('dashboard');
    await Promise.resolve();
    fixture.detectChanges();
    expect(executions[0]?.command.id).toBe('dashboard');
    expect(fixture.componentInstance.palette.isOpen()).toBe(false);
    expect(fixture.componentInstance.events.map((event) => event.type)).toContain('dispatch');
  });

  it('collects quick parameters and goes back one step with Escape semantics', async () => {
    const fixture = await createHost();
    const palette = fixture.componentInstance.palette;
    palette.open();
    palette.activate('export');
    fixture.detectChanges();
    expect(palette.currentParameter()?.id).toBe('format');
    expect(palette.loading()).toBe(false);
    const pdf = palette.results().find((result) => result.label === 'PDF')!;
    palette.activate(pdf.id);
    palette.setQuery('Informe semanal');
    fixture.detectChanges();
    expect(palette.currentParameter()?.id).toBe('name');
    palette.back();
    expect(palette.currentParameter()?.id).toBe('format');
    palette.activate(palette.results().find((result) => result.label === 'PDF')!.id);
    palette.setQuery('Informe semanal');
    palette.activate(palette.results()[0]!.id);
    palette.activate(palette.results()[0]!.id);
    await Promise.resolve();
    expect(executions[0]?.parameters).toEqual({ format: 'pdf', name: 'Informe semanal', confirm: true });
  });

  it('provides result, index, active, query and mode to the V2 template', async () => {
    @Component({
      imports: [AfCommandPaletteComponent, AfCommandPaletteCommandDirective],
      template: `
        <af-command-palette>
          <ng-template afCommandPaletteCommand let-result let-index="resultIndex" let-active="active" let-mode="modeId">
            <span class="custom-result">{{ index }}|{{ result.label }}|{{ active }}|{{ mode }}</span>
          </ng-template>
        </af-command-palette>
      `,
    })
    class TemplateHost {
      readonly palette = inject(AfCommandPaletteService);
    }
    await TestBed.configureTestingModule({
      imports: [TemplateHost],
      providers: [provideArgfitUi({ platform: 'desktop' }), provideAfCommandPalette(CONFIG), provideAfCommandExecutor('run', () => () => undefined)],
    }).compileComponents();
    const fixture = TestBed.createComponent(TemplateHost);
    fixture.componentInstance.palette.open();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.custom-result').textContent).toContain('0|Administración|');
    expect(fixture.nativeElement.querySelector('.custom-result').textContent).toContain('|all');
  });

  it('provides entity and collection context to the entity-only template', async () => {
    const entityConfig: AfCommandPaletteConfig = {
      version: 1,
      id: 'entity-template',
      commands: [],
      collections: [{
        id: 'players',
        label: 'Jugadores',
        entities: [{ kind: 'entity', id: 'martin', label: 'Martín Ruiz' }],
        actions: [{ id: 'players.edit', label: 'Editar', executorId: 'run' }],
      }],
    };
    @Component({
      imports: [AfCommandPaletteComponent, AfCommandPaletteEntityDirective],
      template: `
        <af-command-palette>
          <ng-template afCommandPaletteEntity let-entity let-collection="collection" let-active="active">
            <span class="custom-entity">{{ collection.label }}|{{ entity.label }}|{{ active }}</span>
          </ng-template>
        </af-command-palette>
      `,
    })
    class EntityTemplateHost {
      readonly palette = inject(AfCommandPaletteService);
    }
    await TestBed.configureTestingModule({
      imports: [EntityTemplateHost],
      providers: [
        provideArgfitUi({ platform: 'desktop' }),
        provideAfCommandPalette(entityConfig),
        provideAfCommandExecutor('run', () => () => undefined),
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(EntityTemplateHost);
    fixture.componentInstance.palette.open();
    fixture.componentInstance.palette.activate('collection:players');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.custom-entity').textContent)
      .toContain('Jugadores|Martín Ruiz|true');
  });

  it('does not register browser-only shortcuts during SSR', async () => {
    const fixture = await createHost('desktop', true);
    expect(() => document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'k', ctrlKey: true, bubbles: true, cancelable: true,
    }))).not.toThrow();
    fixture.detectChanges();
    expect(fixture.componentInstance.palette.isOpen()).toBe(false);
  });
});
