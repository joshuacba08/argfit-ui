import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  type TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import type { AfAuthShellVariant } from '@argfit-ui/core';

@Component({
  selector: 'af-auth-shell-mobile',
  imports: [NgTemplateOutlet],
  templateUrl: './af-auth-shell-mobile.component.html',
  styleUrl: './af-auth-shell-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-auth-shell-mobile',
    '[attr.data-variant]': 'variant()',
  },
})
export class AfAuthShellMobileComponent {
  readonly variant = input<AfAuthShellVariant>('split');
  readonly ariaLabel = input('Acceso');
  readonly backgroundTemplate = input<TemplateRef<unknown> | null>(null);
  readonly brandTemplate = input<TemplateRef<unknown> | null>(null);
  readonly asideTemplate = input<TemplateRef<unknown> | null>(null);
  readonly contentTemplate = input<TemplateRef<unknown> | null>(null);
  readonly footerTemplate = input<TemplateRef<unknown> | null>(null);
}
