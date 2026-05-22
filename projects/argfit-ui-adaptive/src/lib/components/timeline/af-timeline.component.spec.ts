import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideArgfitUi, type AfTimelineItem } from '@argfit-ui/core';

import { AfTimelineItemDirective } from './af-timeline-item.directive';
import {
    AfTimelineActionsDirective,
    AfTimelineEmptyDirective,
    AfTimelineLoadingDirective,
} from './af-timeline-slots.directive';
import { AfTimelineComponent } from './af-timeline.component';

@Component({
  standalone: true,
  imports: [
    AfTimelineActionsDirective,
    AfTimelineComponent,
    AfTimelineEmptyDirective,
    AfTimelineItemDirective,
    AfTimelineLoadingDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <af-timeline
      [items]="items()"
      [loading]="loading()"
      emptyDescription="Aun no hay hitos para este atleta"
      (itemPressed)="pressed.set($event)"
    >
      <div afTimelineActions class="timeline-actions">Acciones timeline</div>
      <div afTimelineEmpty class="timeline-empty">Timeline vacia custom</div>
      <div afTimelineLoading class="timeline-loading">Timeline loading custom</div>
      <ng-template afTimelineItem let-item>
        <div class="timeline-template">{{ item.title }}</div>
      </ng-template>
    </af-timeline>
  `,
})
class AdaptiveTimelineHostComponent {
  readonly items = signal<readonly AfTimelineItem[]>([
    {
      id: 'session-created',
      title: 'Sesion creada',
      timestamp: 'Hoy 08:00',
      eyebrow: 'Setup',
      description: 'El cuerpo tecnico preparo la carga inicial del bloque.',
      badge: { label: 'Activo', tone: 'success' },
      icon: 'calendar',
    },
    {
      id: 'session-reviewed',
      title: 'Revision completada',
      timestamp: 'Hoy 11:45',
      eyebrow: 'Staff',
      description: 'Se revisaron asimetrias y readiness antes del entrenamiento.',
      badge: { label: 'Pendiente', tone: 'warning' },
      icon: 'check-square',
    },
  ]);
  readonly loading = signal(false);
  readonly pressed = signal<AfTimelineItem | undefined>(undefined);
}

describe('AfTimelineComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders desktop timeline with projected actions and item template', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptiveTimelineHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptiveTimelineHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-timeline-desktop')).not.toBeNull();
    expect(root.querySelector('af-timeline-mobile')).toBeNull();
    expect(root.querySelector('.timeline-actions')?.textContent).toContain('Acciones timeline');
    expect(root.querySelector('.timeline-template')?.textContent).toContain('Sesion creada');

    const firstItem = root.querySelector('.af-timeline-desktop__item') as HTMLElement;
    firstItem.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.pressed()).toEqual(
      expect.objectContaining({ id: 'session-created', title: 'Sesion creada' }),
    );
  });

  it('renders mobile timeline with the custom empty slot', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptiveTimelineHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptiveTimelineHostComponent);
    fixture.componentInstance.items.set([]);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-timeline-mobile')).not.toBeNull();
    expect(root.querySelector('af-timeline-desktop')).toBeNull();
    expect(root.querySelector('.timeline-empty')?.textContent).toContain('Timeline vacia custom');
  });
});
