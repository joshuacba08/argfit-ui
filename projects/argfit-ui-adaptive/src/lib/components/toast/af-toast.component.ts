import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  numberAttribute,
  output,
} from '@angular/core';

import {
  AfPlatformService,
  type AfFeedbackSeverity,
  type AfToast,
} from '@argfit-ui/core';
import { AfToastDesktopComponent } from '@argfit-ui/desktop';
import { AfToastMobileComponent } from '@argfit-ui/mobile';

@Component({
  selector: 'af-toast',
  imports: [AfToastDesktopComponent, AfToastMobileComponent],
  template: `
    @if (isMobile()) {
      <af-toast-mobile
        [toast]="toastModel()"
        [closeLabel]="closeLabel()"
        (dismissed)="onDismissed($event)"
      />
    } @else {
      <af-toast-desktop
        [toast]="toastModel()"
        [closeLabel]="closeLabel()"
        (dismissed)="onDismissed($event)"
      />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfToastComponent {
  private readonly platform = inject(AfPlatformService);

  readonly id = input<string | undefined>(undefined);
  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
  readonly severity = input<AfFeedbackSeverity>('info');
  readonly duration = input(4000, { transform: numberAttribute });
  readonly persistent = input(false, { transform: booleanAttribute });
  readonly closeLabel = input('Cerrar notificacion');
  readonly dismissed = output<string>();

  protected readonly isMobile = this.platform.isMobile;
  protected readonly toastModel = computed<AfToast>(() => {
    const duration = Math.max(0, this.duration());
    return {
      id: this.id() ?? 'af-toast-inline',
      title: this.title(),
      description: this.description(),
      severity: this.severity(),
      duration,
      persistent: this.persistent() || duration === 0,
    };
  });

  protected onDismissed(id: string): void {
    this.dismissed.emit(id);
  }
}
