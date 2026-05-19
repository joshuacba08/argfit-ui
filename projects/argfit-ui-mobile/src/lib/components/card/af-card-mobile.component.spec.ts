import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AfCardMobileComponent } from './af-card-mobile.component';

@Component({
  imports: [AfCardMobileComponent],
  template: `
    <af-card-mobile variant="device" density="compact" tone="success" [interactive]="true">
      <span>Projected device</span>
    </af-card-mobile>
  `,
})
class AfCardMobileHostComponent {}

describe('AfCardMobileComponent', () => {
  it('projects content and reflects inputs as host classes/attrs', async () => {
    await TestBed.configureTestingModule({
      imports: [AfCardMobileHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfCardMobileHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('af-card-mobile') as HTMLElement;
    expect(host).toBeTruthy();
    expect(host.textContent?.trim()).toBe('Projected device');
    expect(host.classList.contains('af-card-mobile--device')).toBe(true);
    expect(host.classList.contains('af-card-mobile--density-compact')).toBe(true);
    expect(host.classList.contains('af-card-mobile--tone-success')).toBe(true);
    expect(host.classList.contains('af-card-mobile--interactive')).toBe(true);
    expect(host.getAttribute('data-variant')).toBe('device');
    expect(host.getAttribute('role')).toBe('button');
    expect(host.getAttribute('aria-pressed')).toBe('false');
  });

  it('renders a non-interactive comfortable surface by default', async () => {
    @Component({
      imports: [AfCardMobileComponent],
      template: `<af-card-mobile>Hello</af-card-mobile>`,
    })
    class DefaultHost {}

    await TestBed.configureTestingModule({ imports: [DefaultHost] }).compileComponents();

    const fixture = TestBed.createComponent(DefaultHost);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('af-card-mobile') as HTMLElement;
    expect(host.classList.contains('af-card-mobile--surface')).toBe(true);
    expect(host.classList.contains('af-card-mobile--density-comfortable')).toBe(true);
    expect(host.classList.contains('af-card-mobile--interactive')).toBe(false);
  });
});
