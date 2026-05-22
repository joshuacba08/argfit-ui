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
    type AfStepChange,
    type AfStepItem,
    type AfStepPanelDefinition,
    type AfStepperDensity,
} from '@argfit-ui/core';
import { AfStepperDesktopComponent } from '@argfit-ui/desktop';
import { AfStepperMobileComponent } from '@argfit-ui/mobile';

import { AfStepPanelDirective } from './af-step-panel.directive';

@Component({
  selector: 'af-stepper',
  imports: [AfStepperDesktopComponent, AfStepperMobileComponent],
  templateUrl: './af-stepper.component.html',
  styleUrl: './af-stepper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfStepperComponent {
  private readonly platform = inject(AfPlatformService);
  private readonly panelDirectives = contentChildren(AfStepPanelDirective);

  readonly steps = input<readonly AfStepItem[]>([]);
  readonly activeId = input<string | undefined>(undefined);
  readonly density = input<AfStepperDensity>('comfortable');
  readonly linear = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input('Stepper');

  readonly activeIdChange = output<string>();
  readonly stepChange = output<AfStepChange>();

  protected readonly isMobile = this.platform.isMobile;
  protected readonly panelTemplates = computed<readonly AfStepPanelDefinition[]>(() =>
    this.panelDirectives().map((panelDirective) => ({
      id: panelDirective.stepId(),
      templateRef: panelDirective.templateRef,
    })),
  );
}
