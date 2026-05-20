import { booleanAttribute, ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';

import { AfPlatformService, type AfFeedbackSeverity } from '@argfit-ui/core';
import { AfInlineMessageDesktopComponent } from '@argfit-ui/desktop';
import { AfInlineMessageMobileComponent } from '@argfit-ui/mobile';

@Component({
  selector: 'af-inline-message',
  imports: [AfInlineMessageDesktopComponent, AfInlineMessageMobileComponent],
  template: `
    @if (isMobile()) {
      <af-inline-message-mobile
        [severity]="severity()"
        [title]="title()"
        [description]="description()"
        [closable]="closable()"
        [closeLabel]="closeLabel()"
        (dismissed)="onDismissed()"
      />
    } @else {
      <af-inline-message-desktop
        [severity]="severity()"
        [title]="title()"
        [description]="description()"
        [closable]="closable()"
        [closeLabel]="closeLabel()"
        (dismissed)="onDismissed()"
      />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfInlineMessageComponent {
  private readonly platform = inject(AfPlatformService);

  readonly severity = input<AfFeedbackSeverity>('info');
  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
  readonly closable = input(false, { transform: booleanAttribute });
  readonly closeLabel = input('Cerrar mensaje');
  readonly dismissed = output<void>();

  protected readonly isMobile = this.platform.isMobile;

  protected onDismissed(): void {
    this.dismissed.emit();
  }
}
