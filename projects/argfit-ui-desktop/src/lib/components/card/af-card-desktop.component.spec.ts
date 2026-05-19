import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AfCardDesktopComponent } from './af-card-desktop.component';

@Component({
  imports: [AfCardDesktopComponent],
  template: `
    <af-card-desktop
      variant="metric"
      density="compact"
      tone="primary"
      [interactive]="true"
      [selected]="true"
    >
      <span>Projected metric</span>
    </af-card-desktop>
  `,
})
class AfCardDesktopHostComponent {}

describe('AfCardDesktopComponent', () => {
  it('projects content and reflects inputs as host classes/attrs', async () => {
    await TestBed.configureTestingModule({
      imports: [AfCardDesktopHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfCardDesktopHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('af-card-desktop') as HTMLElement;
    expect(host).toBeTruthy();
    expect(host.textContent?.trim()).toBe('Projected metric');
    expect(host.classList.contains('af-card-desktop--metric')).toBe(true);
    expect(host.classList.contains('af-card-desktop--density-compact')).toBe(true);
    expect(host.classList.contains('af-card-desktop--tone-primary')).toBe(true);
    expect(host.classList.contains('af-card-desktop--interactive')).toBe(true);
    expect(host.classList.contains('af-card-desktop--selected')).toBe(true);
    expect(host.getAttribute('data-variant')).toBe('metric');
    expect(host.getAttribute('role')).toBe('button');
    expect(host.getAttribute('aria-pressed')).toBe('true');
    expect(host.getAttribute('tabindex')).toBe('0');
  });

  it('renders a non-interactive surface card by default', async () => {
    @Component({
      imports: [AfCardDesktopComponent],
      template: `<af-card-desktop>Content</af-card-desktop>`,
    })
    class DefaultHost {}

    await TestBed.configureTestingModule({ imports: [DefaultHost] }).compileComponents();

    const fixture = TestBed.createComponent(DefaultHost);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('af-card-desktop') as HTMLElement;
    expect(host.classList.contains('af-card-desktop--surface')).toBe(true);
    expect(host.classList.contains('af-card-desktop--density-comfortable')).toBe(true);
    expect(host.classList.contains('af-card-desktop--interactive')).toBe(false);
    expect(host.getAttribute('role')).toBeNull();
  });
});
