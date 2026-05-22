import { ChangeDetectionStrategy, Component, computed, contentChild, inject, input } from '@angular/core';

import { AfPlatformService, type AfToolbarDensity } from '@argfit-ui/core';
import { AfToolbarDesktopComponent } from '@argfit-ui/desktop';
import { AfToolbarMobileComponent } from '@argfit-ui/mobile';

import { AfToolbarCenterDirective, AfToolbarEndDirective, AfToolbarStartDirective } from './af-toolbar-slots.directive';

@Component({
  selector: 'af-toolbar',
  imports: [AfToolbarDesktopComponent, AfToolbarMobileComponent],
  templateUrl: './af-toolbar.component.html',
  styleUrl: './af-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfToolbarComponent {
  private readonly platform = inject(AfPlatformService);
  private readonly startDirective = contentChild(AfToolbarStartDirective);
  private readonly centerDirective = contentChild(AfToolbarCenterDirective);
  private readonly endDirective = contentChild(AfToolbarEndDirective);

  readonly density = input<AfToolbarDensity>('comfortable');
  readonly ariaLabel = input('Toolbar');

  protected readonly isMobile = this.platform.isMobile;
  protected readonly startTemplate = computed(() => this.startDirective()?.templateRef);
  protected readonly centerTemplate = computed(() => this.centerDirective()?.templateRef);
  protected readonly endTemplate = computed(() => this.endDirective()?.templateRef);
}