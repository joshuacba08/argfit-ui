import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AfInlineMessageMobileComponent } from './af-inline-message-mobile.component';

@Component({
  imports: [AfInlineMessageMobileComponent],
  template: `
    <af-inline-message-mobile
      severity="success"
      title="Firmware actualizado"
      description="Version 3.2.1 instalada."
    />
    <af-inline-message-mobile
      severity="warning"
      title="Sesion sin finalizar"
      description="Existe una sesion sin guardar."
      [closable]="true"
      (dismissed)="dismissed = true"
    />
  `,
})
class HostComponent {
  dismissed = false;
}

describe('AfInlineMessageMobileComponent', () => {
  it('renders status and alert live regions and can be dismissed', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const messages = fixture.nativeElement.querySelectorAll('af-inline-message-mobile');
    expect(messages[0].getAttribute('role')).toBe('status');
    expect(messages[0].getAttribute('aria-live')).toBe('polite');
    expect(messages[1].getAttribute('role')).toBe('alert');
    expect(messages[1].getAttribute('aria-live')).toBe('assertive');
    expect(messages[1].getAttribute('aria-atomic')).toBe('true');

    const close = messages[1].querySelector('.af-inline-message-mobile__close') as HTMLButtonElement;
    close.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.dismissed).toBe(true);
    expect(messages[1].getAttribute('role')).toBeNull();
    expect(messages[1].getAttribute('aria-live')).toBeNull();
  });
});
