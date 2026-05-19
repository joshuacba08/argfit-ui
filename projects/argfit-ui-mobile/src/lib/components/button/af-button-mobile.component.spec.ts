import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AfButtonMobileComponent } from './af-button-mobile.component';

@Component({
  imports: [AfButtonMobileComponent],
  template: `<af-button-mobile variant="secondary">Continue</af-button-mobile>`,
})
class AfButtonMobileHostComponent {}

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
});
