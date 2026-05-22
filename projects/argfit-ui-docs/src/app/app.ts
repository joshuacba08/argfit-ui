import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AfBadge, AfBadgeComponent } from '@argfit-ui/adaptive';
import { AfPlatformService, AfThemeService, type AfPlatformPreference } from '@argfit-ui/core';

import { DOCS_NAV_ITEMS } from './docs-data';

@Component({
  selector: 'docs-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AfBadge, AfBadgeComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly navItems = DOCS_NAV_ITEMS;
  protected readonly platform = inject(AfPlatformService);
  protected readonly theme = inject(AfThemeService);

  protected setPlatform(preference: AfPlatformPreference): void {
    this.platform.setPreference(preference);
  }

  protected toggleTheme(): void {
    this.theme.toggleTheme();
  }
}
