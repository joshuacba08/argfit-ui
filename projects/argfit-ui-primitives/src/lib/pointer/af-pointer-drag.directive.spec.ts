import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AfPointerDragDirective, type AfPointerDragEvent } from './af-pointer-drag.directive';

@Component({
  imports: [AfPointerDragDirective],
  template: `
    <button
      type="button"
      afPointerDrag
      [afPointerDragDisabled]="disabled()"
      [afPointerDragLongPress]="longPress()"
      (dragStart)="log($event)"
      (dragMove)="log($event)"
      (dragEnd)="log($event)"
      (dragCancel)="log($event)"
      (click)="clicks.set(clicks() + 1)"
    >
      <span data-testid="handle" (pointerdown)="$event.stopPropagation()">Bloque</span>
    </button>
  `,
})
class AfPointerDragHostComponent {
  readonly disabled = signal(false);
  readonly longPress = signal(0);
  readonly events = signal<AfPointerDragEvent[]>([]);
  readonly clicks = signal(0);

  log(event: AfPointerDragEvent): void {
    this.events.update((list) => [...list, event]);
  }
}

function pointer(type: string, init: PointerEventInit = {}): PointerEvent {
  return new PointerEvent(type, {
    pointerId: 1,
    pointerType: 'mouse',
    button: 0,
    bubbles: true,
    cancelable: true,
    ...init,
  });
}

