import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { AfPlatformService, type AfAuthShellVariant } from '@argfit-ui/core';
import { AfAuthShellDesktopComponent } from '@argfit-ui/desktop';
import { AfAuthShellMobileComponent } from '@argfit-ui/mobile';

@Component({
  selector: 'af-auth-shell',
  imports: [AfAuthShellDesktopComponent, AfAuthShellMobileComponent],
  templateUrl: './af-auth-shell.component.html',
  styleUrl: './af-auth-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfAuthShellComponent {
  private readonly platform = inject(AfPlatformService);

  readonly variant = input<AfAuthShellVariant>('split');
  readonly ariaLabel = input('Acceso');

  protected readonly isMobile = this.platform.isMobile;
}
