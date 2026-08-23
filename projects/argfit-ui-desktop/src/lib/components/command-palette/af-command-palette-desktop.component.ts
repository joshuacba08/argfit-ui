import { DOCUMENT, isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  PLATFORM_ID,
  viewChild,
  ViewEncapsulation,
  type OnDestroy,
} from '@angular/core';

import type {
  AfCommandModeDefinition,
  AfCommandPaletteEntityContext,
  AfCommandPaletteEntityTemplate,
  AfCommandPaletteBreadcrumb,
  AfCommandPaletteProviderError,
  AfCommandPaletteResult,
  AfCommandPaletteResultContext,
  AfCommandPaletteResultTemplate,
} from '@argfit-ui/core';
import {
  AfEscapeKeyDirective,
  AfFocusInitialDirective,
  AfFocusTrapDirective,
  AfIconComponent,
} from '@argfit-ui/primitives';

import { AfAvatarDesktopComponent } from '../avatar/af-avatar-desktop.component';

export type AfCommandPaletteNavigationIntent = 'next' | 'previous' | 'first' | 'last';

export interface AfCommandPaletteRenderGroup {
  readonly id: string;
  readonly label?: string;
  readonly items: readonly AfCommandPaletteResult[];
}

let nextAfCommandPaletteDesktopId = 0;

