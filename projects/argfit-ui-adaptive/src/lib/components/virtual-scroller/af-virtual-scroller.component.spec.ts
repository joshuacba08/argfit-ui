import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
    provideArgfitUi,
    type AfVirtualScrollerItem,
    type AfVirtualScrollerRange,
} from '@argfit-ui/core';

import { AfVirtualScrollerItemDirective } from './af-virtual-scroller-item.directive';
import {
    AfVirtualScrollerActionsDirective,
    AfVirtualScrollerEmptyDirective,
    AfVirtualScrollerLoadingDirective,
} from './af-virtual-scroller-slots.directive';
import { AfVirtualScrollerComponent } from './af-virtual-scroller.component';

@Component({
  standalone: true,
  imports: [
    AfVirtualScrollerActionsDirective,
    AfVirtualScrollerComponent,
    AfVirtualScrollerEmptyDirective,
    AfVirtualScrollerItemDirective,
    AfVirtualScrollerLoadingDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <af-virtual-scroller
      [items]="items()"
      [viewportHeight]="180"
      [itemHeight]="60"
      [overscan]="1"
      emptyDescription="No hay registros masivos para este filtro"
      (itemPressed)="pressed.set($event)"
      (visibleRangeChange)="range.set($event)"
    >
      <div afVirtualScrollerActions class="virtual-scroller-actions">Acciones virtual scroller</div>
      <div afVirtualScrollerEmpty class="virtual-scroller-empty">Virtual scroller vacio custom</div>
      <div afVirtualScrollerLoading class="virtual-scroller-loading">Virtual scroller loading custom</div>
      <ng-template afVirtualScrollerItem let-item let-itemIndex="itemIndex">
        <div class="virtual-scroller-template">{{ itemIndex }} · {{ item.title }}</div>
      </ng-template>
    </af-virtual-scroller>
  `,
})
class AdaptiveVirtualScrollerHostComponent {
  readonly items = signal<readonly AfVirtualScrollerItem[]>(
    Array.from({ length: 24 }, (_, index) => ({
      id: `session-${index + 1}`,
      title: `Sesion ${index + 1}`,
      description: `Carga operativa ${index + 1}`,
      meta: `Bloque ${Math.floor(index / 4) + 1}`,
      icon: 'calendar',
    })),
  );
  readonly pressed = signal<AfVirtualScrollerItem | undefined>(undefined);
  readonly range = signal<AfVirtualScrollerRange | undefined>(undefined);
}

describe('AfVirtualScrollerComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders desktop virtual scroller with projected actions and a reduced visible window', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptiveVirtualScrollerHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptiveVirtualScrollerHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-virtual-scroller-desktop')).not.toBeNull();
    expect(root.querySelector('af-virtual-scroller-mobile')).toBeNull();
    expect(root.querySelector('.virtual-scroller-actions')?.textContent).toContain('Acciones virtual scroller');
    expect(root.querySelectorAll('.af-virtual-scroller-desktop__item').length).toBeLessThan(24);

    const firstItem = root.querySelector('.af-virtual-scroller-desktop__item') as HTMLButtonElement;
    firstItem.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.pressed()).toEqual(
      expect.objectContaining({ id: 'session-1', title: 'Sesion 1' }),
    );

    const viewport = root.querySelector('.af-virtual-scroller-desktop__viewport') as HTMLDivElement;
    viewport.scrollTop = 240;
    viewport.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    expect(fixture.componentInstance.range()).toEqual(
      expect.objectContaining({ startIndex: expect.any(Number), totalItems: 24 }),
    );
    expect((fixture.componentInstance.range()?.startIndex ?? 0)).toBeGreaterThan(0);
  });

  it('renders mobile virtual scroller with the custom empty slot', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptiveVirtualScrollerHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptiveVirtualScrollerHostComponent);
    fixture.componentInstance.items.set([]);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-virtual-scroller-mobile')).not.toBeNull();
    expect(root.querySelector('af-virtual-scroller-desktop')).toBeNull();
    expect(root.querySelector('.virtual-scroller-empty')?.textContent).toContain('Virtual scroller vacio custom');
  });
});
