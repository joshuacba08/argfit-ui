import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  output,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import type { AfChartCardAction, AfChartCardMenuItem, AfIconName } from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

let nextAfChartCardMobileId = 0;

/** Icono asociado a cada acción del menú. */
const ACTION_ICON: Record<AfChartCardAction, AfIconName> = {
  'pop-out': 'external-link',
  fullscreen: 'maximize',
  'download-image': 'image',
  'download-csv': 'download',
  'toggle-table': 'table',
  reset: 'refresh-cw',
};

/**
 * Contenedor de gráfico para pantallas táctiles.
 *
 * Comparte el contrato con el renderer de escritorio y cambia sólo la presentación del
 * menú: una hoja anclada al borde inferior, donde el pulgar alcanza, en vez de un panel
 * colgando de un disparador de 28 px.
 */
@Component({
  selector: 'af-chart-card-mobile',
  imports: [AfIconComponent],
  templateUrl: './af-chart-card-mobile.component.html',
  styleUrl: './af-chart-card-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-chart-card-mobile',
    role: 'group',
    '[attr.data-fullscreen]': 'fullscreen() ? "" : null',
    '[attr.aria-labelledby]': 'heading() ? headingId : null',
    '[attr.aria-describedby]': 'note() ? noteId : null',
  },
})
export class AfChartCardMobileComponent {
  private readonly instanceId = ++nextAfChartCardMobileId;

  readonly heading = input<string | undefined>(undefined);
  /** Etiqueta breve del tipo de visualización, p. ej. «Combo · barras + línea». */
  readonly tag = input<string | undefined>(undefined);
  /** Nota metodológica bajo el título: qué se mide y cómo leerlo. */
  readonly note = input<string | undefined>(undefined);
  readonly menuItems = input<readonly AfChartCardMenuItem[]>([]);
  readonly menuLabel = input('Opciones del gráfico');
  readonly menuHeading = input('Opciones del gráfico');
  readonly menuOpen = input(false, { transform: booleanAttribute });
  readonly fullscreen = input(false, { transform: booleanAttribute });

  readonly menuOpenChange = output<boolean>();
  readonly actionSelect = output<AfChartCardAction>();

  protected readonly menuId = `af-chart-card-mobile-${this.instanceId}-menu`;
  protected readonly headingId = `af-chart-card-mobile-${this.instanceId}-heading`;
  protected readonly noteId = `af-chart-card-mobile-${this.instanceId}-note`;

  protected readonly triggerRef = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  private readonly menuRef = viewChild<ElementRef<HTMLElement>>('menu');

  protected readonly hasHeader = computed(
    () => Boolean(this.heading() ?? this.tag()) || this.menuItems().length > 0,
  );

  protected iconFor(action: AfChartCardAction): AfIconName {
    return ACTION_ICON[action];
  }

  protected toggleMenu(): void {
    this.menuOpenChange.emit(!this.menuOpen());
  }

  protected select(action: AfChartCardAction): void {
    this.actionSelect.emit(action);
  }

  protected onBackdropClick(): void {
    this.closeAndRefocus();
  }

  protected onMenuKeydown(event: KeyboardEvent): void {
    const items = this.menuButtons();
    const currentIndex = items.indexOf(event.target as HTMLButtonElement);

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.closeAndRefocus();
        return;
      case 'ArrowDown':
        event.preventDefault();
        items[(currentIndex + 1) % items.length]?.focus();
        return;
      case 'ArrowUp':
        event.preventDefault();
        items[(currentIndex - 1 + items.length) % items.length]?.focus();
        return;
      case 'Home':
        event.preventDefault();
        items[0]?.focus();
        return;
      case 'End':
        event.preventDefault();
        items[items.length - 1]?.focus();
        return;
      default:
        return;
    }
  }

  /** Enfoca la primera entrada. La llama la fachada al abrir el menú. */
  focusFirstItem(): void {
    this.menuButtons()[0]?.focus();
  }

  /** Devuelve el foco al disparador. La llama la fachada al cerrar el menú. */
  focusTrigger(): void {
    this.triggerRef()?.nativeElement.focus();
  }

  private closeAndRefocus(): void {
    this.menuOpenChange.emit(false);
    this.focusTrigger();
  }

  private menuButtons(): HTMLButtonElement[] {
    const menu = this.menuRef()?.nativeElement;
    return menu ? Array.from(menu.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')) : [];
  }
}
