import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type { AfBreadcrumbItem } from '@argfit-ui/core';

import { AfTopbarDesktopComponent } from './af-topbar-desktop.component';

@Component({
  imports: [AfTopbarDesktopComponent],
  template: `
    <af-topbar-desktop
      title="Dashboard"
      subtitle="Vista ejecutiva"
      [breadcrumbs]="breadcrumbs"
      [showSearch]="true"
      [notificationCount]="4"
      userInitials="MG"
      (breadcrumbSelected)="selected = $event"
      (searchChanged)="search = $event"
    />
  `,
})
class AfTopbarDesktopHostComponent {
  selected: AfBreadcrumbItem | undefined;
  search = '';
  readonly breadcrumbs: readonly AfBreadcrumbItem[] = [
    { id: 'root', label: 'ArgFit' },
    { id: 'dashboard', label: 'Dashboard' },
  ];
}

describe('AfTopbarDesktopComponent', () => {
  it('renders title, breadcrumbs, search and notification badge', async () => {
    await TestBed.configureTestingModule({ imports: [AfTopbarDesktopHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(AfTopbarDesktopHostComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('h1')?.textContent?.trim()).toBe('Dashboard');
    expect(root.textContent).toContain('Vista ejecutiva');
    expect(root.querySelectorAll('.af-topbar-desktop__breadcrumbs li').length).toBe(2);
    expect(root.querySelector('af-badge-desktop')?.textContent?.trim()).toBe('4');
    expect(root.querySelector('.af-topbar-desktop__avatar')?.textContent?.trim()).toBe('MG');
  });

  it('emits breadcrumb and search changes', async () => {
    await TestBed.configureTestingModule({ imports: [AfTopbarDesktopHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(AfTopbarDesktopHostComponent);
    fixture.detectChanges();

    const breadcrumb = fixture.nativeElement.querySelector('.af-topbar-desktop__breadcrumbs button') as HTMLButtonElement;
    breadcrumb.click();
    expect(fixture.componentInstance.selected?.id).toBe('root');

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'maria';
    input.dispatchEvent(new Event('input'));
    expect(fixture.componentInstance.search).toBe('maria');
  });
});