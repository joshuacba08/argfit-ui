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
    type AfAccordionChange,
    type AfAccordionDensity,
    type AfAccordionExpandedIds,
    type AfAccordionItem,
    type AfAccordionPanelDefinition,
} from '@argfit-ui/core';
import { AfAccordionDesktopComponent } from '@argfit-ui/desktop';
import { AfAccordionMobileComponent } from '@argfit-ui/mobile';

import { AfAccordionPanelDirective } from './af-accordion-panel.directive';

@Component({
  selector: 'af-accordion',
  imports: [AfAccordionDesktopComponent, AfAccordionMobileComponent],
  templateUrl: './af-accordion.component.html',
  styleUrl: './af-accordion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfAccordionComponent {
  private readonly platform = inject(AfPlatformService);
  private readonly panelDirectives = contentChildren(AfAccordionPanelDirective);

  readonly items = input<readonly AfAccordionItem[]>([]);
  readonly expandedIds = input<AfAccordionExpandedIds>([]);
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly density = input<AfAccordionDensity>('comfortable');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input('Accordion');

  readonly expandedChange = output<AfAccordionExpandedIds>();
  readonly itemToggle = output<AfAccordionChange>();

  protected readonly isMobile = this.platform.isMobile;
  protected readonly panelTemplates = computed<readonly AfAccordionPanelDefinition[]>(() =>
    this.panelDirectives().map((panelDirective) => ({
      id: panelDirective.itemId(),
      templateRef: panelDirective.templateRef,
    })),
  );
}
