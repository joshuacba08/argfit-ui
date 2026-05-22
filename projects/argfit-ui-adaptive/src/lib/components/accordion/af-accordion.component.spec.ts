import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  provideArgfitUi,
  type AfAccordionChange,
  type AfAccordionExpandedIds,
  type AfAccordionItem,
} from '@argfit-ui/core';

import { AfAccordionPanelDirective } from './af-accordion-panel.directive';
import { AfAccordionComponent } from './af-accordion.component';

@Component({
  imports: [AfAccordionComponent, AfAccordionPanelDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <af-accordion
      [items]="items()"
      [expandedIds]="expandedIds()"
      [multiple]="multiple()"
      ariaLabel="Athlete accordion"
      (expandedChange)="expandedIds.set($event)"
      (itemToggle)="changes.set([...changes(), $event])"
    >
      <ng-template afAccordionPanel="evaluation" let-item>
        <article class="accordion-panel">{{ item.label }} panel</article>
      </ng-template>

      <ng-template afAccordionPanel="readiness" let-item>
        <article class="accordion-panel">{{ item.label }} panel</article>
      </ng-template>
    </af-accordion>
  `,
})
class AdaptiveAccordionHostComponent {
  readonly items = signal<readonly AfAccordionItem[]>([
    {
      id: 'evaluation',
      label: 'Evaluacion',
      description: 'Screening inicial',
      meta: '12 campos',
      badge: { label: 'Core', tone: 'accent' },
    },
    {
      id: 'readiness',
      label: 'Readiness',
      description: 'Disponibilidad de sesion',
    },
    {
      id: 'history',
      label: 'Historial',
      description: 'Bloque deshabilitado',
      disabled: true,
    },
  ]);
  readonly expandedIds = signal<AfAccordionExpandedIds>(['evaluation']);
  readonly multiple = signal(false);
  readonly changes = signal<readonly AfAccordionChange[]>([]);
}

describe('AfAccordionComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders desktop accordion and supports keyboard toggle', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptiveAccordionHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptiveAccordionHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-accordion-desktop')).not.toBeNull();
    expect(root.querySelector('af-accordion-mobile')).toBeNull();
    expect(root.querySelector('.accordion-panel')?.textContent).toContain('Evaluacion');

    const headerButtons = root.querySelectorAll('.af-accordion-desktop__header-button');
    const evaluationButton = headerButtons[0] as HTMLButtonElement;
    evaluationButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();

    const readinessButton = headerButtons[1] as HTMLButtonElement;
    readinessButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.expandedIds()).toEqual(['readiness']);
    expect(fixture.componentInstance.changes()).toContainEqual(
      expect.objectContaining({ expanded: true, index: 1 }),
    );
    expect(root.querySelector('.accordion-panel')?.textContent).toContain('Readiness');
  });

  it('renders mobile accordion and supports multiple expansion', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptiveAccordionHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptiveAccordionHostComponent);
    fixture.componentInstance.multiple.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-accordion-mobile')).not.toBeNull();
    expect(root.querySelector('af-accordion-desktop')).toBeNull();

    const headerButtons = root.querySelectorAll('.af-accordion-mobile__header-button');
    (headerButtons[1] as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.expandedIds()).toEqual(['evaluation', 'readiness']);
    expect(root.querySelectorAll('.accordion-panel').length).toBe(2);
  });
});