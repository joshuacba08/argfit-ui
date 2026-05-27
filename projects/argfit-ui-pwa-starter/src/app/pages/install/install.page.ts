import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AfBadge,
  AfButton,
  AfCard,
  AfInlineMessage,
  AfMetricCard,
} from '@argfit-ui/adaptive';
import { AfIconComponent } from '@argfit-ui/primitives';

import { InstallPromptService } from '../../services/install-prompt.service';
import { PwaUpdateService } from '../../services/pwa-update.service';

@Component({
  selector: 'app-install-page',
  imports: [AfBadge, AfButton, AfCard, AfIconComponent, AfInlineMessage, AfMetricCard],
  templateUrl: './install.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstallPage {
  protected readonly installPrompt = inject(InstallPromptService);
  protected readonly updates = inject(PwaUpdateService);

  promptInstall(): void {
    void this.installPrompt.promptInstall();
  }

  checkForUpdate(): void {
    void this.updates.checkForUpdate();
  }

  activateUpdate(): void {
    void this.updates.activateUpdate();
  }
}
