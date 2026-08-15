import { Component, PLATFORM_ID, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  provideArgfitUi,
  type AfCommandPaletteItem,
  type AfCommandPaletteSearchMode,
} from '@argfit-ui/core';

import { AfCommandPaletteItemDirective } from './af-command-palette-item.directive';
import { AfCommandPaletteComponent } from './af-command-palette.component';

const ITEMS: readonly AfCommandPaletteItem[] = [
  {
    id: 'locked',
    label: 'Administración',
    group: 'Acciones',
    icon: 'settings',
    disabled: true,
    disabledReason: 'Requiere permisos',
  },
  {
    id: 'dashboard',
    label: 'Ir al resumen',
    description: 'Vista principal del equipo',
    group: 'Navegación',
    icon: 'home',
    keywords: ['inicio'],
  },
  {
    id: 'settings',
    label: 'Configuración',
    group: 'Acciones',
    icon: 'settings',
  },
];

@Component({
  imports: [AfCommandPaletteComponent],
  template: `
    <af-command-palette
      [items]="items()"
      [open]="open()"
      [query]="query()"
      [searchMode]="searchMode()"
      [loading]="loading()"
      [errorText]="errorText()"
      [shortcutEnabled]="shortcutEnabled()"
      (openChange)="open.set($event)"
      (queryChange)="query.set($event)"
      (itemSelected)="selected = $event"
    />
  `,
})
class HostComponent {
  readonly items = signal(ITEMS);
  readonly open = signal(false);
  readonly query = signal('');
  readonly searchMode = signal<AfCommandPaletteSearchMode>('client');
  readonly loading = signal(false);
  readonly errorText = signal<string | undefined>(undefined);
  readonly shortcutEnabled = signal(true);
  selected: AfCommandPaletteItem | null = null;
}

describe('AfCommandPaletteComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  async function createHost(platform: 'desktop' | 'mobile' = 'desktop') {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideArgfitUi({ platform })],
    }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('opens from its trigger and renders the desktop implementation', async () => {
    const fixture = await createHost();

    (fixture.nativeElement.querySelector(
      '.af-command-palette-desktop__trigger',
    ) as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.open()).toBe(true);
    expect(fixture.nativeElement.querySelector('af-command-palette-desktop')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('[role="dialog"]')).not.toBeNull();
  });

  it('delegates to the fullscreen mobile renderer', async () => {
    const fixture = await createHost('mobile');
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('af-command-palette-mobile')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.af-command-palette-mobile__panel')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('af-command-palette-desktop')).toBeNull();
  });

  it('filters client-side without case or diacritics and groups the results', async () => {
    const fixture = await createHost();
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('[role="combobox"]') as HTMLInputElement;
    input.value = 'CONFIGURACION';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('[role="option"]');
    expect(options.length).toBe(1);
    expect(options[0].textContent).toContain('Configuración');
    expect(fixture.nativeElement.querySelector('.af-command-palette-desktop__group-label').textContent)
      .toContain('Acciones');
  });

  it('does not filter items in server mode while still updating query', async () => {
    const fixture = await createHost();
    fixture.componentInstance.searchMode.set('server');
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('[role="combobox"]') as HTMLInputElement;
    input.value = 'remote query';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.query()).toBe('remote query');
    expect(fixture.nativeElement.querySelectorAll('[role="option"]').length).toBe(3);
  });

  it('opens with Ctrl+K and can disable the global shortcut', async () => {
    const fixture = await createHost();
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    }));
    fixture.detectChanges();
    expect(fixture.componentInstance.open()).toBe(true);

    fixture.componentInstance.open.set(false);
    fixture.componentInstance.shortcutEnabled.set(false);
    fixture.detectChanges();
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      bubbles: true,
      cancelable: true,
    }));
    fixture.detectChanges();
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('skips disabled items, selects with Enter, closes and clears query', async () => {
    const fixture = await createHost();
    fixture.componentInstance.open.set(true);
    fixture.componentInstance.query.set('');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('[role="combobox"]') as HTMLInputElement;
    const activeOptionId = input.getAttribute('aria-activedescendant');
    expect(document.getElementById(activeOptionId!)?.textContent).toContain('Configuración');

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.selected?.id).toBe('dashboard');
    expect(fixture.componentInstance.open()).toBe(false);
    expect(fixture.componentInstance.query()).toBe('');
  });

  it('renders loading, error and empty states with the expected precedence', async () => {
    const fixture = await createHost();
    fixture.componentInstance.open.set(true);
    fixture.componentInstance.items.set([]);
    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Buscando...');

    fixture.componentInstance.errorText.set('No se pudo buscar');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent)
      .toContain('No se pudo buscar');

    fixture.componentInstance.errorText.set(undefined);
    fixture.componentInstance.loading.set(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No se encontraron resultados');
  });

  it('exposes item, index, active and query to a custom item template', async () => {
    @Component({
      imports: [AfCommandPaletteComponent, AfCommandPaletteItemDirective],
      template: `
        <af-command-palette [items]="items" [open]="true" [shortcutEnabled]="false">
          <ng-template afCommandPaletteItem let-item let-index="itemIndex" let-active="active" let-query="query">
            <span class="custom-item">{{ index }}|{{ item.label }}|{{ active }}|{{ query }}</span>
          </ng-template>
        </af-command-palette>
      `,
    })
    class TemplateHost {
      readonly items = [ITEMS[1]];
    }

    await TestBed.configureTestingModule({
      imports: [TemplateHost],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();
    const fixture = TestBed.createComponent(TemplateHost);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.custom-item').textContent)
      .toContain('0|Ir al resumen|true|');
  });

  it('does not register browser-only shortcut behavior during SSR', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        provideArgfitUi({ platform: 'desktop' }),
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(() => document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    }))).not.toThrow();
    fixture.detectChanges();

    expect(fixture.componentInstance.open()).toBe(false);
  });
});
