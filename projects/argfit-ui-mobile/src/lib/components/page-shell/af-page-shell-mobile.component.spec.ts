import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type { AfNavigationItem } from '@argfit-ui/core';

import { AfPageShellMobileComponent } from './af-page-shell-mobile.component';

@Component({
  imports: [AfPageShellMobileComponent],
  template: `
    <af-page-shell-mobile
      title="Inicio"
      subtitle="ArgFit"
      [mobileTabs]="tabs"
      activeTab="home"
      (tabSelected)="selected = $event"
    >
      <section class="content-marker">Mobile content</section>
    </af-page-shell-mobile>
  `,
})
class AfPageShellMobileHostComponent {
  selected: AfNavigationItem | undefined;
  readonly tabs: readonly AfNavigationItem[] = [
    { id: 'home', label: 'Inicio', icon: 'home' },
    { id: 'train', label: 'Entrenar', icon: 'play' },
    { id: 'settings', label: 'Ajustes', icon: 'settings', disabled: true },
  ];
}

describe('AfPageShellMobileComponent', () => {
  it('renders compact header, projected content and bottom tabs', async () => {
    await TestBed.configureTestingModule({ imports: [AfPageShellMobileHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(AfPageShellMobileHostComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.af-page-shell-mobile__header h1')?.textContent?.trim()).toBe('Inicio');
    expect(root.querySelector('.content-marker')?.textContent?.trim()).toBe('Mobile content');
    expect(root.querySelector('af-bottom-tabs-mobile')).not.toBeNull();
    expect(root.querySelector('.af-bottom-tabs-mobile__item--active')?.getAttribute('aria-current')).toBe('page');
  });

  it('reemits tab selection and blocks disabled tabs', async () => {
    await TestBed.configureTestingModule({ imports: [AfPageShellMobileHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(AfPageShellMobileHostComponent);
    fixture.detectChanges();

    const tabs = fixture.nativeElement.querySelectorAll('button.af-bottom-tabs-mobile__item');
    (tabs[1] as HTMLButtonElement).click();
    expect(fixture.componentInstance.selected?.id).toBe('train');

    fixture.componentInstance.selected = undefined;
    (tabs[2] as HTMLButtonElement).click();
    expect(fixture.componentInstance.selected).toBeUndefined();
  });
});
