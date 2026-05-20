import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideArgfitUi, type AfNavigationItem } from '@argfit-ui/core';

import { AfPageShellComponent } from './af-page-shell.component';

const NAV_ITEMS: readonly AfNavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
  { id: 'athletes', label: 'Atletas', icon: 'users' },
];

const MOBILE_TABS: readonly AfNavigationItem[] = [
  { id: 'home', label: 'Inicio', icon: 'home' },
  { id: 'train', label: 'Entrenar', icon: 'play' },
];

@Component({
  imports: [AfPageShellComponent],
  template: `
    <af-page-shell
      title="Dashboard"
      [navItems]="navItems"
      [mobileTabs]="mobileTabs"
      activeItem="dashboard"
      activeTab="home"
      (navItemSelected)="selected = $event"
      (tabSelected)="tab = $event"
    >
      <div afPageShellBrand>ARGFIT</div>
      <section class="content-marker">Projected content</section>
    </af-page-shell>
  `,
})
class AfPageShellHostComponent {
  selected: AfNavigationItem | undefined;
  tab: AfNavigationItem | undefined;
  readonly navItems = NAV_ITEMS;
  readonly mobileTabs = MOBILE_TABS;
}

describe('AfPageShellComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders desktop shell and reemits navigation events', async () => {
    await TestBed.configureTestingModule({
      imports: [AfPageShellHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfPageShellHostComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-page-shell-desktop')).not.toBeNull();
    expect(root.querySelector('af-page-shell-mobile')).toBeNull();
    expect(root.querySelector('.content-marker')?.textContent?.trim()).toBe('Projected content');

    const buttons = root.querySelectorAll('button.af-sidebar-desktop__item');
    (buttons[1] as HTMLButtonElement).click();
    expect(fixture.componentInstance.selected?.id).toBe('athletes');
  });

  it('renders mobile shell and reemits tab events', async () => {
    await TestBed.configureTestingModule({
      imports: [AfPageShellHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfPageShellHostComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-page-shell-mobile')).not.toBeNull();
    expect(root.querySelector('af-page-shell-desktop')).toBeNull();

    const tabs = root.querySelectorAll('button.af-bottom-tabs-mobile__item');
    (tabs[1] as HTMLButtonElement).click();
    expect(fixture.componentInstance.tab?.id).toBe('train');
  });
});
