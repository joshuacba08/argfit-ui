import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AfMetricCardDesktopComponent } from './af-metric-card-desktop.component';

@Component({
  imports: [AfMetricCardDesktopComponent],
  template: `
    <af-metric-card-desktop
      label="Atletas activos"
      value="38"
      unit="atletas"
      icon="users"
      tone="accent"
      size="lg"
      density="compact"
      variant="outline"
      trendValue="12%"
      trendDirection="up"
      trendLabel="vs mes anterior"
      [interactive]="true"
      (pressed)="pressed = $event"
    >
      <span class="footer-marker">Staff elite</span>
    </af-metric-card-desktop>

    <af-metric-card-desktop label="Sin icono" value="--" trendValue="0%" trendDirection="flat" />
    <af-metric-card-desktop label="Descenso" value="18" trendValue="3%" trendDirection="down" />
    <af-metric-card-desktop label="Loading" value="999" [loading]="true" />
  `,
})
class AfMetricCardDesktopHostComponent {
  pressed: MouseEvent | KeyboardEvent | undefined;
}

describe('AfMetricCardDesktopComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AfMetricCardDesktopHostComponent] }).compileComponents();
  });

  it('renders label, value, unit, icon, attributes and projected footer', () => {
    const fixture = TestBed.createComponent(AfMetricCardDesktopHostComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const card = root.querySelector('af-metric-card-desktop') as HTMLElement;

    expect(card.textContent).toContain('Atletas activos');
    expect(card.textContent).toContain('38');
    expect(card.textContent).toContain('atletas');
    expect(card.getAttribute('data-tone')).toBe('accent');
    expect(card.getAttribute('data-size')).toBe('lg');
    expect(card.getAttribute('data-density')).toBe('compact');
    expect(card.getAttribute('data-variant')).toBe('outline');
    expect(card.querySelector('af-icon')).not.toBeNull();
    expect(card.querySelector('.footer-marker')?.textContent?.trim()).toBe('Staff elite');
  });

  it('renders optional trends and omits the icon when not provided', () => {
    const fixture = TestBed.createComponent(AfMetricCardDesktopHostComponent);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('af-metric-card-desktop') as NodeListOf<HTMLElement>;

    expect(cards[0].querySelector('af-badge-desktop')?.textContent).toContain('+12%');
    expect(cards[1].querySelector('af-icon')).toBeNull();
    expect(cards[1].querySelector('af-badge-desktop')?.getAttribute('data-tone')).toBe('neutral');
    expect(cards[2].querySelector('af-badge-desktop')?.textContent).toContain('-3%');
    expect(cards[2].querySelector('af-badge-desktop')?.getAttribute('data-tone')).toBe('danger');
  });

  it('renders loading skeletons without showing the real value', () => {
    const fixture = TestBed.createComponent(AfMetricCardDesktopHostComponent);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('af-metric-card-desktop') as NodeListOf<HTMLElement>;
    const loading = cards[3];

    expect(loading.getAttribute('data-loading')).toBe('');
    expect(loading.querySelector('.af-metric-card-desktop__skeleton')).not.toBeNull();
    expect(loading.textContent).not.toContain('999');
  });

  it('emits pressed from keyboard when interactive', () => {
    const fixture = TestBed.createComponent(AfMetricCardDesktopHostComponent);
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('af-metric-card-desktop') as HTMLElement;
    card.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(fixture.componentInstance.pressed).toBeTruthy();
  });
});
