import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
    AfButton,
    AfCard,
    AfCardContentDirective,
    AfCardEyebrowDirective,
    AfCardFooterDirective,
    AfCardHeaderDirective,
    AfCardSubtitleDirective,
    AfCardTitleDirective,
    AfInput,
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
    AfInput,
    ReactiveFormsModule,
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

  protected readonly athleteName = signal('');
  protected readonly searchQuery = signal('');
  protected readonly athleteWeight = signal('68');
  protected readonly athleteEmail = signal('invalid-email');
  protected readonly heightControl = new FormControl<string>('178', { nonNullable: true });

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

  protected updateAthleteName(value: string): void {
    this.athleteName.set(value);
  }

  protected updateSearchQuery(value: string): void {
    this.searchQuery.set(value);
  }

  protected updateAthleteWeight(value: string): void {
    this.athleteWeight.set(value);
  }

  protected updateAthleteEmail(value: string): void {
    this.athleteEmail.set(value);
  }

  protected emailError(): string | undefined {
    const value = this.athleteEmail();
    if (!value) {
      return undefined;
    }
    return /.+@.+\..+/.test(value) ? undefined : 'Ingresa un email valido';
  }
}
