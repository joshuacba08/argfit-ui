import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AfBadge,
  AfCard,
  AfInlineMessage,
  AfMetricCard,
} from '@argfit-ui/adaptive';
import { AfIconComponent } from '@argfit-ui/primitives';

import { NetworkStatusService } from '../../services/network-status.service';

@Component({
  selector: 'app-offline-page',
  imports: [AfBadge, AfCard, AfIconComponent, AfInlineMessage, AfMetricCard],
  templateUrl: './offline.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfflinePage {
  protected readonly network = inject(NetworkStatusService);
}
