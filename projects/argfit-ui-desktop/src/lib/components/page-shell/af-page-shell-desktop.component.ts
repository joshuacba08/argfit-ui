import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    input,
    output,
    ViewEncapsulation,
} from '@angular/core';

import type {
    AfBreadcrumbItem,
    AfNavigationItem,
    AfPageShellDensity,
    AfPageShellVariant,
} from '@argfit-ui/core';

import { AfSidebarDesktopComponent } from '../sidebar/af-sidebar-desktop.component';
import { AfTopbarDesktopComponent } from '../topbar/af-topbar-desktop.component';

@Component({
  selector: 'af-page-shell-desktop',
  imports: [AfSidebarDesktopComponent, AfTopbarDesktopComponent],
  templateUrl: './af-page-shell-desktop.component.html',
  styleUrl: './af-page-shell-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-page-shell-desktop',
    '[attr.data-density]': 'density()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-collapsed]': 'collapsed() ? "" : null',
  },
})
export class AfPageShellDesktopComponent {
  readonly title = input('');
  readonly subtitle = input<string | undefined>(undefined);
  readonly navItems = input<readonly AfNavigationItem[]>([]);
  readonly breadcrumbs = input<readonly AfBreadcrumbItem[]>([]);
  readonly activeItem = input<string | undefined>(undefined);
  readonly density = input<AfPageShellDensity>('comfortable');
  readonly variant = input<AfPageShellVariant>('dashboard');
  readonly collapsible = input(true, { transform: booleanAttribute });
  readonly collapsed = input(false, { transform: booleanAttribute });
  readonly showSearch = input(false, { transform: booleanAttribute });
  readonly searchPlaceholder = input('Buscar...');
  readonly notificationCount = input<number | undefined>(undefined);
  readonly userInitials = input<string | undefined>(undefined);
  readonly ariaLabel = input('Navegacion principal');

  readonly navItemSelected = output<AfNavigationItem>();
  readonly breadcrumbSelected = output<AfBreadcrumbItem>();
  readonly collapsedChange = output<boolean>();
  readonly searchChanged = output<string>();
}
