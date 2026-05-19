import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { AfButton } from '@argfit-ui/adaptive';
import { AfPlatformService, type AfPlatformPreference } from '@argfit-ui/core';

@Component({
  selector: 'app-root',
  imports: [AfButton],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly platform = inject(AfPlatformService);
  protected readonly lastAction = signal('Idle');

  protected setPlatform(preference: AfPlatformPreference): void {
    this.platform.setPreference(preference);
  }

  protected recordAction(action: string): void {
    this.lastAction.set(action);
  }
}
