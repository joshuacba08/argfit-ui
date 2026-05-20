import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideArgfitUi } from '@argfit-ui/core';

import { AfMetricCardComponent } from './af-metric-card.component';

@Component({
  imports: [AfMetricCardComponent],
  template: `
    <af-metric-card
      label="Sesiones"
      value="247"
      unit="mes"
      icon="file-text"
      tone="accent"
      trendValue="8%"
      trendDirection="up"
      [interactive]="true"
      (pressed)="pressed = $event"
    />
  `,
})
class AfMetricCardHostComponent {
  pressed: MouseEvent | KeyboardEvent | undefined;
}

describe('AfMetricCardComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders desktop and passes basic inputs', async () => {
    await TestBed.configureTestingModule({
      imports: [AfMetricCardHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfMetricCardHostComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const card = root.querySelector('af-metric-card-desktop') as HTMLElement;

    expect(card).not.toBeNull();
    expect(root.querySelector('af-metric-card-mobile')).toBeNull();
    expect(card.textContent).toContain('Sesiones');
    expect(card.textContent).toContain('247');
  });

  it('renders mobile and reemits pressed', async () => {
    await TestBed.configureTestingModule({
      imports: [AfMetricCardHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfMetricCardHostComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const card = root.querySelector('af-metric-card-mobile') as HTMLElement;

    expect(card).not.toBeNull();
    expect(root.querySelector('af-metric-card-desktop')).toBeNull();

    card.click();
    expect(fixture.componentInstance.pressed).toBeTruthy();
  });
});
