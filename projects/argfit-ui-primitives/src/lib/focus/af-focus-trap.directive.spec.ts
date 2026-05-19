import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AfFocusInitialDirective } from './af-focus-initial.directive';
import { AfFocusTrapDirective } from './af-focus-trap.directive';

@Component({
  imports: [AfFocusTrapDirective, AfFocusInitialDirective],
  template: `
    <button type="button" id="outside">outside</button>
    <section afFocusTrap [afFocusTrapEnabled]="enabled()">
      <button type="button" id="first">first</button>
      <button type="button" id="second" afFocusInitial>second</button>
      <button type="button" id="third">third</button>
    </section>
  `,
})
class AfFocusTrapHostComponent {
  readonly enabled = signal(false);
}

@Component({
  imports: [AfFocusTrapDirective],
  template: `
    <button type="button" id="outside">outside</button>
    <section afFocusTrap [afFocusTrapEnabled]="enabled()">
      <button type="button" id="alpha">alpha</button>
      <button type="button" id="beta">beta</button>
    </section>
  `,
})
class AfFocusTrapNoInitialHostComponent {
  readonly enabled = signal(false);
}

function flush(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 16));
}

describe('AfFocusTrapDirective', () => {
  it('moves focus to the afFocusInitial element when enabled', async () => {
    await TestBed.configureTestingModule({
      imports: [AfFocusTrapHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfFocusTrapHostComponent);
    fixture.detectChanges();

    const outside = fixture.nativeElement.querySelector('#outside') as HTMLButtonElement;
    document.body.appendChild(fixture.nativeElement);
    outside.focus();
    expect(document.activeElement).toBe(outside);

    fixture.componentInstance.enabled.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    await flush();

    expect(document.activeElement?.id).toBe('second');

    fixture.destroy();
  });

  it('falls back to the first tabbable element without afFocusInitial', async () => {
    await TestBed.configureTestingModule({
      imports: [AfFocusTrapNoInitialHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfFocusTrapNoInitialHostComponent);
    fixture.detectChanges();
    document.body.appendChild(fixture.nativeElement);

    fixture.componentInstance.enabled.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    await flush();

    expect(document.activeElement?.id).toBe('alpha');

    fixture.destroy();
  });
});
