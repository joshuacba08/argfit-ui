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
  selector: 'af-auth-shell-desktop',
  imports: [NgTemplateOutlet],
  templateUrl: './af-auth-shell-desktop.component.html',
  styleUrl: './af-auth-shell-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-auth-shell-desktop',
    '[attr.data-variant]': 'variant()',
  },
})
export class AfAuthShellDesktopComponent {
  readonly variant = input<AfAuthShellVariant>('split');
  readonly ariaLabel = input('Acceso');
  readonly backgroundTemplate = input<TemplateRef<unknown> | null>(null);
  readonly brandTemplate = input<TemplateRef<unknown> | null>(null);
  readonly asideTemplate = input<TemplateRef<unknown> | null>(null);
  readonly contentTemplate = input<TemplateRef<unknown> | null>(null);
  readonly footerTemplate = input<TemplateRef<unknown> | null>(null);
}