@Component({
  selector: 'af-command-palette-desktop',
  imports: [
    AfEscapeKeyDirective,
    AfFocusInitialDirective,
    AfFocusTrapDirective,
    AfIconComponent,
    AfAvatarDesktopComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './af-command-palette-desktop.component.html',
  styleUrl: './af-command-palette-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-command-palette-desktop',
    '[attr.data-open]': 'open() ? "" : null',
  },
})
export class AfCommandPaletteDesktopComponent implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  private readonly instanceId = ++nextAfCommandPaletteDesktopId;
  private focusTimer: ReturnType<typeof setTimeout> | null = null;
  private previousBodyOverflow: string | null = null;
  private wasOpen = false;

  readonly open = input(false, { transform: booleanAttribute });
  readonly query = input('');
  readonly groups = input<readonly AfCommandPaletteRenderGroup[]>([]);
  readonly activeId = input<string | null>(null);
  readonly placeholder = input('Buscar aplicaciones, acciones...');
  readonly emptyText = input('No se encontraron resultados');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly loadingText = input('Buscando...');
  readonly errorText = input<string | undefined>(undefined);
  readonly showTrigger = input(true, { transform: booleanAttribute });
  readonly shortcutLabel = input('Ctrl+K');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input('Paleta de comandos');
  readonly closeLabel = input('Cerrar paleta');
  readonly backLabel = input('Volver');
  readonly retryLabel = input('Reintentar');
  readonly modes = input<readonly AfCommandModeDefinition[]>([]);
  readonly modeId = input('all');
  readonly breadcrumbs = input<readonly AfCommandPaletteBreadcrumb[]>([]);
  readonly canGoBack = input(false, { transform: booleanAttribute });
  readonly providerErrors = input<readonly AfCommandPaletteProviderError[]>([]);
  readonly validationText = input<string | undefined>(undefined);
  readonly focusRequest = input(0);
  readonly resultTemplate = input<AfCommandPaletteResultTemplate | undefined>(undefined);
  readonly entityTemplate = input<AfCommandPaletteEntityTemplate | undefined>(undefined);

  readonly openChange = output<boolean>();
  readonly queryInput = output<string>();
  readonly navigation = output<AfCommandPaletteNavigationIntent>();
  readonly activeChange = output<string>();
  readonly resultActivated = output<string>();
  readonly modeChange = output<string>();
  readonly modeReset = output<void>();
  readonly back = output<void>();
  readonly retryProvider = output<string>();

  protected readonly listboxId = `af-command-palette-desktop-${this.instanceId}-listbox`;
  protected readonly statusId = `af-command-palette-desktop-${this.instanceId}-status`;
  protected readonly flatItems = computed(() => this.groups().flatMap((group) => group.items));
  protected readonly hasItems = computed(() => this.flatItems().length > 0);
  protected readonly activeOptionId = computed(() => {
    const activeIndex = this.flatItems().findIndex((item) => item.id === this.activeId());
    return activeIndex >= 0 ? this.optionId(activeIndex) : null;
  });

  constructor() {
    effect(() => {
      const open = this.open();
      this.focusRequest();

      if (!this.isBrowser || !open) {
        return;
      }

      if (this.focusTimer) {
        clearTimeout(this.focusTimer);
      }
      this.focusTimer = setTimeout(() => this.searchInput()?.nativeElement.focus());
    });

    effect(() => {
      const open = this.open();
      if (!this.isBrowser || open === this.wasOpen) {
        return;
      }

      this.wasOpen = open;
      if (open) {
        this.lockBodyScroll();
      } else {
        this.unlockBodyScroll();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.focusTimer) {
      clearTimeout(this.focusTimer);
    }
    this.unlockBodyScroll();
  }

  protected requestOpen(): void {
    if (!this.disabled()) {
      this.openChange.emit(true);
    }
  }

  protected requestClose(): void {
    this.openChange.emit(false);
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.requestClose();
    }
  }

  protected onQueryInput(event: Event): void {
    this.queryInput.emit((event.target as HTMLInputElement).value);
  }

  protected onInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.query()) {
      this.modeReset.emit();
    }
    const intent = this.navigationIntent(event.key);
    if (intent) {
      event.preventDefault();
      this.navigation.emit(intent);
      return;
    }

    if (event.key === 'Enter' && this.activeId()) {
      event.preventDefault();
      this.resultActivated.emit(this.activeId()!);
    }
  }

  protected onOptionPointerDown(event: PointerEvent): void {
    event.preventDefault();
  }

  protected onOptionPointerMove(item: AfCommandPaletteResult): void {
    if (!item.disabled && item.id !== this.activeId()) {
      this.activeChange.emit(item.id);
    }
  }

  protected onOptionClick(item: AfCommandPaletteResult): void {
    if (!item.disabled) {
      this.resultActivated.emit(item.id);
    }
  }

  protected optionId(index: number): string {
    return `${this.listboxId}-option-${index}`;
  }

  protected groupLabelId(group: AfCommandPaletteRenderGroup): string {
    return `${this.listboxId}-group-${group.id}`;
  }

  protected itemIndex(groupIndex: number, index: number): number {
    return this.groups()
      .slice(0, groupIndex)
      .reduce((total, group) => total + group.items.length, index);
  }

  protected resultContext(
    item: AfCommandPaletteResult,
    itemIndex: number,
  ): AfCommandPaletteResultContext {
    return {
      $implicit: item,
      result: item,
      resultIndex: itemIndex,
      active: item.id === this.activeId(),
      query: this.query(),
      modeId: this.modeId(),
      collection: item.collection,
      entity: item.entity,
    };
  }

  protected entityContext(
    item: AfCommandPaletteResult,
    itemIndex: number,
  ): AfCommandPaletteEntityContext {
    return {
      $implicit: item.entity!,
      entity: item.entity!,
      collection: item.collection!,
      result: item,
      resultIndex: itemIndex,
      active: item.id === this.activeId(),
      query: this.query(),
    };
  }

  protected requestBack(): void {
    this.back.emit();
  }

  private navigationIntent(key: string): AfCommandPaletteNavigationIntent | null {
    switch (key) {
      case 'ArrowDown':
        return 'next';
      case 'ArrowUp':
        return 'previous';
      case 'Home':
        return 'first';
      case 'End':
        return 'last';
      default:
        return null;
    }
  }

  private lockBodyScroll(): void {
    const body = this.document.body;
    this.previousBodyOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
  }

  private unlockBodyScroll(): void {
    if (!this.isBrowser || this.previousBodyOverflow === null) {
      return;
    }
    this.document.body.style.overflow = this.previousBodyOverflow;
    this.previousBodyOverflow = null;
    this.wasOpen = false;
  }
}
