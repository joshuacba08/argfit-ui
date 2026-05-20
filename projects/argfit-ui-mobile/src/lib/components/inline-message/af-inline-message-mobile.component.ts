import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    output,
    signal,
    ViewEncapsulation,
} from '@angular/core';

import type { AfFeedbackSeverity, AfIconName, AfIconTone } from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

@Component({
  selector: 'af-inline-message-mobile',
  imports: [AfIconComponent],
  template: `
    @if (visible()) {
      <span class="af-inline-message-mobile__icon" aria-hidden="true">
        <af-icon [name]="iconName()" [tone]="iconTone()" size="sm" decorative />
      </span>

      <span class="af-inline-message-mobile__content">
        <span class="af-inline-message-mobile__title">{{ title() }}</span>
        @if (description(); as descriptionText) {
          <span class="af-inline-message-mobile__description">{{ descriptionText }}</span>
        }
      </span>

      @if (closable()) {
        <button
          type="button"
          class="af-inline-message-mobile__close"
          [attr.aria-label]="closeLabel()"
          (click)="dismiss()"
        >
          <af-icon name="x" size="xs" tone="muted" decorative />
        </button>
      }
    }
  `,
  styles: [
    `
      .af-inline-message-mobile {
        --af-inline-message-tone: var(--af-info);
        --af-inline-message-bg: color-mix(in srgb, var(--af-inline-message-tone) 8%, transparent);
        --af-inline-message-border: color-mix(in srgb, var(--af-inline-message-tone) 22%, transparent);

        align-items: flex-start;
        background: var(--af-inline-message-bg);
        border: 1px solid var(--af-inline-message-border);
        border-radius: var(--af-radius-lg);
        color: var(--af-text-main);
        display: flex;
        font-family: var(--af-font-body);
        gap: var(--af-space-2);
        padding: var(--af-space-3);
      }

      .af-inline-message-mobile--hidden {
        display: none;
      }

      .af-inline-message-mobile[data-severity='success'] {
        --af-inline-message-tone: var(--af-success);
      }

      .af-inline-message-mobile[data-severity='info'] {
        --af-inline-message-tone: var(--af-info);
      }

      .af-inline-message-mobile[data-severity='warning'] {
        --af-inline-message-tone: var(--af-warning);
      }

      .af-inline-message-mobile[data-severity='danger'] {
        --af-inline-message-tone: var(--af-danger);
      }

      .af-inline-message-mobile__icon {
        align-items: center;
        color: var(--af-inline-message-tone);
        display: inline-flex;
        flex: 0 0 auto;
        margin-top: var(--af-space-0_5);
      }

      .af-inline-message-mobile__content {
        display: grid;
        flex: 1 1 auto;
        gap: var(--af-space-0_5);
        min-width: 0;
      }

      .af-inline-message-mobile__title {
        color: var(--af-inline-message-tone);
        font-size: calc(var(--af-text-sm) - 1px);
        font-weight: var(--af-font-weight-semibold);
        line-height: var(--af-leading-snug);
        overflow-wrap: anywhere;
      }

      .af-inline-message-mobile__description {
        color: var(--af-text-soft);
        font-size: var(--af-text-xs);
        line-height: var(--af-leading-normal);
        overflow-wrap: anywhere;
      }

      .af-inline-message-mobile__close {
        align-items: center;
        appearance: none;
        background: transparent;
        border: 1px solid transparent;
        border-radius: var(--af-radius-sm);
        color: var(--af-text-soft);
        cursor: pointer;
        display: inline-flex;
        flex: 0 0 var(--af-space-6);
        height: var(--af-space-6);
        justify-content: center;
        padding: 0;
        width: var(--af-space-6);
      }

      .af-inline-message-mobile__close:focus-visible {
        border-color: var(--af-border-focus);
        box-shadow: var(--af-focus-ring);
        outline: none;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-inline-message-mobile',
    '[class.af-inline-message-mobile--hidden]': '!visible()',
    '[attr.data-severity]': 'severity()',
    '[attr.role]': 'visible() ? role() : null',
    '[attr.aria-live]': 'visible() ? ariaLive() : null',
    '[attr.aria-atomic]': 'visible() ? "true" : null',
  },
})
export class AfInlineMessageMobileComponent {
  readonly severity = input<AfFeedbackSeverity>('info');
  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
  readonly closable = input(false, { transform: booleanAttribute });
  readonly closeLabel = input('Cerrar mensaje');
  readonly dismissed = output<void>();

  protected readonly visible = signal(true);
  protected readonly role = computed<'status' | 'alert'>(() =>
    this.isAssertive(this.severity()) ? 'alert' : 'status',
  );
  protected readonly ariaLive = computed<'polite' | 'assertive'>(() =>
    this.isAssertive(this.severity()) ? 'assertive' : 'polite',
  );
  protected readonly iconName = computed<AfIconName>(() => this.iconFor(this.severity()));
  protected readonly iconTone = computed<AfIconTone>(() => this.iconToneFor(this.severity()));

  protected dismiss(): void {
    this.visible.set(false);
    this.dismissed.emit();
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
