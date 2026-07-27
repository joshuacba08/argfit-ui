import { NgTemplateOutlet } from '@angular/common';
import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    input,
    output,
    ViewEncapsulation,
} from '@angular/core';

import type { AfNavigationItem } from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

import { AfBadgeDesktopComponent } from '../badge/af-badge-desktop.component';

@Component({
  selector: 'af-sidebar-desktop',
  imports: [AfBadgeDesktopComponent, AfIconComponent, NgTemplateOutlet],
  templateUrl: './af-sidebar-desktop.component.html',
  styleUrl: './af-sidebar-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-sidebar-desktop',
    '[class.af-sidebar-desktop--collapsed]': 'collapsed()',
  },
})
export class AfSidebarDesktopComponent {
  readonly navItems = input<readonly AfNavigationItem[]>([]);
  readonly activeItem = input<string | undefined>(undefined);
  readonly collapsed = input(false, { transform: booleanAttribute });
  readonly collapsible = input(true, { transform: booleanAttribute });
  readonly ariaLabel = input('Navegacion principal');

  readonly navItemSelected = output<AfNavigationItem>();
  readonly collapsedChange = output<boolean>();

  protected isActive(item: AfNavigationItem): boolean {
    return item.id === this.activeItem();
  }

  protected itemAriaLabel(item: AfNavigationItem): string | null {
    if (this.collapsed()) {
      return item.ariaLabel ?? item.label;
    }
    return item.ariaLabel ?? null;
  }

  /**
   * Identificador del texto que explica por qué el elemento está bloqueado.
   *
   * Devuelve `null` cuando no hay motivo, de modo que `aria-describedby` no apunte a un
   * nodo inexistente — un descriptor roto es peor que ninguno.
   */
  protected disabledReasonId(item: AfNavigationItem): string | null {
    return item.disabled && item.disabledReason ? `af-nav-reason-${item.id}` : null;
  }

  protected onItemClick(event: Event, item: AfNavigationItem): void {
    if (item.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.navItemSelected.emit(item);
  }

  protected toggleCollapsed(): void {
    this.collapsedChange.emit(!this.collapsed());
  }
}
