import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AfEscapeKeyDirective } from './af-escape-key.directive';

@Component({
  imports: [AfEscapeKeyDirective],
  template: `
    <section afEscapeKey (afEscape)="onEscape()">
      <button type="button">child</button>
    </section>
  `,
})
class AfEscapeKeyHostComponent {
  escapeCount = 0;
  onEscape(): void {
    this.escapeCount += 1;
  }
}

function dispatchKey(target: Element, key: string): void {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

describe('AfEscapeKeyDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfEscapeKeyHostComponent],
    }).compileComponents();
  });

  it('emits afEscape when Escape is pressed on the host', () => {
    const fixture = TestBed.createComponent(AfEscapeKeyHostComponent);
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('section') as HTMLElement;
    dispatchKey(section, 'Escape');

    expect(fixture.componentInstance.escapeCount).toBe(1);
  });

  it('emits afEscape when Escape bubbles from a child element', () => {
    const fixture = TestBed.createComponent(AfEscapeKeyHostComponent);
    fixture.detectChanges();

    const child = fixture.nativeElement.querySelector('button') as HTMLElement;
    dispatchKey(child, 'Escape');

    expect(fixture.componentInstance.escapeCount).toBe(1);
  });

  it('ignores other keys', () => {
    const fixture = TestBed.createComponent(AfEscapeKeyHostComponent);
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('section') as HTMLElement;
    dispatchKey(section, 'Enter');
    dispatchKey(section, 'a');
    dispatchKey(section, ' ');

    expect(fixture.componentInstance.escapeCount).toBe(0);
  });
});
