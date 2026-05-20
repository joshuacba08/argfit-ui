import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AfBadgeMobileComponent } from './af-badge-mobile.component';

@Component({
  imports: [AfBadgeMobileComponent],
  template: `
    <af-badge-mobile icon="bluetooth" [dot]="true" ariaLabel="BLE connected">
      BLE
    </af-badge-mobile>
  `,
})
class AfBadgeMobileHostComponent {}

describe('AfBadgeMobileComponent', () => {
  it('renders projected content with mobile defaults', async () => {
    await TestBed.configureTestingModule({
      imports: [AfBadgeMobileHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfBadgeMobileHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const badge = fixture.nativeElement.querySelector('af-badge-mobile') as HTMLElement;

    expect(badge.textContent?.trim()).toBe('BLE');
    expect(badge.getAttribute('data-tone')).toBe('primary');
    expect(badge.getAttribute('data-variant')).toBe('soft');
    expect(badge.getAttribute('data-size')).toBe('sm');
    expect(badge.getAttribute('data-shape')).toBe('pill');
    expect(badge.getAttribute('aria-label')).toBe('BLE connected');
  });

  it('renders dot and icon affordances without making them accessible twice', async () => {
    await TestBed.configureTestingModule({
      imports: [AfBadgeMobileHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfBadgeMobileHostComponent);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('af-badge-mobile') as HTMLElement;
    const dot = badge.querySelector('.af-badge-mobile__dot') as HTMLElement;
    const iconSvg = badge.querySelector('af-icon svg') as SVGElement;

    expect(dot.getAttribute('aria-hidden')).toBe('true');
    expect(iconSvg.getAttribute('aria-hidden')).toBe('true');
  });
});
