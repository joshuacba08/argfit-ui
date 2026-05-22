import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, TemplateRef, ViewEncapsulation } from '@angular/core';

import { AfThemeService, type AfToolbarDensity } from '@argfit-ui/core';

@Component({
  selector: 'af-toolbar-desktop',
  imports: [NgTemplateOutlet],
  templateUrl: './af-toolbar-desktop.component.html',
  styleUrl: './af-toolbar-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-toolbar-desktop',
    '[class]': 'hostClasses()',
    '[attr.role]': '"toolbar"',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class AfToolbarDesktopComponent {
  readonly density = input<AfToolbarDensity>('comfortable');
  readonly ariaLabel = input('Toolbar');
  readonly startTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly centerTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  readonly endTemplate = input<TemplateRef<unknown> | undefined>(undefined);

  protected readonly hostClasses = computed(() => ['af-toolbar-desktop', `af-toolbar-desktop--${this.density()}`].join(' '));

  constructor() {
    inject(AfThemeService);
  }
}