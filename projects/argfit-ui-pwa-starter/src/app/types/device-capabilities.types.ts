export type DeviceConnectionStatus =
  | 'idle'
  | 'unsupported'
  | 'scanning'
  | 'connecting'
  | 'connected'
  | 'disconnecting'
  | 'error';

export type DeviceTransportKind = 'web-bluetooth' | 'native-bridge';

export type DeviceErrorCode =
  | 'unsupported'
  | 'not-secure'
  | 'permission-dismissed'
  | 'device-disconnected'
  | 'gatt-unavailable'
  | 'read-failed'
  | 'write-failed'
  | 'native-unavailable'
  | 'unknown';

export type StandardBluetoothService = 'battery_service' | 'device_information' | 'heart_rate';
export type BluetoothServiceId = StandardBluetoothService | string | number;
export type BluetoothCharacteristicId = string | number;

export interface DeviceCapabilities {
  readonly pwaInstallable: boolean;
  readonly standaloneDisplay: boolean;
  readonly online: boolean;
  readonly secureContext: boolean;
  readonly webBluetoothSupported: boolean;
  readonly webBluetoothAvailable: boolean;
  readonly nativeBridgeSupported: boolean;
}

export interface WebBluetoothFilter {
  readonly name?: string;
  readonly namePrefix?: string;
  readonly services?: readonly BluetoothServiceId[];
}

export interface DeviceRequestOptions {
  readonly filters?: readonly WebBluetoothFilter[];
  readonly optionalServices?: readonly BluetoothServiceId[];
  readonly acceptAllDevices?: boolean;
  readonly demoMode?: boolean;
}

export interface DeviceDescriptor {
  readonly id: string;
  readonly name: string;
  readonly transport: DeviceTransportKind;
}

export interface DeviceSession {
  readonly device: DeviceDescriptor;
  readonly connectedAt: Date;
  readonly transport: DeviceTransportKind;
}

export interface DeviceReadOptions {
  readonly service: BluetoothServiceId;
  readonly characteristic: BluetoothCharacteristicId;
}

export interface DeviceWriteOptions extends DeviceReadOptions {
  readonly value: BufferSource;
}

export interface DeviceTransport {
  readonly kind: DeviceTransportKind;
  isSupported(): boolean;
  requestDevice(options: DeviceRequestOptions): Promise<DeviceDescriptor>;
  connect(device?: DeviceDescriptor): Promise<DeviceSession>;
  disconnect(): Promise<void>;
  read(options: DeviceReadOptions): Promise<DataView>;
  write(options: DeviceWriteOptions): Promise<void>;
}

export interface WebBluetoothNavigator {
  readonly bluetooth?: {
    getAvailability?: () => Promise<boolean>;
    requestDevice: (options: WebBluetoothRequestDeviceOptions) => Promise<WebBluetoothDevice>;
  };
}

export interface WebBluetoothRequestDeviceOptions {
  readonly filters?: readonly WebBluetoothFilter[];
  readonly optionalServices?: readonly BluetoothServiceId[];
  readonly acceptAllDevices?: boolean;
}

export interface WebBluetoothDevice extends EventTarget {
  readonly id: string;
  readonly name?: string;
  readonly gatt?: WebBluetoothRemoteGATTServer;
}

export interface WebBluetoothRemoteGATTServer {
  readonly connected: boolean;
  connect(): Promise<WebBluetoothRemoteGATTServer>;
  disconnect(): void;
  getPrimaryService(service: BluetoothServiceId): Promise<WebBluetoothRemoteGATTService>;
}

export interface WebBluetoothRemoteGATTService {
  getCharacteristic(characteristic: BluetoothCharacteristicId): Promise<WebBluetoothRemoteGATTCharacteristic>;
}

export interface WebBluetoothRemoteGATTCharacteristic {
  readValue(): Promise<DataView>;
  writeValue(value: BufferSource): Promise<void>;
}

export class DeviceTransportError extends Error {
  override readonly cause?: unknown;

  constructor(
    readonly code: DeviceErrorCode,
    message: string,
    cause?: unknown,
  ) {
    super(message);
    this.name = 'DeviceTransportError';
    this.cause = cause;
  }
}

export function isDeviceTransportError(error: unknown): error is DeviceTransportError {
  return error instanceof DeviceTransportError;
}
