import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideArgfitUi } from '@argfit-ui/core';
import { AfTooltipComponent } from './af-tooltip.component';

@Component({
  imports: [AfTooltipComponent],
  template: `
    <af-tooltip [open]="true" text="More details" placement="bottom" tone="primary">
      <button type="button">Info</button>
    </af-tooltip>
  `,
})
class AfTooltipHostComponent {}

describe('AfTooltipComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders the desktop implementation with a tooltip bubble', async () => {
    await TestBed.configureTestingModule({
      imports: [AfTooltipHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfTooltipHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const desktop = fixture.nativeElement.querySelector('af-tooltip-desktop') as HTMLElement | null;

    expect(desktop).not.toBeNull();
    expect(desktop!.querySelector('button')?.textContent?.trim()).toBe('Info');
    expect(desktop!.querySelector('[role="tooltip"]')?.textContent?.trim()).toBe('More details');
    expect(desktop!.getAttribute('data-placement')).toBe('bottom');
  });

  it('renders the mobile implementation with the mobile disclosure bubble', async () => {
    await TestBed.configureTestingModule({
      imports: [AfTooltipHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfTooltipHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const mobile = fixture.nativeElement.querySelector('af-tooltip-mobile') as HTMLElement | null;
    const desktop = fixture.nativeElement.querySelector('af-tooltip-desktop') as HTMLElement | null;

    expect(mobile).not.toBeNull();
    expect(desktop).toBeNull();
    expect(mobile!.querySelector('[role="tooltip"]')).not.toBeNull();
  });
});