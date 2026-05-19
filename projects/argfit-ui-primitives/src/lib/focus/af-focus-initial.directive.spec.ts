import { Component, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AfFocusInitialDirective } from './af-focus-initial.directive';

@Component({
  imports: [AfFocusInitialDirective],
  template: `
    <div>
      <button type="button">other</button>
      <button type="button" afFocusInitial>preferred</button>
    </div>
  `,
})
class AfFocusInitialHostComponent {
  @ViewChild(AfFocusInitialDirective, { static: true })
  initial!: AfFocusInitialDirective;
}

describe('AfFocusInitialDirective', () => {
  it('exposes the marked element through elementRef', async () => {
    await TestBed.configureTestingModule({
      imports: [AfFocusInitialHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfFocusInitialHostComponent);
    fixture.detectChanges();

    const native = fixture.componentInstance.initial.elementRef.nativeElement;
    expect(native.tagName).toBe('BUTTON');
    expect(native.textContent?.trim()).toBe('preferred');
  });
});
