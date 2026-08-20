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

/**
 * La superficie de la tarjeta es este mismo host, así que `fill` no tiene un elemento
 * interno donde esconderse: se lee en el host o no se aplica.
 */
@Component({
  imports: [AfMetricCardMobileComponent],
  template: `
    <af-metric-card-mobile label="Con contenido largo" value="88" unit="%" helper="Detalle extenso de la medición." [fill]="fill" />
    <af-metric-card-mobile label="Escueta" value="3" />
  `,
})
class AfMetricCardMobileFillHostComponent {
  fill = false;
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

describe('AfMetricCardMobileComponent — contrato de altura', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AfMetricCardMobileFillHostComponent] }).compileComponents();
  });

  it('no marca `fill` cuando nadie lo pidió', () => {
    const fixture = TestBed.createComponent(AfMetricCardMobileFillHostComponent);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('af-metric-card-mobile') as NodeListOf<HTMLElement>;
    for (const card of cards) {
      expect(card.getAttribute('data-fill')).toBeNull();
      expect(card.className).not.toContain('af-metric-card-mobile--fill');
      // Sin `fill`, la tarjeta sigue midiendo su contenido por encima del `min-height`.
      expect(getComputedStyle(card).blockSize).not.toBe('100%');
    }
  });

  it('reclama la altura del contenedor con `fill`', () => {
    const fixture = TestBed.createComponent(AfMetricCardMobileFillHostComponent);
    fixture.componentInstance.fill = true;
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('af-metric-card-mobile') as HTMLElement;
    const styles = getComputedStyle(card);

    expect(card.getAttribute('data-fill')).toBe('');
    expect(card.className).toContain('af-metric-card-mobile--fill');
    expect(styles.blockSize).toBe('100%');
    expect(styles.alignSelf).toBe('stretch');
  });
});
