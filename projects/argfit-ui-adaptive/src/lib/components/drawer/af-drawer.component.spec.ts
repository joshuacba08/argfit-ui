import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideArgfitUi } from '@argfit-ui/core';
import { AfDrawerComponent } from './af-drawer.component';

@Component({
  imports: [AfDrawerComponent],
  template: `
    <af-drawer
      [open]="true"
      title="Overlay filters"
      description="Side panel for advanced filters"
      placement="end"
      size="md"
      (openChange)="changed = $event"
    >
      <p>Filter body</p>
    </af-drawer>
  `,
})
class AfDrawerHostComponent {
  changed: boolean | null = null;
}

describe('AfDrawerComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders the desktop implementation and propagates openChange on close', async () => {
    await TestBed.configureTestingModule({
      imports: [AfDrawerHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfDrawerHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const desktop = fixture.nativeElement.querySelector('af-drawer-desktop') as HTMLElement | null;
    const closeButton = desktop?.querySelector('.af-drawer-desktop__close') as HTMLButtonElement | null;

    expect(desktop).not.toBeNull();
    expect(desktop!.querySelector('.af-drawer-desktop__title')?.textContent?.trim()).toBe('Overlay filters');
    expect(desktop!.querySelector('.af-drawer-desktop__body')?.textContent).toContain('Filter body');

    closeButton!.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.changed).toBe(false);
  });

  it('renders the mobile implementation when platform is mobile', async () => {
    await TestBed.configureTestingModule({
      imports: [AfDrawerHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfDrawerHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const mobile = fixture.nativeElement.querySelector('af-drawer-mobile') as HTMLElement | null;
    const desktop = fixture.nativeElement.querySelector('af-drawer-desktop') as HTMLElement | null;

    expect(mobile).not.toBeNull();
    expect(desktop).toBeNull();
    expect(mobile!.querySelector('.af-drawer-mobile__body')?.textContent).toContain('Filter body');
  });
});
