import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type { AfNavigationItem } from '@argfit-ui/core';

import { AfSidebarDesktopComponent } from './af-sidebar-desktop.component';

@Component({
  imports: [AfSidebarDesktopComponent],
  template: `
    <af-sidebar-desktop
      [navItems]="items"
      activeItem="dashboard"
      [collapsed]="collapsed"
      (navItemSelected)="selected = $event"
      (collapsedChange)="collapsed = $event"
    >
      <div afPageShellBrand>ARGFIT</div>
    </af-sidebar-desktop>
  `,
})
class AfSidebarDesktopHostComponent {
  collapsed = false;
  selected: AfNavigationItem | undefined;
  readonly items: readonly AfNavigationItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', badge: 2 },
    { id: 'athletes', label: 'Atletas', icon: 'users' },
    { id: 'reports', label: 'Reportes', icon: 'file-text', disabled: true },
  ];
}

describe('AfSidebarDesktopComponent', () => {
  it('renders navigation items, active state, icons and badges', async () => {
    await TestBed.configureTestingModule({ imports: [AfSidebarDesktopHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(AfSidebarDesktopHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    const active = root.querySelector('.af-sidebar-desktop__item--active') as HTMLElement;

    expect(root.textContent).toContain('ARGFIT');
    expect(root.querySelectorAll('.af-sidebar-desktop__item').length).toBe(3);
    expect(active.getAttribute('aria-current')).toBe('page');
    expect(root.querySelector('af-icon')).not.toBeNull();
    expect(root.querySelector('af-badge-desktop')?.textContent?.trim()).toBe('2');
  });

  it('emits selection, blocks disabled items and toggles collapsed state', async () => {
    await TestBed.configureTestingModule({ imports: [AfSidebarDesktopHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(AfSidebarDesktopHostComponent);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button.af-sidebar-desktop__item');
    (buttons[1] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selected?.id).toBe('athletes');

    fixture.componentInstance.selected = undefined;
    (buttons[2] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selected).toBeUndefined();

    const collapse = fixture.nativeElement.querySelector('.af-sidebar-desktop__collapse') as HTMLButtonElement;
    collapse.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.collapsed).toBe(true);
  });
});