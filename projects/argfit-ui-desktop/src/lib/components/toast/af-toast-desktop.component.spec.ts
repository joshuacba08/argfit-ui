import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type { AfToast } from '@argfit-ui/core';

import { AfToastDesktopComponent } from './af-toast-desktop.component';

@Component({
  imports: [AfToastDesktopComponent],
  template: `
    <af-toast-desktop
      [toast]="toast"
      closeLabel="Cerrar toast"
      (dismissed)="dismissedId = $event"
    />
  `,
})
class HostComponent {
  readonly toast: AfToast = {
    id: 'toast-1',
    title: 'Error BLE',
    description: 'No se pudo conectar.',
    severity: 'danger',
    duration: 4000,
    persistent: false,
  };
  dismissedId: string | null = null;
}

describe('AfToastDesktopComponent', () => {
  it('renders severity, title, description and close action', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const toast = fixture.nativeElement.querySelector('af-toast-desktop') as HTMLElement;
    expect(toast.getAttribute('data-severity')).toBe('danger');
    expect(toast.getAttribute('role')).toBe('alert');
    expect(toast.getAttribute('aria-live')).toBe('assertive');
    expect(toast.getAttribute('aria-atomic')).toBe('true');
    expect(toast.textContent).toContain('Error BLE');
    expect(toast.textContent).toContain('No se pudo conectar.');

    const close = toast.querySelector('.af-toast-desktop__close') as HTMLButtonElement;
    expect(close.getAttribute('aria-label')).toBe('Cerrar toast');
    close.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.dismissedId).toBe('toast-1');
  });

  it('uses polite live regions for non assertive severities', async () => {
    @Component({
      imports: [AfToastDesktopComponent],
      template: `<af-toast-desktop [toast]="toast" />`,
    })
    class InfoHostComponent {
      readonly toast: AfToast = {
        id: 'toast-2',
        title: 'Sincronizado',
        severity: 'info',
        duration: 4000,
        persistent: false,
      };
    }

    await TestBed.configureTestingModule({ imports: [InfoHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(InfoHostComponent);
    fixture.detectChanges();

    const toast = fixture.nativeElement.querySelector('af-toast-desktop') as HTMLElement;
    expect(toast.getAttribute('role')).toBe('status');
    expect(toast.getAttribute('aria-live')).toBe('polite');
  });
});
