import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';

import { InstallPromptService } from './install-prompt.service';
import { NetworkStatusService } from './network-status.service';
import { NativeDeviceTransport } from './native-device-transport';
import { WebBluetoothTransport } from './ble-transport';
import {
  DeviceTransportError,
  isDeviceTransportError,
  type DeviceCapabilities,
  type DeviceConnectionStatus,
  type DeviceDescriptor,
  type DeviceRequestOptions,
  type DeviceSession,
  type WebBluetoothNavigator,
} from '../types/device-capabilities.types';

const DEMO_BLE_REQUEST: DeviceRequestOptions = {
  filters: [
    {
      services: ['battery_service'],
    },
  ],
  optionalServices: ['device_information'],
  demoMode: true,
};

@Injectable({
  providedIn: 'root',
})
export class DeviceConnectionService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly installPrompt = inject(InstallPromptService);
  private readonly network = inject(NetworkStatusService);
  private readonly webBluetooth = inject(WebBluetoothTransport);
  private readonly nativeTransport = inject(NativeDeviceTransport);
  private readonly statusSignal = signal<DeviceConnectionStatus>('idle');
  private readonly deviceSignal = signal<DeviceDescriptor | null>(null);
  private readonly sessionSignal = signal<DeviceSession | null>(null);
  private readonly errorSignal = signal<DeviceTransportError | null>(null);
  private readonly webBluetoothAvailableSignal = signal(false);
  private readonly lastPayloadSignal = signal<string>('No device payload captured yet.');

  readonly status = this.statusSignal.asReadonly();
  readonly device = this.deviceSignal.asReadonly();
  readonly session = this.sessionSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly lastPayload = this.lastPayloadSignal.asReadonly();
  readonly capabilities = computed<DeviceCapabilities>(() => ({
    pwaInstallable: this.installPrompt.canPrompt(),
    standaloneDisplay: this.installPrompt.standaloneDisplay(),
    online: this.network.online(),
    secureContext: this.isSecureContext(),
    webBluetoothSupported: this.isWebBluetoothSupported(),
    webBluetoothAvailable: this.webBluetoothAvailableSignal(),
    nativeBridgeSupported: this.nativeTransport.isSupported(),
  }));
  readonly canUseWebBluetooth = computed(() => {
    const capabilities = this.capabilities();
    return capabilities.secureContext && capabilities.webBluetoothSupported && capabilities.webBluetoothAvailable;
  });

  constructor() {
    void this.refreshAvailability();
  }

  refreshAvailability(): void {
    void this.webBluetooth.isAvailable().then((available) => {
      this.webBluetoothAvailableSignal.set(available);

      if (!available && this.statusSignal() === 'idle') {
        this.statusSignal.set('unsupported');
      }
    });
  }

  connectWebBluetoothDemo(): void {
    this.errorSignal.set(null);

    if (!this.isSecureContext()) {
      this.fail(new DeviceTransportError('not-secure', 'Use HTTPS, localhost or 127.0.0.1 to access Web Bluetooth.'));
      return;
    }

    if (!this.webBluetooth.isSupported()) {
      this.fail(new DeviceTransportError('unsupported', 'Web Bluetooth is not available in this browser.'));
      return;
    }

    this.statusSignal.set('scanning');

    void this.webBluetooth.requestDevice(DEMO_BLE_REQUEST)
      .then((device) => {
        this.deviceSignal.set(device);
        this.statusSignal.set('connecting');
        return this.webBluetooth.connect(device);
      })
      .then((session) => {
        this.sessionSignal.set(session);
        this.deviceSignal.set(session.device);
        this.statusSignal.set('connected');
        this.lastPayloadSignal.set(`Connected to ${session.device.name} through ${session.transport}.`);
      })
      .catch((error: unknown) => this.fail(error));
  }

  async disconnect(): Promise<void> {
    this.statusSignal.set('disconnecting');
    await this.webBluetooth.disconnect();
    this.sessionSignal.set(null);
    this.deviceSignal.set(null);
    this.statusSignal.set(this.canUseWebBluetooth() ? 'idle' : 'unsupported');
    this.lastPayloadSignal.set('Device disconnected.');
  }

  private fail(error: unknown): void {
    const transportError = isDeviceTransportError(error)
      ? error
      : new DeviceTransportError('unknown', error instanceof Error ? error.message : String(error), error);

    this.errorSignal.set(transportError);
    this.statusSignal.set(transportError.code === 'unsupported' || transportError.code === 'not-secure' ? 'unsupported' : 'error');
  }

  private isSecureContext(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    return Boolean(this.document.defaultView?.isSecureContext);
  }

  private isWebBluetoothSupported(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const navigator = this.document.defaultView?.navigator as (Navigator & WebBluetoothNavigator) | undefined;
    return Boolean(navigator?.bluetooth?.requestDevice);
  }
}
