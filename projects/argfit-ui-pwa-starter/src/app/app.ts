import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AfPageShell,
  AfToastViewport,
} from '@argfit-ui/adaptive';
import type { AfNavigationItem } from '@argfit-ui/core';

const NAV_ITEMS: readonly AfNavigationItem[] = [
  {
    id: 'device',
    label: 'Devices',
    icon: 'bluetooth',
    ariaLabel: 'Open device demo',
  },
  {
    id: 'install',
    label: 'Install',
    icon: 'download',
    ariaLabel: 'Open install and update status',
  },
  {
    id: 'offline',
    label: 'Offline',
    icon: 'monitor',
    ariaLabel: 'Open offline shell status',
  },
];

@Component({
  selector: 'app-root',
  imports: [AfPageShell, AfToastViewport, RouterOutlet],
  template: `
    <af-page-shell
      title="ArgFit PWA"
      subtitle="Installable app shell with device capability detection"
      [navItems]="navItems"
      [mobileTabs]="navItems"
      [activeItem]="activeSection()"
      [activeTab]="activeSection()"
      [notificationCount]="1"
      userInitials="AF"
      searchPlaceholder="Search capabilities"
      ariaLabel="ArgFit PWA navigation"
      (navItemSelected)="selectNavigation($event)"
      (tabSelected)="selectNavigation($event)"
    >
      <router-outlet />
    </af-page-shell>

    <af-toast-viewport />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly router = inject(Router);
  private readonly urlSignal = signal(this.router.url);

  readonly navItems = NAV_ITEMS;
  readonly activeSection = computed(() => {
    const firstSegment = this.urlSignal().split('?')[0].split('/').filter(Boolean)[0];
    return firstSegment ?? 'device';
  });

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.urlSignal.set(event.urlAfterRedirects);
      }
    });
  }

  selectNavigation(item: AfNavigationItem): void {
    if (item.disabled) {
      return;
    }

    void this.router.navigate([item.id]);
  }
}
