import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AfMetricCardMobileComponent } from './af-metric-card-mobile.component';

@Component({
  imports: [AfMetricCardMobileComponent],
  template: `
    <af-metric-card-mobile
      label="Mejor salto"
      value="45.2"
      unit="cm"
      icon="activity"
      tone="accent"
      trendValue="8%"
      trendDirection="up"
      ariaLabel="Mejor salto 45.2 centimetros"
      [interactive]="true"
      (pressed)="pressed = $event"
    />
    <af-metric-card-mobile label="Promedio" value="42.1" unit="cm" />
  `,
})
class AfMetricCardMobileHostComponent {
  pressed: MouseEvent | KeyboardEvent | undefined;
}

describe('AfMetricCardMobileComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AfMetricCardMobileHostComponent] }).compileComponents();
  });

  it('renders label, value, unit, trend and optional icon', () => {
    const fixture = TestBed.createComponent(AfMetricCardMobileHostComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const card = root.querySelector('af-metric-card-mobile') as HTMLElement;

    expect(card.textContent).toContain('Mejor salto');
    expect(card.textContent).toContain('45.2');
    expect(card.textContent).toContain('cm');
    expect(card.querySelector('af-icon')).not.toBeNull();
    expect(card.querySelector('af-badge-mobile')?.textContent).toContain('+8%');
  });

  it('keeps compact layout attributes and accessible host metadata', () => {
    const fixture = TestBed.createComponent(AfMetricCardMobileHostComponent);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('af-metric-card-mobile') as NodeListOf<HTMLElement>;

    expect(cards[0].getAttribute('data-density')).toBe('compact');
    expect(cards[0].getAttribute('role')).toBe('button');
    expect(cards[0].getAttribute('tabindex')).toBe('0');
    expect(cards[0].getAttribute('aria-label')).toBe('Mejor salto 45.2 centimetros');
    expect(cards[1].querySelector('af-icon')).toBeNull();
  });

  it('emits pressed from click when interactive', () => {
    const fixture = TestBed.createComponent(AfMetricCardMobileHostComponent);
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('af-metric-card-mobile') as HTMLElement;
    card.click();

    expect(fixture.componentInstance.pressed).toBeTruthy();
  });
});
