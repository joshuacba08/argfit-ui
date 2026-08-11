import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  numberAttribute,
  output,
} from '@angular/core';

import {
  AfPlatformService,
  type AfCropAspectRatio,
  type AfImageCroppedEvent,
  type AfImageOutputFormat,
} from '@argfit-ui/core';
import { AfImageCropperDesktopComponent } from '@argfit-ui/desktop';
import { AfImageCropperMobileComponent } from '@argfit-ui/mobile';

/**
 * Image preview, crop, rotation and resize component.
 *
 * Chooses the desktop vs mobile renderer depending on current platform.
 */
@Component({
  selector: 'af-image-cropper',
  imports: [AfImageCropperDesktopComponent, AfImageCropperMobileComponent],
  templateUrl: './af-image-cropper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfImageCropperComponent {
  private readonly platform = inject(AfPlatformService);

  readonly src = input<File | Blob | string | null | undefined>(undefined);
  readonly aspectRatio = input<AfCropAspectRatio>('free');
  readonly maintainAspectRatio = input(false, { transform: booleanAttribute });
  readonly resizeWidth = input<number | undefined>(undefined);
  readonly resizeHeight = input<number | undefined>(undefined);
  readonly format = input<AfImageOutputFormat>('image/png');
  readonly quality = input(0.92, { transform: numberAttribute });
  readonly circularCrop = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly showControls = input(true, { transform: booleanAttribute });
  readonly fileName = input('cropped-image');

  readonly cropped = output<AfImageCroppedEvent>();
  readonly cancel = output<void>();
  readonly imageLoaded = output<{ width: number; height: number }>();
  readonly imageError = output<Error>();

  protected readonly isMobile = this.platform.isMobile;
}
