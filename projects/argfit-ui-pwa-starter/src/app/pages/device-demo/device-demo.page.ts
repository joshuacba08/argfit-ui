import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import {
  AfBadge,
  AfButton,
  AfCard,
  AfInlineMessage,
  AfMetricCard,
  AfProgress,
} from '@argfit-ui/adaptive';
import type { AfBadgeTone } from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

import { DeviceConnectionService } from '../../services/device-connection.service';

@Component({
  selector: 'app-device-demo-page',
  imports: [AfBadge, AfButton, AfCard, AfIconComponent, AfInlineMessage, AfMetricCard, AfProgress],
  templateUrl: './device-demo.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceDemoPage {
  protected readonly devices = inject(DeviceConnectionService);
  protected readonly capabilities = this.devices.capabilities;
  protected readonly status = this.devices.status;
  protected readonly device = this.devices.device;
  protected readonly session = this.devices.session;
  protected readonly error = this.devices.error;
  protected readonly lastPayload = this.devices.lastPayload;
  protected readonly canUseWebBluetooth = this.devices.canUseWebBluetooth;
  protected readonly connectionProgress = computed(() => {
    switch (this.status()) {
      case 'scanning':
        return 38;
      case 'connecting':
        return 68;
      case 'connected':
        return 100;
      case 'disconnecting':
        return 18;
      default:
        return 0;
    }
  });
  protected readonly connectionLabel = computed(() => {
    switch (this.status()) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting';
      case 'scanning':
        return 'Scanning';
      case 'unsupported':
        return 'Unsupported';
      case 'error':
        return 'Needs attention';
      default:
        return 'Ready';
    }
  });
  protected readonly connectionTone = computed<AfBadgeTone>(() => {
    switch (this.status()) {
      case 'connected':
        return 'success';
      case 'unsupported':
      case 'error':
        return 'warning';
      default:
        return 'primary';
    }
  });

  connect(): void {
    this.devices.connectWebBluetoothDemo();
  }

  disconnect(): void {
    void this.devices.disconnect();
  }

  refresh(): void {
    this.devices.refreshAvailability();
  }
}
