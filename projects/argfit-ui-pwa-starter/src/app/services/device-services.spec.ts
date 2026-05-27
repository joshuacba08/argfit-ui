import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { SwUpdate, type VersionEvent } from '@angular/service-worker';

import { WebBluetoothTransport } from './ble-transport';
import { DeviceConnectionService } from './device-connection.service';
import { InstallPromptService } from './install-prompt.service';
import { NativeDeviceTransport } from './native-device-transport';
import { NetworkStatusService } from './network-status.service';
import { PwaUpdateService } from './pwa-update.service';
import type {
  DeviceDescriptor,
  DeviceRequestOptions,
  DeviceSession,
  WebBluetoothDevice,
} from '../types/device-capabilities.types';

function defineGlobalProperty(target: object, key: PropertyKey, value: unknown): void {
  Object.defineProperty(target, key, {
    configurable: true,
    value,
  });
}

describe('PWA starter services', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
    defineGlobalProperty(window, 'isSecureContext', undefined);
    defineGlobalProperty(window.navigator, 'bluetooth', undefined);
  });

  it('tracks install prompt availability and user choice', async () => {
    const service = TestBed.inject(InstallPromptService);
    const prompt = vi.fn().mockResolvedValue(undefined);
    const event = new Event('beforeinstallprompt', { cancelable: true }) as Event & {
      prompt: () => Promise<void>;
      userChoice: Promise<{ outcome: 'accepted'; platform: string }>;
    };

    event.prompt = prompt;
    event.userChoice = Promise.resolve({ outcome: 'accepted', platform: 'web' });
    window.dispatchEvent(event);

    expect(service.canPrompt()).toBe(true);
    await expect(service.promptInstall()).resolves.toBe('accepted');
    expect(prompt).toHaveBeenCalledOnce();
    expect(service.canPrompt()).toBe(false);
    expect(service.outcome()).toBe('accepted');
  });

  it('tracks online state as a boolean capability', () => {
    const service = TestBed.inject(NetworkStatusService);

    expect(typeof service.online()).toBe('boolean');
  });

  it('maps service worker version readiness to update availability', () => {
    const updates = new Subject<VersionEvent>();

    TestBed.configureTestingModule({
      providers: [
        {
          provide: SwUpdate,
          useValue: {
            isEnabled: true,
            versionUpdates: updates.asObservable(),
            checkForUpdate: vi.fn().mockResolvedValue(false),
            activateUpdate: vi.fn().mockResolvedValue(undefined),
          },
        },
      ],
    });

    const service = TestBed.inject(PwaUpdateService);
    updates.next({
      type: 'VERSION_READY',
      currentVersion: { hash: 'old' },
      latestVersion: { hash: 'new' },
    });

    expect(service.status()).toBe('available');
    expect(service.updateAvailable()).toBe(true);
  });

  it('keeps the native transport as a documented stub', async () => {
    const transport = TestBed.inject(NativeDeviceTransport);

    expect(transport.kind).toBe('native-bridge');
    await expect(transport.requestDevice({})).rejects.toMatchObject({ code: 'native-unavailable' });
  });

  it('requests and connects a mocked Web Bluetooth device', async () => {
    defineGlobalProperty(window, 'isSecureContext', true);

    const fakeServer = {
      connected: true,
      connect: vi.fn().mockResolvedValue(undefined),
      disconnect: vi.fn(),
      getPrimaryService: vi.fn(),
    };
    fakeServer.connect.mockResolvedValue(fakeServer);

    const fakeDevice: WebBluetoothDevice = Object.assign(new EventTarget(), {
      id: 'battery-strap',
      name: 'Battery Strap',
      gatt: fakeServer,
    });
    const requestDevice = vi.fn().mockResolvedValue(fakeDevice);

    defineGlobalProperty(window.navigator, 'bluetooth', {
      getAvailability: vi.fn().mockResolvedValue(true),
      requestDevice,
    });

    const transport = TestBed.inject(WebBluetoothTransport);
    const descriptor = await transport.requestDevice({
      filters: [{ services: ['battery_service'] }],
      optionalServices: ['device_information'],
    });
    const session = await transport.connect(descriptor);

    expect(transport.isSupported()).toBe(true);
    expect(requestDevice).toHaveBeenCalledWith({
      acceptAllDevices: undefined,
      filters: [{ services: ['battery_service'] }],
      optionalServices: ['device_information'],
    });
    expect(descriptor).toEqual({
      id: 'battery-strap',
      name: 'Battery Strap',
      transport: 'web-bluetooth',
    });
    expect(session.device.name).toBe('Battery Strap');
    expect(transport.status()).toBe('connected');
  });

  it('connects through the device connection facade without putting hardware APIs in core', async () => {
    defineGlobalProperty(window, 'isSecureContext', true);
    defineGlobalProperty(window.navigator, 'bluetooth', {
      requestDevice: vi.fn(),
    });

    const descriptor: DeviceDescriptor = {
      id: 'demo-device',
      name: 'Demo BLE Device',
      transport: 'web-bluetooth',
    };
    const session: DeviceSession = {
      connectedAt: new Date('2026-05-27T00:00:00.000Z'),
      device: descriptor,
      transport: 'web-bluetooth',
    };
    const fakeTransport = {
      kind: 'web-bluetooth',
      isSupported: vi.fn().mockReturnValue(true),
      isAvailable: vi.fn().mockResolvedValue(true),
      requestDevice: vi.fn((_options: DeviceRequestOptions) => Promise.resolve(descriptor)),
      connect: vi.fn().mockResolvedValue(session),
      disconnect: vi.fn().mockResolvedValue(undefined),
      read: vi.fn(),
      write: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: WebBluetoothTransport,
          useValue: fakeTransport,
        },
      ],
    });

    const service = TestBed.inject(DeviceConnectionService);
    await Promise.resolve();
    service.connectWebBluetoothDemo();
    await Promise.resolve();
    await Promise.resolve();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(fakeTransport.requestDevice).toHaveBeenCalledWith({
      filters: [{ services: ['battery_service'] }],
      optionalServices: ['device_information'],
      demoMode: true,
    });
    expect(service.status()).toBe('connected');
    expect(service.device()?.name).toBe('Demo BLE Device');
    expect(service.capabilities().webBluetoothSupported).toBe(true);
  });
});
