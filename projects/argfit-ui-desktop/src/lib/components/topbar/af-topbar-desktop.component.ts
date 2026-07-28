import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  type TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import type { AfBreadcrumbItem } from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

import { AfBadgeDesktopComponent } from '../badge/af-badge-desktop.component';

@Component({
  selector: 'af-topbar-desktop',
  imports: [AfBadgeDesktopComponent, AfIconComponent, NgTemplateOutlet],
  templateUrl: './af-topbar-desktop.component.html',
  styleUrl: './af-topbar-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'af-topbar-desktop' },
})
export class AfTopbarDesktopComponent {
  readonly title = input('');
  readonly subtitle = input<string | undefined>(undefined);
  readonly breadcrumbs = input<readonly AfBreadcrumbItem[]>([]);
  readonly showSearch = input(false);
  readonly searchPlaceholder = input('Buscar...');
  readonly notificationCount = input<number | undefined>(undefined);
  readonly userInitials = input<string | undefined>(undefined);
  readonly actionsTemplate = input<TemplateRef<unknown> | null>(null);
  readonly userTemplate = input<TemplateRef<unknown> | null>(null);

  readonly breadcrumbSelected = output<AfBreadcrumbItem>();
  readonly searchChanged = output<string>();

  protected onBreadcrumbClick(item: AfBreadcrumbItem): void {
    this.breadcrumbSelected.emit(item);
  }

  protected onSearchInput(event: Event): void {
    this.searchChanged.emit((event.target as HTMLInputElement).value);
  }
}
