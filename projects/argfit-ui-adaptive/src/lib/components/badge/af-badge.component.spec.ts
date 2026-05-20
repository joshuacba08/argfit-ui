import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideArgfitUi } from '@argfit-ui/core';
import { AfBadgeComponent } from './af-badge.component';

@Component({
  imports: [AfBadgeComponent],
  template: `
    <af-badge tone="success" variant="solid" size="md" shape="rounded" icon="bluetooth" dot>
      Connected
    </af-badge>
  `,
})
class AfBadgeHostComponent {}

describe('AfBadgeComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders the desktop implementation and passes inputs', async () => {
    await TestBed.configureTestingModule({
      imports: [AfBadgeHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfBadgeHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const desktop = fixture.nativeElement.querySelector('af-badge-desktop') as HTMLElement | null;
    const mobile = fixture.nativeElement.querySelector('af-badge-mobile') as HTMLElement | null;

    expect(desktop).not.toBeNull();
    expect(mobile).toBeNull();
    expect(desktop!.textContent?.trim()).toBe('Connected');
    expect(desktop!.getAttribute('data-tone')).toBe('success');
    expect(desktop!.getAttribute('data-variant')).toBe('solid');
    expect(desktop!.getAttribute('data-size')).toBe('md');
    expect(desktop!.getAttribute('data-shape')).toBe('rounded');
    expect(desktop!.querySelector('.af-badge-desktop__dot')).not.toBeNull();
    expect(desktop!.querySelector('af-icon')).not.toBeNull();
  });

  it('renders the mobile implementation and projects content', async () => {
    await TestBed.configureTestingModule({
      imports: [AfBadgeHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfBadgeHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const mobile = fixture.nativeElement.querySelector('af-badge-mobile') as HTMLElement | null;
    const desktop = fixture.nativeElement.querySelector('af-badge-desktop') as HTMLElement | null;

    expect(mobile).not.toBeNull();
    expect(desktop).toBeNull();
    expect(mobile!.textContent?.trim()).toBe('Connected');
    expect(mobile!.getAttribute('data-tone')).toBe('success');
    expect(mobile!.getAttribute('data-variant')).toBe('solid');
  });
});
