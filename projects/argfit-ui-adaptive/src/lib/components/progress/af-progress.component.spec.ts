import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideArgfitUi } from '@argfit-ui/core';
import { AfProgressComponent } from './af-progress.component';

@Component({
  imports: [AfProgressComponent],
  template: `
    <af-progress
      [variant]="variant"
      tone="success"
      size="lg"
      [value]="72"
      ariaLabel="Upload progress"
      skeletonWidth="64px"
    />
  `,
})
class AfProgressHostComponent {
  variant: 'bar' | 'spinner' | 'skeleton' = 'bar';
}

describe('AfProgressComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders the desktop progressbar implementation with the expected aria attributes', async () => {
    await TestBed.configureTestingModule({
      imports: [AfProgressHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfProgressHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const desktop = fixture.nativeElement.querySelector('af-progress-desktop') as HTMLElement | null;

    expect(desktop).not.toBeNull();
    expect(desktop!.getAttribute('data-variant')).toBe('bar');
    expect(desktop!.getAttribute('data-tone')).toBe('success');
    expect(desktop!.getAttribute('data-size')).toBe('lg');
    expect(desktop!.getAttribute('role')).toBe('progressbar');
    expect(desktop!.getAttribute('aria-valuenow')).toBe('72');
  });

  it('renders the mobile spinner implementation as a status surface', async () => {
    await TestBed.configureTestingModule({
      imports: [AfProgressHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfProgressHostComponent);
    fixture.componentInstance.variant = 'spinner';
    fixture.detectChanges();
    await fixture.whenStable();

    const mobile = fixture.nativeElement.querySelector('af-progress-mobile') as HTMLElement | null;

    expect(mobile).not.toBeNull();
    expect(mobile!.getAttribute('role')).toBe('status');
    expect(mobile!.querySelector('ion-spinner')).not.toBeNull();
    expect(mobile!.getAttribute('aria-live')).toBe('polite');
  });
});
