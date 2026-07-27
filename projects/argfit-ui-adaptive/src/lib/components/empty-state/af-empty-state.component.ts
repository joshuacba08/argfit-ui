import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';

import {
  AfPlatformService,
  type AfEmptyStateAction,
  type AfEmptyStateSize,
  type AfEmptyStateTone,
  type AfIconName,
} from '@argfit-ui/core';
import { AfEmptyStateDesktopComponent } from '@argfit-ui/desktop';
import { AfEmptyStateMobileComponent } from '@argfit-ui/mobile';

/**
 * Standalone empty state.
 *
 * Collection components carry their own `emptyTitle` / `emptyDescription`; this one covers
 * the case they cannot — a whole route with nothing in it, a detail that does not exist,
 * a section the current role may not see.
 *
 * `actions` is part of the contract rather than an optional extra. An empty surface that
 * only says "no data" leaves the user to work out what to do next, which is the moment
 * they are least equipped to guess.
 *
 * `tone` distinguishes the four situations that look identical when rendered as a blank
 * panel: nothing yet, filtered out, failed, or not permitted.
 */
@Component({
  selector: 'af-empty-state',
  imports: [AfEmptyStateDesktopComponent, AfEmptyStateMobileComponent, NgTemplateOutlet],
  templateUrl: './af-empty-state.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfEmptyStateComponent {
  private readonly platform = inject(AfPlatformService);

  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
  readonly tone = input<AfEmptyStateTone>('empty');
  readonly size = input<AfEmptyStateSize>('md');
  readonly icon = input<AfIconName | undefined>(undefined);
  readonly actions = input<readonly AfEmptyStateAction[]>([]);

  readonly actionSelected = output<string>();

  protected readonly isMobile = this.platform.isMobile;
}
