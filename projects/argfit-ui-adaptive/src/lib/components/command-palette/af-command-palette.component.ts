import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  PLATFORM_ID,
  signal,
} from '@angular/core';

import {
  AfPlatformService,
  type AfCommandPaletteItem,
  type AfCommandPaletteItemTemplate,
  type AfCommandPaletteSearchMode,
} from '@argfit-ui/core';
import {
  AfCommandPaletteDesktopComponent,
  type AfCommandPaletteNavigationIntent,
} from '@argfit-ui/desktop';
import { AfCommandPaletteMobileComponent } from '@argfit-ui/mobile';

import { AfCommandPaletteItemDirective } from './af-command-palette-item.directive';

interface AfCommandPaletteGroup {
  readonly id: string;
  readonly label?: string;
  readonly items: readonly AfCommandPaletteItem[];
}

@Component({
  selector: 'af-command-palette',
  imports: [AfCommandPaletteDesktopComponent, AfCommandPaletteMobileComponent],
  templateUrl: './af-command-palette.component.html',
  styleUrl: './af-command-palette.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfCommandPaletteComponent {
  private readonly platform = inject(AfPlatformService);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);
  private readonly itemTemplateDirective = contentChild(AfCommandPaletteItemDirective);
  private wasOpen = false;

  readonly open = input(false, { transform: booleanAttribute });
  readonly query = input('');
  readonly items = input<readonly AfCommandPaletteItem[]>([]);
  readonly searchMode = input<AfCommandPaletteSearchMode>('client');
  readonly placeholder = input('Buscar aplicaciones, acciones...');
  readonly emptyText = input('No se encontraron resultados');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly loadingText = input('Buscando...');
  readonly errorText = input<string | undefined>(undefined);
  readonly showTrigger = input(true, { transform: booleanAttribute });
  readonly shortcutEnabled = input(true, { transform: booleanAttribute });
  readonly shortcutLabel = input('Ctrl+K');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input('Paleta de comandos');
  readonly closeLabel = input('Cerrar paleta');

  readonly openChange = output<boolean>();
  readonly queryChange = output<string>();
  readonly itemSelected = output<AfCommandPaletteItem>();

  protected readonly isMobile = this.platform.isMobile;
  protected readonly currentOpen = signal(false);
  protected readonly currentQuery = signal('');
  protected readonly activeId = signal<string | null>(null);
  protected readonly focusRequest = signal(0);
  protected readonly itemTemplate = computed<AfCommandPaletteItemTemplate | undefined>(
    () => this.itemTemplateDirective()?.templateRef,
  );
  protected readonly filteredItems = computed<readonly AfCommandPaletteItem[]>(() => {
    const items = this.items();
    if (this.searchMode() === 'server') {
      return items;
    }

    const query = this.normalizeSearchText(this.currentQuery());
    if (!query) {
      return items;
    }

    return items.filter((item) =>
      this.normalizeSearchText(
        [item.label, item.description, item.group, ...(item.keywords ?? [])]
          .filter((value): value is string => Boolean(value))
          .join(' '),
      ).includes(query),
    );
  });
  protected readonly groups = computed<readonly AfCommandPaletteGroup[]>(() => {
    const groups = new Map<string, { id: string; label?: string; items: AfCommandPaletteItem[] }>();

    for (const item of this.filteredItems()) {
      const key = item.group ?? '';
      let group = groups.get(key);
      if (!group) {
        group = { id: `group-${groups.size}`, label: item.group, items: [] };
        groups.set(key, group);
      }
      group.items.push(item);
    }

    return [...groups.values()];
  });
  private readonly visibleItems = computed(() => this.groups().flatMap((group) => group.items));

  constructor() {
    effect(() => this.currentOpen.set(this.open()));
    effect(() => this.currentQuery.set(this.query()));

    effect(() => {
      const open = this.currentOpen();
      const visibleItems = this.visibleItems();

      if (open) {
        const active = this.activeId();
        const activeStillAvailable = visibleItems.some(
          (item) => item.id === active && !item.disabled,
        );
        if (!activeStillAvailable) {
          this.activeId.set(visibleItems.find((item) => !item.disabled)?.id ?? null);
        }
      } else if (this.wasOpen) {
        this.activeId.set(null);
        this.setQuery('');
      }

      this.wasOpen = open;
    });

    if (this.isBrowser) {
      const listener = (event: KeyboardEvent) => this.onDocumentKeydown(event);
      this.document.addEventListener('keydown', listener);
      this.destroyRef.onDestroy(() => this.document.removeEventListener('keydown', listener));
    }
  }

  protected onOpenChange(open: boolean): void {
    if (open) {
      this.requestOpen();
    } else {
      this.requestClose();
    }
  }

  protected onQueryInput(query: string): void {
    this.setQuery(query);
    this.activeId.set(this.visibleItems().find((item) => !item.disabled)?.id ?? null);
  }

  protected onNavigation(intent: AfCommandPaletteNavigationIntent): void {
    const enabledItems = this.visibleItems().filter((item) => !item.disabled);
    if (enabledItems.length === 0) {
      this.activeId.set(null);
      return;
    }

    if (intent === 'first' || intent === 'last') {
      this.activeId.set(intent === 'first' ? enabledItems[0]!.id : enabledItems.at(-1)!.id);
      return;
    }

    const currentIndex = enabledItems.findIndex((item) => item.id === this.activeId());
    const direction = intent === 'next' ? 1 : -1;
    const fallbackIndex = direction > 0 ? -1 : 0;
    const nextIndex = (Math.max(currentIndex, fallbackIndex) + direction + enabledItems.length)
      % enabledItems.length;
    this.activeId.set(enabledItems[nextIndex]!.id);
  }

  protected onActiveChange(id: string): void {
    const item = this.visibleItems().find((candidate) => candidate.id === id);
    if (item && !item.disabled) {
      this.activeId.set(id);
    }
  }

  protected onItemActivated(id: string): void {
    const item = this.visibleItems().find((candidate) => candidate.id === id);
    if (!item || item.disabled) {
      return;
    }

    this.itemSelected.emit(item);
    this.requestClose();
  }

  private requestOpen(): void {
    if (this.disabled()) {
      return;
    }

    if (!this.currentOpen()) {
      this.currentOpen.set(true);
      this.openChange.emit(true);
    }
    this.activeId.set(this.visibleItems().find((item) => !item.disabled)?.id ?? null);
    this.focusRequest.update((value) => value + 1);
  }

  private requestClose(): void {
    if (this.currentOpen()) {
      this.currentOpen.set(false);
      this.openChange.emit(false);
    }
    this.activeId.set(null);
    this.setQuery('');
  }

  private onDocumentKeydown(event: KeyboardEvent): void {
    if (
      event.defaultPrevented
      || this.disabled()
      || !this.shortcutEnabled()
      || event.key.toLocaleLowerCase() !== 'k'
      || (!event.ctrlKey && !event.metaKey)
      || event.altKey
      || event.shiftKey
    ) {
      return;
    }

    event.preventDefault();
    this.requestOpen();
  }

  private normalizeSearchText(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase()
      .trim();
  }

  private setQuery(query: string): void {
    if (query === this.currentQuery()) {
      return;
    }
    this.currentQuery.set(query);
    this.queryChange.emit(query);
  }
}