describe('AfPointerDragDirective', () => {
  const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  const render = async () => {
    await TestBed.configureTestingModule({
      imports: [AfPointerDragHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfPointerDragHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const element = fixture.nativeElement.querySelector('button') as HTMLElement;
    // happy-dom no implementa pointer capture; el directive lo llama de forma
    // opcional, pero los stubs mantienen la intención visible en el test.
    element.setPointerCapture = () => undefined;
    element.hasPointerCapture = () => false;
    element.releasePointerCapture = () => undefined;

    const phases = () => fixture.componentInstance.events().map((event) => event.phase);

    return { fixture, element, phases };
  };

  it('does not treat a click as a drag', async () => {
    const { fixture, element, phases } = await render();

    element.dispatchEvent(pointer('pointerdown', { clientX: 10, clientY: 10 }));
    element.dispatchEvent(pointer('pointerup', { clientX: 10, clientY: 10 }));
    element.click();

    expect(phases()).toEqual([]);
    expect(fixture.componentInstance.clicks()).toBe(1);
  });

  it('starts only after crossing the threshold', async () => {
    const { element, phases } = await render();

    element.dispatchEvent(pointer('pointerdown', { clientX: 10, clientY: 10 }));
    element.dispatchEvent(pointer('pointermove', { clientX: 12, clientY: 11 }));
    expect(phases()).toEqual([]);

    element.dispatchEvent(pointer('pointermove', { clientX: 30, clientY: 40 }));
    await nextFrame();
    expect(phases()).toEqual(['start', 'move']);
  });

  it('captures a gesture even when a child handle stops bubbling', async () => {
    const { element, phases } = await render();
    const handle = element.querySelector('[data-testid="handle"]') as HTMLElement;

    handle.dispatchEvent(pointer('pointerdown', { clientX: 10, clientY: 10 }));
    element.dispatchEvent(pointer('pointermove', { clientX: 10, clientY: 30 }));
    element.dispatchEvent(pointer('pointerup', { clientX: 10, clientY: 30 }));

    expect(phases()).toEqual(['start', 'move', 'end']);
  });

  it('commits on pointerup, never on pointerdown', async () => {
    const { fixture, element, phases } = await render();

    element.dispatchEvent(pointer('pointerdown', { clientX: 0, clientY: 0 }));
    element.dispatchEvent(pointer('pointermove', { clientX: 0, clientY: 64 }));
    // El movimiento se agrupa al próximo frame; todavía no hay commit.
    expect(phases()).toEqual(['start']);

    element.dispatchEvent(pointer('pointerup', { clientX: 0, clientY: 64 }));

    expect(phases()).toEqual(['start', 'move', 'end']);
    const end = fixture.componentInstance.events().at(-1);
    expect(end?.deltaY).toBe(64);
  });

  it('reports the delta against the press origin, not the previous move', async () => {
    const { fixture, element } = await render();

    element.dispatchEvent(pointer('pointerdown', { clientX: 100, clientY: 100 }));
    element.dispatchEvent(pointer('pointermove', { clientX: 100, clientY: 130 }));
    element.dispatchEvent(pointer('pointermove', { clientX: 140, clientY: 160 }));
    await nextFrame();

    const last = fixture.componentInstance.events().at(-1);
    expect(last?.deltaX).toBe(40);
    expect(last?.deltaY).toBe(60);
  });

  it('cancels on Escape and asks for a revert', async () => {
    const { element, phases } = await render();

    element.dispatchEvent(pointer('pointerdown', { clientX: 0, clientY: 0 }));
    element.dispatchEvent(pointer('pointermove', { clientX: 0, clientY: 64 }));
    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(phases()).toEqual(['start', 'move', 'cancel']);
  });

  it('cancels on pointercancel', async () => {
    const { fixture, element, phases } = await render();

    element.dispatchEvent(pointer('pointerdown', { clientX: 0, clientY: 0 }));
    element.dispatchEvent(pointer('pointermove', { clientX: 0, clientY: 64 }));
    element.dispatchEvent(pointer('pointercancel', { clientX: 0, clientY: 64 }));

    expect(phases()).toEqual(['start', 'move', 'cancel']);
    expect(fixture.componentInstance.events().at(-1)?.cancelReason).toBe('pointercancel');
  });

  it('uses the immediate 4px path for pen pointers', async () => {
    const { fixture, element, phases } = await render();
    element.dispatchEvent(pointer('pointerdown', { pointerType: 'pen', clientX: 0, clientY: 0 }));
    element.dispatchEvent(pointer('pointermove', { pointerType: 'pen', clientX: 4, clientY: 0 }));
    element.dispatchEvent(pointer('pointerup', { pointerType: 'pen', clientX: 4, clientY: 0 }));

    expect(phases()).toEqual(['start', 'move', 'end']);
    expect(fixture.componentInstance.events()[0].pointerType).toBe('pen');
  });

  it('does not emit an end after a cancel', async () => {
    const { element, phases } = await render();

    element.dispatchEvent(pointer('pointerdown', { clientX: 0, clientY: 0 }));
    element.dispatchEvent(pointer('pointermove', { clientX: 0, clientY: 64 }));
    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    element.dispatchEvent(pointer('pointerup', { clientX: 0, clientY: 64 }));

    expect(phases()).toEqual(['start', 'move', 'cancel']);
  });

  it('stays out of the way when disabled', async () => {
    const { fixture, element, phases } = await render();

    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    element.dispatchEvent(pointer('pointerdown', { clientX: 0, clientY: 0 }));
    element.dispatchEvent(pointer('pointermove', { clientX: 0, clientY: 64 }));

    expect(phases()).toEqual([]);
  });

  it('waits for a long press on touch and yields to scrolling', async () => {
    vi.useFakeTimers();
    const { fixture, element, phases } = await render();
    fixture.componentInstance.longPress.set(350);
    fixture.detectChanges();

    element.dispatchEvent(pointer('pointerdown', { pointerType: 'touch', clientX: 0, clientY: 0 }));
    // El dedo se va antes del long-press: gana el scroll de la página.
    element.dispatchEvent(
      pointer('pointermove', { pointerType: 'touch', clientX: 0, clientY: 40 }),
    );
    vi.advanceTimersByTime(400);

    expect(phases()).toEqual([]);
    vi.useRealTimers();
  });

  it('arms the drag once the long press completes without movement', async () => {
    vi.useFakeTimers();
    const { fixture, element, phases } = await render();
    fixture.componentInstance.longPress.set(350);
    fixture.detectChanges();

    element.dispatchEvent(pointer('pointerdown', { pointerType: 'touch', clientX: 0, clientY: 0 }));
    vi.advanceTimersByTime(400);
    element.dispatchEvent(
      pointer('pointermove', { pointerType: 'touch', clientX: 0, clientY: 60 }),
    );
    element.dispatchEvent(pointer('pointerup', { pointerType: 'touch', clientX: 0, clientY: 60 }));

    expect(phases()).toEqual(['start', 'move', 'end']);
    vi.useRealTimers();
  });
});
