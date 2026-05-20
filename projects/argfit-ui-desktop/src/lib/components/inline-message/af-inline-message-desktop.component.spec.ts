import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AfInlineMessageDesktopComponent } from './af-inline-message-desktop.component';

@Component({
  imports: [AfInlineMessageDesktopComponent],
  template: `
    <af-inline-message-desktop
      severity="success"
      title="Firmware actualizado"
      description="Version 3.2.1 instalada."
    />
    <af-inline-message-desktop
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

describe('AfInlineMessageDesktopComponent', () => {
  it('renders status and alert roles and can be dismissed', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const messages = fixture.nativeElement.querySelectorAll('af-inline-message-desktop');
    expect(messages[0].getAttribute('role')).toBe('status');
    expect(messages[1].getAttribute('role')).toBe('alert');

    const close = messages[1].querySelector('.af-inline-message-desktop__close') as HTMLButtonElement;
    close.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.dismissed).toBe(true);
    expect(messages[1].getAttribute('role')).toBeNull();
  });
});
