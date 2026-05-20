import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    output,
    ViewEncapsulation,
} from '@angular/core';

import type {
    AfNavigationItem,
    AfPageShellDensity,
    AfPageShellVariant,
} from '@argfit-ui/core';

import { AfBottomTabsMobileComponent } from '../bottom-tabs/af-bottom-tabs-mobile.component';

@Component({
  selector: 'af-page-shell-mobile',
  imports: [AfBottomTabsMobileComponent],
  templateUrl: './af-page-shell-mobile.component.html',
  styleUrl: './af-page-shell-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-page-shell-mobile',
    '[attr.data-density]': 'density()',
    '[attr.data-variant]': 'variant()',
  },
})
export class AfPageShellMobileComponent {
  readonly title = input('');
  readonly subtitle = input<string | undefined>(undefined);
  readonly navItems = input<readonly AfNavigationItem[]>([]);
  readonly mobileTabs = input<readonly AfNavigationItem[]>([]);
  readonly activeItem = input<string | undefined>(undefined);
  readonly activeTab = input<string | undefined>(undefined);
  readonly density = input<AfPageShellDensity>('comfortable');
  readonly variant = input<AfPageShellVariant>('dashboard');
  readonly ariaLabel = input('Navegacion inferior');

  readonly tabSelected = output<AfNavigationItem>();

  protected readonly resolvedTabs = computed<readonly AfNavigationItem[]>(() => {
    const tabs = this.mobileTabs();
    return tabs.length > 0 ? tabs : this.navItems();
  });

  protected readonly resolvedActiveTab = computed<string | undefined>(
    () => this.activeTab() ?? this.activeItem(),
  );
}
