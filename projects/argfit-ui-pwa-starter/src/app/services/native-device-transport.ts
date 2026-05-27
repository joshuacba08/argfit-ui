import { Injectable, signal } from '@angular/core';

import {
  DeviceTransportError,
  type DeviceConnectionStatus,
  type DeviceDescriptor,
  type DeviceReadOptions,
  type DeviceRequestOptions,
  type DeviceSession,
  type DeviceTransport,
  type DeviceWriteOptions,
} from '../types/device-capabilities.types';

@Injectable({
  providedIn: 'root',
})
export class NativeDeviceTransport implements DeviceTransport {
  private readonly statusSignal = signal<DeviceConnectionStatus>('unsupported');

  readonly kind = 'native-bridge' as const;
  readonly status = this.statusSignal.asReadonly();

  isSupported(): boolean {
    return Boolean((globalThis as { Capacitor?: unknown }).Capacitor);
  }

  requestDevice(_options: DeviceRequestOptions): Promise<DeviceDescriptor> {
    return Promise.reject(this.unavailable());
  }

  connect(_device?: DeviceDescriptor): Promise<DeviceSession> {
    return Promise.reject(this.unavailable());
  }

  disconnect(): Promise<void> {
    return Promise.resolve();
  }

  read(_options: DeviceReadOptions): Promise<DataView> {
    return Promise.reject(this.unavailable());
  }

  write(_options: DeviceWriteOptions): Promise<void> {
    return Promise.reject(this.unavailable());
  }

  private unavailable(): DeviceTransportError {
    return new DeviceTransportError(
      'native-unavailable',
      'Native device bridge is not installed. Add a Capacitor BLE implementation in the app shell to enable this transport.',
    );
  }
}
