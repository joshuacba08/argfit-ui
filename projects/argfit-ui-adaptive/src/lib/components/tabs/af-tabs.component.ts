import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChildren,
    inject,
    input,
    output,
} from '@angular/core';

import {
    AfPlatformService,
    type AfTabChange,
    type AfTabItem,
    type AfTabPanelDefinition,
    type AfTabsDensity,
} from '@argfit-ui/core';
import { AfTabsDesktopComponent } from '@argfit-ui/desktop';
import { AfTabsMobileComponent } from '@argfit-ui/mobile';

import { AfTabPanelDirective } from './af-tab-panel.directive';

@Component({
  selector: 'af-tabs',
  imports: [AfTabsDesktopComponent, AfTabsMobileComponent],
  templateUrl: './af-tabs.component.html',
  styleUrl: './af-tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfTabsComponent {
  private readonly platform = inject(AfPlatformService);
  private readonly panelDirectives = contentChildren(AfTabPanelDirective);

  readonly items = input<readonly AfTabItem[]>([]);
  readonly activeId = input<string | undefined>(undefined);
  readonly density = input<AfTabsDensity>('comfortable');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input('Tabs');

  readonly activeIdChange = output<string>();
  readonly tabChange = output<AfTabChange>();

  protected readonly isMobile = this.platform.isMobile;
  protected readonly panelTemplates = computed<readonly AfTabPanelDefinition[]>(() =>
    this.panelDirectives().map((panelDirective) => ({
      id: panelDirective.tabId(),
      templateRef: panelDirective.templateRef,
    })),
  );
}
