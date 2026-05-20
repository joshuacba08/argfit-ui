import { NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    input,
    output,
    ViewEncapsulation,
} from '@angular/core';

import type { AfNavigationItem } from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

import { AfBadgeMobileComponent } from '../badge/af-badge-mobile.component';

@Component({
  selector: 'af-bottom-tabs-mobile',
  imports: [AfBadgeMobileComponent, AfIconComponent, NgTemplateOutlet],
  templateUrl: './af-bottom-tabs-mobile.component.html',
  styleUrl: './af-bottom-tabs-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'af-bottom-tabs-mobile' },
})
export class AfBottomTabsMobileComponent {
  readonly tabs = input<readonly AfNavigationItem[]>([]);
  readonly activeTab = input<string | undefined>(undefined);
  readonly ariaLabel = input('Navegacion inferior');

  readonly tabSelected = output<AfNavigationItem>();

  protected isActive(tab: AfNavigationItem): boolean {
    return tab.id === this.activeTab();
  }

  protected onTabClick(event: Event, tab: AfNavigationItem): void {
    if (tab.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.tabSelected.emit(tab);
  }
}
