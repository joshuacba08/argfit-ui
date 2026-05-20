import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type { AfNavigationItem } from '@argfit-ui/core';

import { AfBottomTabsMobileComponent } from './af-bottom-tabs-mobile.component';

@Component({
  imports: [AfBottomTabsMobileComponent],
  template: `
    <af-bottom-tabs-mobile [tabs]="tabs" activeTab="home" (tabSelected)="selected = $event" />
  `,
})
class AfBottomTabsMobileHostComponent {
  selected: AfNavigationItem | undefined;
  readonly tabs: readonly AfNavigationItem[] = [
    { id: 'home', label: 'Inicio', icon: 'home', badge: 1 },
    { id: 'train', label: 'Entrenar', icon: 'play' },
    { id: 'settings', label: 'Ajustes', icon: 'settings', disabled: true },
  ];
}

describe('AfBottomTabsMobileComponent', () => {
  it('renders tabs, active state, icons and safe-area tabbar host', async () => {
    await TestBed.configureTestingModule({ imports: [AfBottomTabsMobileHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(AfBottomTabsMobileHostComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const active = root.querySelector('.af-bottom-tabs-mobile__item--active') as HTMLElement;
    expect(root.querySelectorAll('.af-bottom-tabs-mobile__item').length).toBe(3);
    expect(active.getAttribute('aria-current')).toBe('page');
    expect(root.querySelector('af-icon')).not.toBeNull();
    expect(root.querySelector('af-badge-mobile')?.textContent?.trim()).toBe('1');
  });

  it('emits selected tabs and blocks disabled tabs', async () => {
    await TestBed.configureTestingModule({ imports: [AfBottomTabsMobileHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(AfBottomTabsMobileHostComponent);
    fixture.detectChanges();

    const tabs = fixture.nativeElement.querySelectorAll('button.af-bottom-tabs-mobile__item');
    (tabs[1] as HTMLButtonElement).click();
    expect(fixture.componentInstance.selected?.id).toBe('train');

    fixture.componentInstance.selected = undefined;
    (tabs[2] as HTMLButtonElement).click();
    expect(fixture.componentInstance.selected).toBeUndefined();
  });
});