import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { AfToastService } from './toast.service';

describe('AfToastService', () => {
  let service: AfToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AfToastService);
  });

  afterEach(() => {
    service.clear();
    vi.useRealTimers();
    TestBed.resetTestingModule();
  });

  it('adds typed toasts through severity helpers', () => {
    const id = service.success({
      title: 'Sesion guardada',
      description: '12 saltos registrados.',
      duration: 0,
    });

    expect(id).toBe('af-toast-1');
    expect(service.toasts()).toEqual([
      {
        id,
        title: 'Sesion guardada',
        description: '12 saltos registrados.',
        severity: 'success',
        duration: 0,
        persistent: true,
      },
    ]);
  });

  it('removes a toast manually', () => {
    const id = service.info({ title: 'Dispositivo sincronizado', duration: 0 });

    service.dismiss(id);

    expect(service.toasts()).toEqual([]);
  });

  it('auto closes non persistent toasts after duration', () => {
    vi.useFakeTimers();
    service.warning({ title: 'Bateria baja', duration: 50 });

    expect(service.toasts().length).toBe(1);
    vi.advanceTimersByTime(49);
    expect(service.toasts().length).toBe(1);
    vi.advanceTimersByTime(1);
    expect(service.toasts()).toEqual([]);
  });

  it('keeps persistent and duration zero toasts visible until cleared', () => {
    vi.useFakeTimers();
    service.info({ title: 'Sticky', persistent: true });
    service.danger({ title: 'Error BLE', duration: 0 });

    vi.advanceTimersByTime(5000);

    expect(service.toasts().map((toast) => toast.title)).toEqual(['Sticky', 'Error BLE']);

    service.clear();

    expect(service.toasts()).toEqual([]);
  });
});
