import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';

import {
  AfPlatformService,
  type AfBreadcrumbItem,
  type AfNavigationItem,
  type AfPageShellDensity,
  type AfPageShellVariant,
} from '@argfit-ui/core';
import { AfPageShellDesktopComponent } from '@argfit-ui/desktop';
import { AfPageShellMobileComponent } from '@argfit-ui/mobile';

@Component({
  selector: 'af-page-shell',
  imports: [AfPageShellDesktopComponent, AfPageShellMobileComponent, NgTemplateOutlet],
  templateUrl: './af-page-shell.component.html',
  styleUrl: './af-page-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfPageShellComponent {
  private readonly platform = inject(AfPlatformService);

  readonly title = input('');
  readonly subtitle = input<string | undefined>(undefined);
  readonly navItems = input<readonly AfNavigationItem[]>([]);
  readonly mobileTabs = input<readonly AfNavigationItem[]>([]);
  readonly breadcrumbs = input<readonly AfBreadcrumbItem[]>([]);
  readonly activeItem = input<string | undefined>(undefined);
  readonly activeTab = input<string | undefined>(undefined);
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
  readonly tabSelected = output<AfNavigationItem>();
  readonly breadcrumbSelected = output<AfBreadcrumbItem>();
  readonly collapsedChange = output<boolean>();
  readonly searchChanged = output<string>();

  protected readonly isMobile = this.platform.isMobile;
}