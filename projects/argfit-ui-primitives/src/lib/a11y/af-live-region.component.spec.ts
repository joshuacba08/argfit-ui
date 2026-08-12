import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AfLiveRegionComponent } from './af-live-region.component';

@Component({
  imports: [AfLiveRegionComponent],
  template: `<af-live-region [message]="message()" [politeness]="politeness()" />`,
})
class AfLiveRegionHostComponent {
  readonly message = signal('');
  readonly politeness = signal<'polite' | 'assertive'>('polite');
}

describe('AfLiveRegionComponent', () => {
  const render = async () => {
    await TestBed.configureTestingModule({
      imports: [AfLiveRegionHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfLiveRegionHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    return {
      fixture,
      region: fixture.nativeElement.querySelector('af-live-region') as HTMLElement,
    };
  };

  it('mounts empty and polite so the container exists before the first message', async () => {
    const { region } = await render();

    expect(region.textContent?.trim()).toBe('');
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.getAttribute('aria-atomic')).toBe('true');
    expect(region.getAttribute('role')).toBe('status');
  });

  it('announces a message without replacing the container', async () => {
    const { fixture, region } = await render();

    fixture.componentInstance.message.set('Entrenamiento movido a Mié 09:30');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(region.textContent?.trim()).toBe('Entrenamiento movido a Mié 09:30');
    expect(fixture.nativeElement.querySelector('af-live-region')).toBe(region);
  });

  it('escalates to assertive on request', async () => {
    const { fixture, region } = await render();

    fixture.componentInstance.politeness.set('assertive');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(region.getAttribute('aria-live')).toBe('assertive');
  });

  it('stays in the accessibility tree instead of being display:none', async () => {
    const { region } = await render();

    const styles = getComputedStyle(region);
    expect(styles.display).not.toBe('none');
    expect(styles.visibility).not.toBe('hidden');
  });
});
