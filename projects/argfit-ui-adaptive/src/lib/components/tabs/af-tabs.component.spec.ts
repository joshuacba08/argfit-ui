import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  provideArgfitUi,
  type AfTabChange,
  type AfTabItem,
  type AfTabsVariant,
} from '@argfit-ui/core';

import { AfTabPanelDirective } from './af-tab-panel.directive';
import { AfTabsComponent } from './af-tabs.component';

@Component({
  imports: [AfTabPanelDirective, AfTabsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <af-tabs
      [items]="items()"
      [activeId]="activeId()"
      [variant]="variant()"
      [renderPanel]="renderPanel()"
      ariaLabel="Athlete tabs"
      (activeIdChange)="activeId.set($event)"
      (tabChange)="changes.set([...changes(), $event])"
    >
      <ng-template afTabPanel="profile" let-item>
        <article class="tab-panel">Panel {{ item.label }}</article>
      </ng-template>

      <ng-template afTabPanel="readiness" let-item>
        <article class="tab-panel">Panel {{ item.label }}</article>
      </ng-template>
    </af-tabs>
  `,
})
class AdaptiveTabsHostComponent {
  readonly items = signal<readonly AfTabItem[]>([
    {
      id: 'profile',
      label: 'Perfil',
      description: 'Resumen del atleta',
      badge: { label: 'Activo', tone: 'success' },
    },
    {
      id: 'readiness',
      label: 'Readiness',
      description: 'Carga y disponibilidad',
    },
    {
      id: 'history',
      label: 'Historial',
      description: 'Sesiones anteriores',
      disabled: true,
    },
  ]);
  readonly activeId = signal<string | undefined>('profile');
  readonly variant = signal<AfTabsVariant>('cards');
  readonly renderPanel = signal(true);
  readonly changes = signal<readonly AfTabChange[]>([]);
}

describe('AfTabsComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders desktop tabs and supports keyboard navigation', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptiveTabsHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptiveTabsHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-tabs-desktop')).not.toBeNull();
    expect(root.querySelector('af-tabs-mobile')).toBeNull();
    expect(root.querySelector('.tab-panel')?.textContent).toContain('Perfil');

    const tabButtons = root.querySelectorAll('.af-tabs-desktop__tab-button');
    const profileButton = tabButtons[0] as HTMLButtonElement;
    profileButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.activeId()).toBe('readiness');
    expect(fixture.componentInstance.changes()).toContainEqual(
      expect.objectContaining({ activeId: 'readiness', previousId: 'profile' }),
    );
    expect(root.querySelector('.tab-panel')?.textContent).toContain('Readiness');
  });

  it('renders mobile tabs with the projected panel template', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptiveTabsHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptiveTabsHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-tabs-mobile')).not.toBeNull();
    expect(root.querySelector('af-tabs-desktop')).toBeNull();
    expect(root.querySelector('.tab-panel')?.textContent).toContain('Perfil');

    const tabButtons = root.querySelectorAll('.af-tabs-mobile__tab-button');
    (tabButtons[1] as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.activeId()).toBe('readiness');
    expect(root.querySelector('.tab-panel')?.textContent).toContain('Readiness');
  });

  it('renders compact line navigation without an implicit panel', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptiveTabsHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptiveTabsHostComponent);
    fixture.componentInstance.variant.set('line');
    fixture.componentInstance.renderPanel.set(false);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-tabs-desktop')?.getAttribute('data-variant')).toBe('line');
    expect(root.querySelector('.af-tabs-desktop__panel')).toBeNull();
    expect(root.querySelector('.af-tabs-desktop__empty')).toBeNull();
    expect(root.querySelector('.af-tabs-desktop__tab-button')?.hasAttribute('aria-controls')).toBe(false);
  });

  it('uses the same line navigation contract on mobile', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptiveTabsHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptiveTabsHostComponent);
    fixture.componentInstance.variant.set('line');
    fixture.componentInstance.renderPanel.set(false);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-tabs-mobile')?.getAttribute('data-variant')).toBe('line');
    expect(root.querySelector('.af-tabs-mobile__panel')).toBeNull();
    expect(root.querySelector('.af-tabs-mobile__tab-button')?.hasAttribute('aria-controls')).toBe(false);
  });
});
