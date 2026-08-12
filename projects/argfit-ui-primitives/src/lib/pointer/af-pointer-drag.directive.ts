import {
  booleanAttribute,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  NgZone,
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
export type AfPointerDragCancelReason = 'escape' | 'pointercancel' | 'destroy';

export interface AfPointerDragEvent {
  readonly phase: AfPointerDragPhase;
  readonly deltaX: number;
  readonly deltaY: number;
  readonly clientX: number;
  readonly clientY: number;
  /** `'mouse' | 'touch' | 'pen'`, tal como lo informa el navegador. */
  readonly pointerType: string;
  readonly cancelReason?: AfPointerDragCancelReason;
}

/** Distancia en píxeles antes de considerar que el gesto es un arrastre. */
const DEFAULT_THRESHOLD_PX = 4;
const DEFAULT_TOUCH_THRESHOLD_PX = 10;

/** Espera antes de capturar en táctil. */
const DEFAULT_LONG_PRESS_MS = 400;

interface Session {
  readonly pointerId: number;
  readonly pointerType: string;
  readonly originX: number;
  readonly originY: number;
  armed: boolean;
  started: boolean;
  longPressHandle: ReturnType<typeof setTimeout> | null;
  latestMove: PointerEvent | null;
}

@Directive({
  selector: '[afPointerDrag]',
  host: {
    '[class.af-pointer-drag--active]': 'dragging()',
  },
})
export class AfPointerDragDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);

  readonly disabled = input(false, {
    alias: 'afPointerDragDisabled',
    transform: booleanAttribute,
  });
  readonly thresholdPx = input(DEFAULT_THRESHOLD_PX, { alias: 'afPointerDragThreshold' });
  readonly touchThresholdPx = input(DEFAULT_TOUCH_THRESHOLD_PX, {
    alias: 'afPointerDragTouchThreshold',
  });
  /** Milisegundos de long-press en táctil. `0` captura de inmediato. */
  readonly longPressMs = input(DEFAULT_LONG_PRESS_MS, { alias: 'afPointerDragLongPress' });

  readonly dragStart = output<AfPointerDragEvent>();
  readonly dragMove = output<AfPointerDragEvent>();
  readonly dragEnd = output<AfPointerDragEvent>();
  readonly dragCancel = output<AfPointerDragEvent>();

  readonly dragging = signal(false);

  private session: Session | null = null;
  private animationFrame: number | null = null;

  constructor() {
    const element = this.host.nativeElement;
    const pointerDown = (event: PointerEvent) => this.onPointerDown(event);
    const pointerMove = (event: PointerEvent) => this.onPointerMove(event);
    const pointerUp = (event: PointerEvent) => this.onPointerUp(event);
    const pointerCancel = (event: PointerEvent) => this.onPointerCancel(event);
    const keyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') this.cancel(undefined, 'escape');
    };

    // Los listeners se instalan fuera de Angular. Sólo una actualización
    // consolidada por frame vuelve a la zona, no cada pixel recibido.
    this.zone.runOutsideAngular(() => {
      // La sesión se arma en captura para que un handle hijo pueda detener la
      // propagación y elegir `resize-*` sin impedir que el contenedor conserve
      // el puntero durante todo el gesto.
      element.addEventListener('pointerdown', pointerDown, { capture: true });
      element.addEventListener('pointermove', pointerMove, { passive: false });
      element.addEventListener('pointerup', pointerUp);
      element.addEventListener('pointercancel', pointerCancel);
      element.addEventListener('keydown', keyDown);
    });

    inject(DestroyRef).onDestroy(() => {
      this.reset();
      element.removeEventListener('pointerdown', pointerDown, { capture: true });
      element.removeEventListener('pointermove', pointerMove);
      element.removeEventListener('pointerup', pointerUp);
      element.removeEventListener('pointercancel', pointerCancel);
      element.removeEventListener('keydown', keyDown);
    });
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
      latestMove: null,
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
    }, this.longPressMs());
  }

  protected onPointerMove(event: PointerEvent): void {
    const session = this.session;
    if (!session || session.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - session.originX;
    const deltaY = event.clientY - session.originY;

    if (!session.armed) {
      // El dedo se movió antes del long-press: es un scroll, no un arrastre.
      if (Math.hypot(deltaX, deltaY) >= this.touchThresholdPx()) this.reset();
      return;
    }

    const threshold =
      session.pointerType === 'touch' ? this.touchThresholdPx() : this.thresholdPx();
    if (!session.started) {
      if (Math.hypot(deltaX, deltaY) < threshold) return;
      this.emitStart(event);
    }

    event.preventDefault();
    session.latestMove = event;
    this.scheduleMove();
  }

  protected onPointerUp(event: PointerEvent): void {
    const session = this.session;
    if (!session || session.pointerId !== event.pointerId) return;

    this.flushMove();
    const started = session.started;
    const deltaX = event.clientX - session.originX;
    const deltaY = event.clientY - session.originY;
    this.reset();

    // Sin arrastre no hay mutación: el click del elemento sigue su curso.
    if (started)
      this.runInAngular(() => this.dragEnd.emit(this.toEvent('end', event, deltaX, deltaY)));
  }

  protected onPointerCancel(event: PointerEvent): void {
    const session = this.session;
    if (!session || session.pointerId !== event.pointerId) return;
    this.cancel(event, 'pointercancel');
  }

  /** Cancela la interacción en curso y pide reversión a quien escucha. */
  cancel(event?: PointerEvent, reason: AfPointerDragCancelReason = 'escape'): void {
    const session = this.session;
    if (!session) return;

    const started = session.started;
    if (started) {
      this.flushMove();
      this.emitCancel(event, reason);
    }
    this.reset();
  }

  private capture(event: PointerEvent): void {
    this.clearLongPress();
    this.host.nativeElement.setPointerCapture?.(event.pointerId);
  }

  private emitStart(event: PointerEvent): void {
    if (!this.session) return;
    this.session.started = true;
    this.runInAngular(() => {
      this.dragging.set(true);
      this.dragStart.emit(this.toEvent('start', event, 0, 0));
    });
  }

  private scheduleMove(): void {
    if (this.animationFrame !== null) return;
    const schedule =
      globalThis.requestAnimationFrame ??
      ((callback: FrameRequestCallback) =>
        globalThis.setTimeout(() => callback(performance.now()), 16) as unknown as number);
    this.animationFrame = schedule(() => {
      this.animationFrame = null;
      this.flushMove();
    });
  }

  private flushMove(): void {
    const session = this.session;
    const event = session?.latestMove;
    if (!session || !event || !session.started) return;
    session.latestMove = null;
    const deltaX = event.clientX - session.originX;
    const deltaY = event.clientY - session.originY;
    this.runInAngular(() => this.dragMove.emit(this.toEvent('move', event, deltaX, deltaY)));
  }

  private emitCancel(event: PointerEvent | undefined, reason: AfPointerDragCancelReason): void {
    const session = this.session;
    if (!session) return;
    this.runInAngular(() =>
      this.dragCancel.emit({
        phase: 'cancel',
        deltaX: event ? event.clientX - session.originX : 0,
        deltaY: event ? event.clientY - session.originY : 0,
        clientX: event?.clientX ?? session.originX,
        clientY: event?.clientY ?? session.originY,
        pointerType: session.pointerType,
        cancelReason: reason,
      }),
    );
  }

  private runInAngular(action: () => void): void {
    this.zone.run(action);
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
    if (this.animationFrame !== null) {
      const cancel = globalThis.cancelAnimationFrame ?? globalThis.clearTimeout;
      cancel(this.animationFrame);
      this.animationFrame = null;
    }
    const pointerId = this.session?.pointerId;
    this.session = null;
    this.runInAngular(() => this.dragging.set(false));
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
