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

let nextAfChartCardDesktopId = 0;

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
 * Contenedor de gráfico para pantallas de escritorio.
 *
 * Es puramente de presentación: dibuja el encabezado, el menú y el marco, y emite la
 * acción elegida. Exportar, restablecer o entrar en pantalla completa son decisiones de
 * la fachada adaptativa, que es quien conoce el gráfico proyectado.
 */
@Component({
  selector: 'af-chart-card-desktop',
  imports: [AfIconComponent],
  templateUrl: './af-chart-card-desktop.component.html',
  styleUrl: './af-chart-card-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-chart-card-desktop',
    role: 'group',
    '[attr.data-fullscreen]': 'fullscreen() ? "" : null',
    '[attr.aria-labelledby]': 'heading() ? headingId : null',
    '[attr.aria-describedby]': 'note() ? noteId : null',
  },
})
export class AfChartCardDesktopComponent {
  private readonly instanceId = ++nextAfChartCardDesktopId;

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

  protected readonly menuId = `af-chart-card-desktop-${this.instanceId}-menu`;
  protected readonly headingId = `af-chart-card-desktop-${this.instanceId}-heading`;
  protected readonly noteId = `af-chart-card-desktop-${this.instanceId}-note`;

  protected readonly triggerRef = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  private readonly menuRef = viewChild<ElementRef<HTMLElement>>('menu');

  /** El encabezado sólo se dibuja si hay algo que poner en él. */
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

  /**
   * Teclado del menú, según el patrón `menu` de WAI-ARIA.
   *
   * Escape y Tab devuelven el foco al disparador: si el menú se cierra dejando el foco
   * en un elemento que ya no existe, el recorrido por teclado vuelve al principio del
   * documento.
   */
  protected onMenuKeydown(event: KeyboardEvent): void {
    const items = this.menuButtons();
    const currentIndex = items.indexOf(event.target as HTMLButtonElement);

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.closeAndRefocus();
        return;
      case 'Tab':
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

  protected onTriggerKeydown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
      return;
    }
    event.preventDefault();
    if (!this.menuOpen()) {
      this.menuOpenChange.emit(true);
      return;
    }
    const items = this.menuButtons();
    (event.key === 'ArrowDown' ? items[0] : items[items.length - 1])?.focus();
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
