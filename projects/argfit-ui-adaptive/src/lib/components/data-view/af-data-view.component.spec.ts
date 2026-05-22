import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideArgfitUi, type AfDataViewItem, type AfDataViewLayout } from '@argfit-ui/core';

import { AfDataViewItemDirective } from './af-data-view-item.directive';
import {
  AfDataViewActionsDirective,
  AfDataViewEmptyDirective,
  AfDataViewLoadingDirective,
} from './af-data-view-slots.directive';
import { AfDataViewComponent } from './af-data-view.component';

@Component({
  standalone: true,
  imports: [
    AfDataViewActionsDirective,
    AfDataViewComponent,
    AfDataViewEmptyDirective,
    AfDataViewItemDirective,
    AfDataViewLoadingDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <af-data-view
      [items]="items()"
      [layout]="layout()"
      [loading]="loading()"
      emptyDescription="Carga un grupo para comenzar"
      (itemPressed)="pressed.set($event)"
    >
      <div afDataViewActions class="data-view-actions">Toolbar</div>
      <div afDataViewEmpty class="data-view-empty">Sin resultados custom</div>
      <div afDataViewLoading class="data-view-loading">Cargando custom</div>
      <ng-template afDataViewItem let-item>
        <div class="data-view-template">{{ item.title }}</div>
      </ng-template>
    </af-data-view>
  `,
})
class AdaptiveDataViewHostComponent {
  readonly items = signal<readonly AfDataViewItem[]>([
    {
      id: 'plan-semanal',
      title: 'Plan semanal',
      eyebrow: 'Potencia',
      description: 'Microciclo con enfasis en RSI y asimetria.',
      meta: 'Hoy 10:30',
      badge: { label: 'Activo', tone: 'success' },
    },
    {
      id: 'sesion-de-carga',
      title: 'Sesion de carga',
      eyebrow: 'Fuerza',
      description: 'Bloque de sentadilla y monitoreo de salto.',
      meta: 'Manana 08:00',
      badge: { label: 'Pendiente', tone: 'warning' },
    },
  ]);
  readonly layout = signal<AfDataViewLayout>('grid');
  readonly loading = signal(false);
  readonly pressed = signal<AfDataViewItem | undefined>(undefined);
}

describe('AfDataViewComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders desktop data view with projected actions and item template', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptiveDataViewHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptiveDataViewHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-data-view-desktop')).not.toBeNull();
    expect(root.querySelector('af-data-view-mobile')).toBeNull();
    expect(root.querySelector('.data-view-actions')?.textContent).toContain('Toolbar');
    expect(root.querySelector('.data-view-template')?.textContent).toContain('Plan semanal');

    const firstItem = root.querySelector('.af-data-view-desktop__item') as HTMLElement;
    firstItem.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.pressed()).toEqual(
      expect.objectContaining({ id: 'plan-semanal', title: 'Plan semanal' }),
    );
  });

  it('renders mobile data view with the custom empty slot', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptiveDataViewHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptiveDataViewHostComponent);
    fixture.componentInstance.items.set([]);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-data-view-mobile')).not.toBeNull();
    expect(root.querySelector('af-data-view-desktop')).toBeNull();
    expect(root.querySelector('.data-view-empty')?.textContent).toContain('Sin resultados custom');
  });
});