import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import {
    AfButton,
    AfCard,
    AfCardContentDirective,
    AfCardEyebrowDirective,
    AfCardFooterDirective,
    AfCardHeaderDirective,
    AfCardSubtitleDirective,
    AfCardTitleDirective,
} from '@argfit-ui/adaptive';
import {
    AfPlatformService,
    AfThemeService,
    type AfPlatformPreference,
} from '@argfit-ui/core';

@Component({
  selector: 'app-root',
  imports: [
    AfButton,
    AfCard,
    AfCardHeaderDirective,
    AfCardTitleDirective,
    AfCardSubtitleDirective,
    AfCardEyebrowDirective,
    AfCardContentDirective,
    AfCardFooterDirective,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly platform = inject(AfPlatformService);
  protected readonly theme = inject(AfThemeService);
  protected readonly lastAction = signal('Idle');
  protected readonly selectedDevice = signal<string>('jump-01');

  protected setPlatform(preference: AfPlatformPreference): void {
    this.platform.setPreference(preference);
  }

  protected toggleTheme(): void {
    this.theme.toggleTheme();
    this.recordAction(`Theme → ${this.theme.currentThemeName()}`);
  }

  protected recordAction(action: string): void {
    this.lastAction.set(action);
  }

  protected selectDevice(id: string): void {
    this.selectedDevice.set(id);
    this.recordAction(`Device selected → ${id}`);
  }
}
