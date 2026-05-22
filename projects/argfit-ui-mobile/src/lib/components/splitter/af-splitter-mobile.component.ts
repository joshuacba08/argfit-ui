import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, numberAttribute, TemplateRef, ViewEncapsulation } from '@angular/core';

import { AfThemeService, type AfSplitterOrientation } from '@argfit-ui/core';

@Component({
  selector: 'af-splitter-mobile',
  imports: [NgTemplateOutlet],
  templateUrl: './af-splitter-mobile.component.html',
  styleUrl: './af-splitter-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-splitter-mobile',
    '[class]': 'hostClasses()',
    '[attr.role]': '"region"',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class AfSplitterMobileComponent {
  readonly primaryLabel = input<string | undefined>(undefined);
  readonly secondaryLabel = input<string | undefined>(undefined);
  readonly orientation = input<AfSplitterOrientation>('horizontal');
  readonly primarySize = input(50, { transform: numberAttribute });
  readonly minPrimarySize = input(25, { transform: numberAttribute });
  readonly minSecondarySize = input(25, { transform: numberAttribute });
  readonly ariaLabel = input('Splitter');
  readonly primaryTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly secondaryTemplate = input<TemplateRef<unknown> | undefined>(undefined);

  protected readonly hostClasses = computed(() => ['af-splitter-mobile', `af-splitter-mobile--${this.orientation()}`].join(' '));

  constructor() {
    inject(AfThemeService);
  }
}