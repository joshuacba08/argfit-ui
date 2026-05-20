import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    output,
    ViewEncapsulation,
} from '@angular/core';

import type { AfFeedbackSeverity, AfIconName, AfIconTone, AfToast } from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

@Component({
  selector: 'af-toast-mobile',
  imports: [AfIconComponent],
  templateUrl: './af-toast-mobile.component.html',
  styleUrl: './af-toast-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-toast-mobile',
    '[attr.data-severity]': 'toast().severity',
    '[attr.role]': 'role()',
    '[attr.aria-live]': 'ariaLive()',
    '[attr.aria-atomic]': 'true',
  },
})
export class AfToastMobileComponent {
  readonly toast = input.required<AfToast>();
  readonly closeLabel = input('Cerrar notificacion');
  readonly dismissed = output<string>();

  protected readonly role = computed<'status' | 'alert'>(() =>
    this.isAssertive(this.toast().severity) ? 'alert' : 'status',
  );
  protected readonly ariaLive = computed<'polite' | 'assertive'>(() =>
    this.isAssertive(this.toast().severity) ? 'assertive' : 'polite',
  );
  protected readonly iconName = computed<AfIconName>(() => this.iconFor(this.toast().severity));
  protected readonly iconTone = computed<AfIconTone>(() => this.iconToneFor(this.toast().severity));

  protected onDismiss(): void {
    this.dismissed.emit(this.toast().id);
  }

  private isAssertive(severity: AfFeedbackSeverity): boolean {
    return severity === 'warning' || severity === 'danger';
  }

  private iconFor(severity: AfFeedbackSeverity): AfIconName {
    switch (severity) {
      case 'success':
        return 'circle-check';
      case 'warning':
        return 'alert-triangle';
      case 'danger':
        return 'circle-alert';
      case 'info':
        return 'info';
    }
  }

  private iconToneFor(severity: AfFeedbackSeverity): AfIconTone {
    return severity === 'info' ? 'primary' : severity;
  }
}
