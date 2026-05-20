import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type { AfBreadcrumbItem, AfNavigationItem } from '@argfit-ui/core';

import { AfPageShellDesktopComponent } from './af-page-shell-desktop.component';

@Component({
  imports: [AfPageShellDesktopComponent],
  template: `
    <af-page-shell-desktop
      title="Dashboard"
      [navItems]="items"
      [breadcrumbs]="breadcrumbs"
      activeItem="dashboard"
      [notificationCount]="2"
      (navItemSelected)="selected = $event"
      (breadcrumbSelected)="breadcrumb = $event"
      (collapsedChange)="collapsed = $event"
    >
      <div afPageShellBrand>ARGFIT</div>
      <div afPageShellActions>Actions</div>
      <section class="content-marker">Projected content</section>
    </af-page-shell-desktop>
  `,
})
class AfPageShellDesktopHostComponent {
  selected: AfNavigationItem | undefined;
  breadcrumb: AfBreadcrumbItem | undefined;
  collapsed = false;
  readonly items: readonly AfNavigationItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
    { id: 'athletes', label: 'Atletas', icon: 'users' },
  ];
  readonly breadcrumbs: readonly AfBreadcrumbItem[] = [{ id: 'root', label: 'ArgFit' }];
}

describe('AfPageShellDesktopComponent', () => {
  it('renders sidebar, topbar and projected content', async () => {
    await TestBed.configureTestingModule({ imports: [AfPageShellDesktopHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(AfPageShellDesktopHostComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-sidebar-desktop')).not.toBeNull();
    expect(root.querySelector('af-topbar-desktop h1')?.textContent?.trim()).toBe('Dashboard');
    expect(root.querySelector('.content-marker')?.textContent?.trim()).toBe('Projected content');
  });

  it('reemits navigation, breadcrumb and collapsed changes', async () => {
    await TestBed.configureTestingModule({ imports: [AfPageShellDesktopHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(AfPageShellDesktopHostComponent);
    fixture.detectChanges();

    const navItems = fixture.nativeElement.querySelectorAll('button.af-sidebar-desktop__item');
    (navItems[1] as HTMLButtonElement).click();
    expect(fixture.componentInstance.selected?.id).toBe('athletes');

    const breadcrumb = fixture.nativeElement.querySelector('.af-topbar-desktop__breadcrumbs button') as HTMLButtonElement;
    breadcrumb.click();
    expect(fixture.componentInstance.breadcrumb?.id).toBe('root');

    const collapse = fixture.nativeElement.querySelector('.af-sidebar-desktop__collapse') as HTMLButtonElement;
    collapse.click();
    expect(fixture.componentInstance.collapsed).toBe(true);
  });
});
