import { ChangeDetectionStrategy, Component, computed, contentChild, inject, input, output } from '@angular/core';

import { AfPlatformService, type AfSplitterOrientation } from '@argfit-ui/core';
import { AfSplitterDesktopComponent } from '@argfit-ui/desktop';
import { AfSplitterMobileComponent } from '@argfit-ui/mobile';

import { AfSplitterPrimaryDirective, AfSplitterSecondaryDirective } from './af-splitter-slots.directive';

@Component({
  selector: 'af-splitter',
  imports: [AfSplitterDesktopComponent, AfSplitterMobileComponent],
  templateUrl: './af-splitter.component.html',
  styleUrl: './af-splitter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfSplitterComponent {
  private readonly platform = inject(AfPlatformService);
  private readonly primaryDirective = contentChild(AfSplitterPrimaryDirective);
  private readonly secondaryDirective = contentChild(AfSplitterSecondaryDirective);

  readonly primaryLabel = input<string | undefined>(undefined);
  readonly secondaryLabel = input<string | undefined>(undefined);
  readonly orientation = input<AfSplitterOrientation>('horizontal');
  readonly primarySize = input(50);
  readonly minPrimarySize = input(25);
  readonly minSecondarySize = input(25);
  readonly ariaLabel = input('Splitter');

  readonly primarySizeChange = output<number>();

  protected readonly isMobile = this.platform.isMobile;
  protected readonly primaryTemplate = computed(() => this.primaryDirective()?.templateRef);
  protected readonly secondaryTemplate = computed(() => this.secondaryDirective()?.templateRef);
}