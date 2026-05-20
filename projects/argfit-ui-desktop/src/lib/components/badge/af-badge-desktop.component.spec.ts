import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AfBadgeDesktopComponent } from './af-badge-desktop.component';

@Component({
  imports: [AfBadgeDesktopComponent],
  template: `
    <af-badge-desktop
      tone="success"
      variant="outline"
      size="md"
      shape="rounded"
      icon="bluetooth"
      [dot]="true"
      ariaLabel="Device connected"
    >
      Connected
    </af-badge-desktop>
  `,
})
class AfBadgeDesktopHostComponent {}

describe('AfBadgeDesktopComponent', () => {
  it('renders projected content and reflects badge inputs', async () => {
    await TestBed.configureTestingModule({
      imports: [AfBadgeDesktopHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfBadgeDesktopHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const badge = fixture.nativeElement.querySelector('af-badge-desktop') as HTMLElement;

    expect(badge.textContent?.trim()).toBe('Connected');
    expect(badge.getAttribute('data-tone')).toBe('success');
    expect(badge.getAttribute('data-variant')).toBe('outline');
    expect(badge.getAttribute('data-size')).toBe('md');
    expect(badge.getAttribute('data-shape')).toBe('rounded');
    expect(badge.getAttribute('aria-label')).toBe('Device connected');
    expect(badge.querySelector('.af-badge-desktop__dot')).not.toBeNull();
    expect(badge.querySelector('af-icon')).not.toBeNull();
  });

  it('does not render an icon or dot when they are not requested', async () => {
    @Component({
      imports: [AfBadgeDesktopComponent],
      template: `<af-badge-desktop tone="neutral">v2.4.1</af-badge-desktop>`,
    })
    class PlainBadgeHost {}

    await TestBed.configureTestingModule({ imports: [PlainBadgeHost] }).compileComponents();

    const fixture = TestBed.createComponent(PlainBadgeHost);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('af-badge-desktop') as HTMLElement;
    expect(badge.textContent?.trim()).toBe('v2.4.1');
    expect(badge.querySelector('af-icon')).toBeNull();
    expect(badge.querySelector('.af-badge-desktop__dot')).toBeNull();
  });
});
