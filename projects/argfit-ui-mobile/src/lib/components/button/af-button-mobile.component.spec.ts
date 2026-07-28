import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AfButtonMobileComponent } from './af-button-mobile.component';

@Component({
  imports: [AfButtonMobileComponent],
  template: `<af-button-mobile variant="secondary">Continue</af-button-mobile>`,
})
class AfButtonMobileHostComponent {}

@Component({
  imports: [AfButtonMobileComponent],
  template: `<af-button-mobile fullWidth>Continue</af-button-mobile>`,
})
class AfButtonMobileFullWidthHostComponent {}

@Component({
  imports: [AfButtonMobileComponent],
  template: `<af-button-mobile icon="log-in" iconPosition="end">Ingresar</af-button-mobile>`,
})
class AfButtonMobileIconHostComponent {}

describe('AfButtonMobileComponent', () => {
  it('renders projected button content with the requested variant', async () => {
    await TestBed.configureTestingModule({
      imports: [AfButtonMobileHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfButtonMobileHostComponent);

    fixture.detectChanges();
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector('ion-button') as HTMLElement;
    expect(button.textContent?.trim()).toBe('Continue');
    expect(button.classList).toContain('af-button-mobile--secondary');
  });

  it('stretches the Ionic button when fullWidth is requested', async () => {
    await TestBed.configureTestingModule({
      imports: [AfButtonMobileFullWidthHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfButtonMobileFullWidthHostComponent);

    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('af-button-mobile') as HTMLElement;
    const button = host.querySelector('ion-button') as HTMLElement;

    expect(host.classList).toContain('af-button-host-full');
    expect(getComputedStyle(button).width).toBe('100%');
  });

  it('renders a decorative trailing icon from the shared icon registry', async () => {
    await TestBed.configureTestingModule({
      imports: [AfButtonMobileIconHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfButtonMobileIconHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector('ion-button') as HTMLElement;
    const icon = button.querySelector('af-icon') as HTMLElement;

    expect(button.lastElementChild).toBe(icon);
    expect(icon.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });
});
