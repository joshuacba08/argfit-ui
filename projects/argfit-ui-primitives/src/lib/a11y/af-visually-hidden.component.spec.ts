import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AfVisuallyHiddenComponent } from './af-visually-hidden.component';

@Component({
  imports: [AfVisuallyHiddenComponent],
  template: `<af-visually-hidden>Screen reader text</af-visually-hidden>`,
})
class AfVisuallyHiddenHostComponent {}

describe('AfVisuallyHiddenComponent', () => {
  it('projects accessible text into the primitive', async () => {
    await TestBed.configureTestingModule({
      imports: [AfVisuallyHiddenHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfVisuallyHiddenHostComponent);

    fixture.detectChanges();
    await fixture.whenStable();

    const primitive = fixture.nativeElement.querySelector('af-visually-hidden') as HTMLElement;
    expect(primitive.textContent?.trim()).toBe('Screen reader text');
  });
});
