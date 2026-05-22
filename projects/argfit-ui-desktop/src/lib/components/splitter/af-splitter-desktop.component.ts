import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  numberAttribute,
  output,
  signal,
  TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import { AfThemeService, type AfSplitterOrientation } from '@argfit-ui/core';

@Component({
  selector: 'af-splitter-desktop',
  imports: [NgTemplateOutlet],
  templateUrl: './af-splitter-desktop.component.html',
  styleUrl: './af-splitter-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-splitter-desktop',
    '[class]': 'hostClasses()',
    '[attr.role]': '"region"',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class AfSplitterDesktopComponent {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private removeDragListeners: (() => void) | null = null;

  readonly container = viewChild<ElementRef<HTMLElement>>('container');
  readonly primaryLabel = input<string | undefined>(undefined);
  readonly secondaryLabel = input<string | undefined>(undefined);
  readonly orientation = input<AfSplitterOrientation>('horizontal');
  readonly primarySize = input(50, { transform: numberAttribute });
  readonly minPrimarySize = input(25, { transform: numberAttribute });
  readonly minSecondarySize = input(25, { transform: numberAttribute });
  readonly ariaLabel = input('Splitter');
  readonly primaryTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly secondaryTemplate = input<TemplateRef<unknown> | undefined>(undefined);

  readonly primarySizeChange = output<number>();

  private readonly draggedPrimarySize = signal<number | null>(null);
  protected readonly hostClasses = computed(() =>
    ['af-splitter-desktop', `af-splitter-desktop--${this.orientation()}`].join(' '),
  );
  protected readonly resolvedPrimarySize = computed(() =>
    clampPrimarySize(
      this.draggedPrimarySize() ?? this.primarySize(),
      this.minPrimarySize(),
      this.minSecondarySize(),
    ),
  );

  constructor() {
    inject(AfThemeService);
    this.destroyRef.onDestroy(() => this.clearDragListeners());
  }

  protected onDividerPointerdown(event: PointerEvent): void {
    const container = this.container()?.nativeElement;
    const windowRef = this.document.defaultView;
    if (!container || !windowRef || !event.isPrimary) {
      return;
    }

    event.preventDefault();
    const containerSize = this.orientation() === 'horizontal' ? container.clientWidth : container.clientHeight;
    if (containerSize <= 0) {
      return;
    }

    const startPosition = this.orientation() === 'horizontal' ? event.clientX : event.clientY;
    const startPrimarySize = this.resolvedPrimarySize();

    const handlePointerMove = (moveEvent: PointerEvent): void => {
      const currentPosition = this.orientation() === 'horizontal' ? moveEvent.clientX : moveEvent.clientY;
      const delta = currentPosition - startPosition;
      const nextPrimarySize = startPrimarySize + (delta / containerSize) * 100;
      this.draggedPrimarySize.set(clampPrimarySize(nextPrimarySize, this.minPrimarySize(), this.minSecondarySize()));
    };

    const handlePointerEnd = (): void => {
      this.primarySizeChange.emit(this.resolvedPrimarySize());
      this.clearDragListeners();
    };

    this.clearDragListeners();
    windowRef.addEventListener('pointermove', handlePointerMove);
    windowRef.addEventListener('pointerup', handlePointerEnd, { once: true });
    windowRef.addEventListener('pointercancel', handlePointerEnd, { once: true });
    this.removeDragListeners = () => {
      windowRef.removeEventListener('pointermove', handlePointerMove);
      windowRef.removeEventListener('pointerup', handlePointerEnd);
      windowRef.removeEventListener('pointercancel', handlePointerEnd);
    };
  }

  protected onDividerKeydown(event: KeyboardEvent): void {
    const orientation = this.orientation();
    const currentSize = this.resolvedPrimarySize();
    const delta = orientation === 'horizontal'
      ? event.key === 'ArrowRight'
        ? 5
        : event.key === 'ArrowLeft'
          ? -5
          : 0
      : event.key === 'ArrowDown'
        ? 5
        : event.key === 'ArrowUp'
          ? -5
          : 0;

    let nextSize = currentSize;

    if (event.key === 'Home') {
      nextSize = clampPrimarySize(this.minPrimarySize(), this.minPrimarySize(), this.minSecondarySize());
    } else if (event.key === 'End') {
      nextSize = clampPrimarySize(100 - this.minSecondarySize(), this.minPrimarySize(), this.minSecondarySize());
    } else if (delta !== 0) {
      nextSize = clampPrimarySize(currentSize + delta, this.minPrimarySize(), this.minSecondarySize());
    } else {
      return;
    }

    event.preventDefault();
    this.draggedPrimarySize.set(nextSize);
    this.primarySizeChange.emit(nextSize);
  }

  private clearDragListeners(): void {
    this.removeDragListeners?.();
    this.removeDragListeners = null;
  }
}

function clampPrimarySize(value: number, minPrimarySize: number, minSecondarySize: number): number {
  const minimum = Math.max(0, minPrimarySize);
  const maximum = Math.max(minimum, 100 - Math.max(0, minSecondarySize));

  return Math.min(Math.max(value, minimum), maximum);
}