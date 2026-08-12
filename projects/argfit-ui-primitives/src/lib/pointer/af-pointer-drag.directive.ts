import {
    booleanAttribute,
    DestroyRef,
    Directive,
    ElementRef,
    inject,
    input,
    output,
    signal,
} from '@angular/core';

/**
 * Arrastre por puntero con confirmación en `pointerup`.
 *
 * Existe para que el arrastre se comporte igual en escritorio y en móvil sin
 * que ninguno de los dos renderers duplique el manejo de puntero — y para que
 * esa parte sea testeable, que es donde los calendarios suelen romperse.
 *
 * Reglas que impone:
 *
 * - **El commit ocurre en `pointerup`, nunca en `pointerdown`.** Presionar no
 *   es mover: hasta soltar, lo que hay es una vista previa.
 * - **Un click no es un arrastre.** Hasta superar el umbral no se emite
 *   `dragStart`, así que el click del elemento sigue funcionando.
 * - **Escape y `pointercancel` cancelan**, y quien escucha revierte.
 * - **En táctil espera un long-press** antes de capturar. Mientras espera no
 *   bloquea el gesto: si el dedo se mueve, gana el scroll de la página y el
 *   arrastre se descarta. Es la única forma de que `touch-action: pan-y`
 *   conviva con el arrastre en la misma superficie.
 */

export type AfPointerDragPhase = 'start' | 'move' | 'end' | 'cancel';

export interface AfPointerDragEvent {
  readonly phase: AfPointerDragPhase;
  readonly deltaX: number;
  readonly deltaY: number;
  readonly clientX: number;
  readonly clientY: number;
  /** `'mouse' | 'touch' | 'pen'`, tal como lo informa el navegador. */
  readonly pointerType: string;
}

/** Distancia en píxeles antes de considerar que el gesto es un arrastre. */
const DEFAULT_THRESHOLD_PX = 4;

/** Espera antes de capturar en táctil. */
const DEFAULT_LONG_PRESS_MS = 350;

interface Session {
  readonly pointerId: number;
  readonly pointerType: string;
  readonly originX: number;
  readonly originY: number;
  armed: boolean;
  started: boolean;
  longPressHandle: ReturnType<typeof setTimeout> | null;
}

@Directive({
  selector: '[afPointerDrag]',
  host: {
    '(pointerdown)': 'onPointerDown($event)',
    '(pointermove)': 'onPointerMove($event)',
    '(pointerup)': 'onPointerUp($event)',
    '(pointercancel)': 'onPointerCancel($event)',
    '(keydown.escape)': 'cancel()',
    '[class.af-pointer-drag--active]': 'dragging()',
  },
})
export class AfPointerDragDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly disabled = input(false, {
    alias: 'afPointerDragDisabled',
    transform: booleanAttribute,
  });
  readonly thresholdPx = input(DEFAULT_THRESHOLD_PX, { alias: 'afPointerDragThreshold' });
  /** Milisegundos de long-press en táctil. `0` captura de inmediato. */
  readonly longPressMs = input(DEFAULT_LONG_PRESS_MS, { alias: 'afPointerDragLongPress' });

  readonly dragStart = output<AfPointerDragEvent>();
  readonly dragMove = output<AfPointerDragEvent>();
  readonly dragEnd = output<AfPointerDragEvent>();
  readonly dragCancel = output<AfPointerDragEvent>();

  readonly dragging = signal(false);

  private session: Session | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.clearLongPress());
  }

  protected onPointerDown(event: PointerEvent): void {
    if (this.disabled() || this.session || event.button !== 0) return;

    const touch = event.pointerType === 'touch';
    this.session = {
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      originX: event.clientX,
      originY: event.clientY,
      armed: !touch || this.longPressMs() === 0,
      started: false,
      longPressHandle: null,
    };

    if (this.session.armed) {
      // Con mouse la captura es inmediata: el puntero no se va a ir a hacer
      // scroll por su cuenta.
      this.capture(event);
      return;
    }

    this.session.longPressHandle = setTimeout(() => {
      if (!this.session) return;
      this.session.armed = true;
      this.capture(event);
      this.emitStart(event);
    }, this.longPressMs());
  }

  protected onPointerMove(event: PointerEvent): void {
    const session = this.session;
    if (!session || session.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - session.originX;
    const deltaY = event.clientY - session.originY;

    if (!session.armed) {
      // El dedo se movió antes del long-press: es un scroll, no un arrastre.
      if (Math.hypot(deltaX, deltaY) >= this.thresholdPx()) this.reset();
      return;
    }

    if (!session.started) {
      if (Math.hypot(deltaX, deltaY) < this.thresholdPx()) return;
      this.emitStart(event);
    }

    event.preventDefault();
    this.dragMove.emit(this.toEvent('move', event, deltaX, deltaY));
  }

  protected onPointerUp(event: PointerEvent): void {
    const session = this.session;
    if (!session || session.pointerId !== event.pointerId) return;

    const started = session.started;
    const deltaX = event.clientX - session.originX;
    const deltaY = event.clientY - session.originY;
    this.reset();

    // Sin arrastre no hay mutación: el click del elemento sigue su curso.
    if (started) this.dragEnd.emit(this.toEvent('end', event, deltaX, deltaY));
  }

  protected onPointerCancel(event: PointerEvent): void {
    const session = this.session;
    if (!session || session.pointerId !== event.pointerId) return;
    this.cancel(event);
  }

  /** Cancela la interacción en curso y pide reversión a quien escucha. */
  cancel(event?: PointerEvent): void {
    const session = this.session;
    if (!session) return;

    const started = session.started;
    this.reset();
    if (!started) return;

    this.dragCancel.emit({
      phase: 'cancel',
      deltaX: event ? event.clientX - session.originX : 0,
      deltaY: event ? event.clientY - session.originY : 0,
      clientX: event?.clientX ?? session.originX,
      clientY: event?.clientY ?? session.originY,
      pointerType: session.pointerType,
    });
  }

  private capture(event: PointerEvent): void {
    this.clearLongPress();
    this.host.nativeElement.setPointerCapture?.(event.pointerId);
  }

  private emitStart(event: PointerEvent): void {
    if (!this.session) return;
    this.session.started = true;
    this.dragging.set(true);
    this.dragStart.emit(this.toEvent('start', event, 0, 0));
  }

  private toEvent(
    phase: AfPointerDragPhase,
    event: PointerEvent,
    deltaX: number,
    deltaY: number,
  ): AfPointerDragEvent {
    return {
      phase,
      deltaX,
      deltaY,
      clientX: event.clientX,
      clientY: event.clientY,
      pointerType: event.pointerType,
    };
  }

  private reset(): void {
    this.clearLongPress();
    const pointerId = this.session?.pointerId;
    this.session = null;
    this.dragging.set(false);
    // Liberar una captura que no se tomó lanza: puede no haberse tomado nunca
    // si el long-press se descartó antes de armarse.
    const element = this.host.nativeElement;
    if (pointerId !== undefined && element.hasPointerCapture?.(pointerId)) {
      element.releasePointerCapture(pointerId);
    }
  }

  private clearLongPress(): void {
    if (this.session?.longPressHandle) {
      clearTimeout(this.session.longPressHandle);
      this.session.longPressHandle = null;
    }
  }
}
