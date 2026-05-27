import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

import {
  DeviceTransportError,
  type DeviceConnectionStatus,
  type DeviceDescriptor,
  type DeviceReadOptions,
  type DeviceRequestOptions,
  type DeviceSession,
  type DeviceTransport,
  type DeviceWriteOptions,
  type WebBluetoothDevice,
  type WebBluetoothNavigator,
  type WebBluetoothRequestDeviceOptions,
  type WebBluetoothRemoteGATTServer,
} from '../types/device-capabilities.types';

@Injectable({
  providedIn: 'root',
})
export class WebBluetoothTransport implements DeviceTransport {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly statusSignal = signal<DeviceConnectionStatus>('idle');
  private currentDevice: WebBluetoothDevice | null = null;
  private currentServer: WebBluetoothRemoteGATTServer | null = null;

  readonly kind = 'web-bluetooth' as const;
  readonly status = this.statusSignal.asReadonly();

  isSupported(): boolean {
    const view = this.document.defaultView;
    const navigator = view?.navigator as (Navigator & WebBluetoothNavigator) | undefined;

    return Boolean(isPlatformBrowser(this.platformId) && view?.isSecureContext && navigator?.bluetooth?.requestDevice);
  }

  async isAvailable(): Promise<boolean> {
    if (!this.isSupported()) {
      return false;
    }

    const navigator = this.document.defaultView?.navigator as Navigator & WebBluetoothNavigator;

    if (!navigator.bluetooth?.getAvailability) {
      return true;
    }

    return navigator.bluetooth.getAvailability();
  }

  async requestDevice(options: DeviceRequestOptions): Promise<DeviceDescriptor> {
    if (!this.isSupported()) {
      throw new DeviceTransportError('unsupported', 'Web Bluetooth is not available in this browser or origin.');
    }

    const requestOptions = this.toRequestOptions(options);
    const navigator = this.document.defaultView?.navigator as Navigator & WebBluetoothNavigator;

    this.statusSignal.set('scanning');

    try {
      const device = await navigator.bluetooth!.requestDevice(requestOptions);
      this.currentDevice = device;
      device.addEventListener?.('gattserverdisconnected', () => this.statusSignal.set('idle'));

      return this.toDescriptor(device);
    } catch (error) {
      this.statusSignal.set('idle');
      throw this.normalizeError(error);
    }
  }

  async connect(device?: DeviceDescriptor): Promise<DeviceSession> {
    if (!this.currentDevice) {
      throw new DeviceTransportError('gatt-unavailable', 'No Bluetooth device has been selected.');
    }

    if (device && device.id !== this.currentDevice.id) {
      throw new DeviceTransportError('gatt-unavailable', 'Selected Bluetooth device does not match the requested descriptor.');
    }

    if (!this.currentDevice.gatt) {
      throw new DeviceTransportError('gatt-unavailable', 'Selected Bluetooth device does not expose a GATT server.');
    }

    this.statusSignal.set('connecting');

    try {
      this.currentServer = await this.currentDevice.gatt.connect();
      this.statusSignal.set('connected');

      return {
        connectedAt: new Date(),
        device: this.toDescriptor(this.currentDevice),
        transport: this.kind,
      };
    } catch (error) {
      this.statusSignal.set('error');
      throw this.normalizeError(error);
    }
  }

  async disconnect(): Promise<void> {
    this.statusSignal.set('disconnecting');
    this.currentServer?.disconnect();
    this.currentServer = null;
    this.currentDevice = null;
    this.statusSignal.set('idle');
  }

  async read(options: DeviceReadOptions): Promise<DataView> {
    if (!this.currentServer?.connected) {
      throw new DeviceTransportError('device-disconnected', 'Bluetooth device is not connected.');
    }

    try {
      const service = await this.currentServer.getPrimaryService(options.service);
      const characteristic = await service.getCharacteristic(options.characteristic);
      return characteristic.readValue();
    } catch (error) {
      throw new DeviceTransportError('read-failed', 'Could not read from the Bluetooth characteristic.', error);
    }
  }

  async write(options: DeviceWriteOptions): Promise<void> {
    if (!this.currentServer?.connected) {
      throw new DeviceTransportError('device-disconnected', 'Bluetooth device is not connected.');
    }

    try {
      const service = await this.currentServer.getPrimaryService(options.service);
      const characteristic = await service.getCharacteristic(options.characteristic);
      await characteristic.writeValue(options.value);
    } catch (error) {
      throw new DeviceTransportError('write-failed', 'Could not write to the Bluetooth characteristic.', error);
    }
  }

  private toRequestOptions(options: DeviceRequestOptions): WebBluetoothRequestDeviceOptions {
    if (options.acceptAllDevices && !options.demoMode) {
      throw new DeviceTransportError('unsupported', 'acceptAllDevices is restricted to explicitly marked demo mode.');
    }

    if (!options.acceptAllDevices && (!options.filters || options.filters.length === 0)) {
      throw new DeviceTransportError('unsupported', 'Web Bluetooth requests require explicit filters.');
    }

    return {
      acceptAllDevices: options.acceptAllDevices,
      filters: options.filters,
      optionalServices: options.optionalServices,
    };
  }

  private toDescriptor(device: WebBluetoothDevice): DeviceDescriptor {
    return {
      id: device.id,
      name: device.name?.trim() || 'Unnamed BLE device',
      transport: this.kind,
    };
  }

  private normalizeError(error: unknown): DeviceTransportError {
    if (error instanceof DeviceTransportError) {
      return error;
    }

    if (error instanceof DOMException && error.name === 'NotFoundError') {
      return new DeviceTransportError('permission-dismissed', 'Device selection was cancelled.', error);
    }

    return new DeviceTransportError('unknown', error instanceof Error ? error.message : 'Unknown Bluetooth error.', error);
  }
}
