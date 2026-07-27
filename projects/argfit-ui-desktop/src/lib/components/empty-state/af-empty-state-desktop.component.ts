import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    output,
    ViewEncapsulation,
} from '@angular/core';

import {
    AF_EMPTY_STATE_ICON,
    type AfEmptyStateAction,
    type AfEmptyStateSize,
    type AfEmptyStateTone,
    type AfIconName,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

import { AfButtonDesktopComponent } from '../button/af-button-desktop.component';

/**
 * Desktop renderer for `AfEmptyState`.
 */
@Component({
  selector: 'af-empty-state-desktop',
  imports: [AfIconComponent, AfButtonDesktopComponent],
  templateUrl: './af-empty-state-desktop.component.html',
  styleUrl: './af-empty-state-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-empty-state-desktop',
    '[attr.data-tone]': 'tone()',
    '[attr.data-size]': 'size()',
    '[attr.role]': 'tone() === "error" ? "alert" : "status"',
  },
})
export class AfEmptyStateDesktopComponent {
  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
  readonly tone = input<AfEmptyStateTone>('empty');
  readonly size = input<AfEmptyStateSize>('md');
  readonly icon = input<AfIconName | undefined>(undefined);
  readonly actions = input<readonly AfEmptyStateAction[]>([]);

  readonly actionSelected = output<string>();

  protected readonly resolvedIcon = computed<AfIconName>(
    () => this.icon() ?? AF_EMPTY_STATE_ICON[this.tone()],
  );
}
