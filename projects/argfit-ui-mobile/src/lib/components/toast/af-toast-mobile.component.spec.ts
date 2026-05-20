import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type { AfToast } from '@argfit-ui/core';

import { AfToastMobileComponent } from './af-toast-mobile.component';

@Component({
  imports: [AfToastMobileComponent],
  template: `
    <af-toast-mobile
      [toast]="toast"
      closeLabel="Cerrar mobile toast"
      (dismissed)="dismissedId = $event"
    />
  `,
})
class HostComponent {
  readonly toast: AfToast = {
    id: 'toast-mobile-1',
    title: 'Bateria baja',
    description: '15% restante.',
    severity: 'warning',
    duration: 4000,
    persistent: false,
  };
  dismissedId: string | null = null;
}

describe('AfToastMobileComponent', () => {
  it('renders severity and close action', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const toast = fixture.nativeElement.querySelector('af-toast-mobile') as HTMLElement;
    expect(toast.getAttribute('data-severity')).toBe('warning');
    expect(toast.getAttribute('role')).toBe('alert');
    expect(toast.textContent).toContain('Bateria baja');

    const close = toast.querySelector('.af-toast-mobile__close') as HTMLButtonElement;
    expect(close.getAttribute('aria-label')).toBe('Cerrar mobile toast');
    close.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.dismissedId).toBe('toast-mobile-1');
  });
});
