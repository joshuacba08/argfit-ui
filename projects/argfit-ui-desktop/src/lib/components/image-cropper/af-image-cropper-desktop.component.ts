import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  effect,
  input,
  numberAttribute,
  output,
  signal,
  computed,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  afCropAndResizeImage,
  afTransformCropArea,
  type AfCropArea,
  type AfCropAspectRatio,
  type AfCropHandle,
  type AfImageCroppedEvent,
  type AfImageOutputFormat,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

let nextAfImageCropperId = 0;

@Component({
  selector: 'af-image-cropper-desktop',
  imports: [CommonModule, AfIconComponent],
  templateUrl: './af-image-cropper-desktop.component.html',
  styleUrl: './af-image-cropper-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-image-cropper-desktop',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
})
export class AfImageCropperDesktopComponent {
  readonly containerRef = viewChild<ElementRef<HTMLDivElement>>('containerRef');

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

  protected readonly id = `af-image-cropper-${++nextAfImageCropperId}`;
  protected readonly loadedImage = signal<HTMLImageElement | null>(null);
  protected readonly isProcessing = signal(false);

  // Editing state
  protected readonly zoom = signal(1.0);
  protected readonly rotation = signal(0);
  protected readonly currentFormat = signal<AfImageOutputFormat>('image/png');
  protected readonly currentQuality = signal(0.92);

  // Normalized crop rectangle (relative to image natural coordinates)
  protected readonly cropArea = signal<AfCropArea>({ x: 0, y: 0, width: 100, height: 100 });

  // Custom output target dimensions
  protected readonly customWidth = signal<number | null>(null);
  protected readonly customHeight = signal<number | null>(null);
  protected readonly keepAspect = signal(true);

  // Interaction dragging state
  private isDragging = false;
  private activeHandle: AfCropHandle | null = null;
  private startX = 0;
  private startY = 0;
  private startCrop: AfCropArea = { x: 0, y: 0, width: 0, height: 0 };

  protected readonly qualityPercent = computed(() => Math.round(this.currentQuality() * 100));

  protected readonly aspectRatioNumeric = computed(() => {
    const ratio = this.aspectRatio();
    if (ratio === '1:1' || ratio === 'circle') return 1;
    if (ratio === '4:3') return 4 / 3;
    if (ratio === '16:9') return 16 / 9;
    if (ratio === '3:2') return 3 / 2;
    return null;
  });

  constructor() {
    effect(() => {
      const source = this.src();
      if (source) {
        this.loadImage(source);
      } else {
        this.loadedImage.set(null);
      }
    });

    effect(() => {
      const fmt = this.format();
      this.currentFormat.set(fmt);
    });

    effect(() => {
      const q = this.quality();
      this.currentQuality.set(q);
    });

    effect(() => {
      const rw = this.resizeWidth();
      const rh = this.resizeHeight();
      this.customWidth.set(rw ?? null);
      this.customHeight.set(rh ?? null);
    });
  }

  private loadImage(source: File | Blob | string): void {
    let url: string;
    let shouldRevoke = false;

    if (source instanceof File || source instanceof Blob) {
      url = URL.createObjectURL(source);
      shouldRevoke = true;
    } else {
      url = source;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (shouldRevoke) URL.revokeObjectURL(url);
      this.loadedImage.set(img);
      this.resetCropArea(img);
      this.imageLoaded.emit({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = (err) => {
      if (shouldRevoke) URL.revokeObjectURL(url);
      this.loadedImage.set(null);
      this.imageError.emit(new Error(`Failed to load image: ${err}`));
    };
    img.src = url;
  }

  protected resetCropArea(img: HTMLImageElement = this.loadedImage()!): void {
    if (!img) return;
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;

    let cropW = nw * 0.8;
    let cropH = nh * 0.8;

    const ratio = this.aspectRatioNumeric();
    if (ratio) {
      if (cropW / cropH > ratio) {
        cropW = cropH * ratio;
      } else {
        cropH = cropW / ratio;
      }
    }

    const cropX = (nw - cropW) / 2;
    const cropY = (nh - cropH) / 2;

    this.cropArea.set({ x: cropX, y: cropY, width: cropW, height: cropH });
    this.zoom.set(1.0);
    this.rotation.set(0);
    this.customWidth.set(this.resizeWidth() ?? Math.round(cropW));
    this.customHeight.set(this.resizeHeight() ?? Math.round(cropH));
  }

  protected rotateLeft(): void {
    this.rotation.update((r) => (r - 90 < -180 ? 90 : r - 90));
  }

  protected rotateRight(): void {
    this.rotation.update((r) => (r + 90 > 180 ? -90 : r + 90));
  }

  protected onZoomChange(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    const previousZoom = this.zoom();
    const image = this.loadedImage();

    if (image && val > 0 && previousZoom > 0) {
      const area = this.cropArea();
      const centerX = area.x + area.width / 2;
      const centerY = area.y + area.height / 2;
      const scale = previousZoom / val;
      let width = area.width * scale;
      let height = area.height * scale;
      const ratio = this.activeAspectRatio();

      if (ratio) {
        height = width / ratio;
      }

      width = Math.min(width, image.naturalWidth);
      height = Math.min(height, image.naturalHeight);
      const x = Math.max(0, Math.min(image.naturalWidth - width, centerX - width / 2));
      const y = Math.max(0, Math.min(image.naturalHeight - height, centerY - height / 2));
      this.updateCropArea({ x, y, width, height });
    }

    this.zoom.set(val);
  }

  protected onRotateChange(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    this.rotation.set(val);
  }

  protected onFormatChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value as AfImageOutputFormat;
    this.currentFormat.set(val);
  }

  protected onQualityChange(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    this.currentQuality.set(val);
  }

  protected onWidthInput(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    if (!val || val <= 0) return;
    this.customWidth.set(val);

    if (this.keepAspect()) {
      const area = this.cropArea();
      if (area.width > 0) {
        const ratio = area.height / area.width;
        this.customHeight.set(Math.round(val * ratio));
      }
    }
  }

  protected onHeightInput(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    if (!val || val <= 0) return;
    this.customHeight.set(val);

    if (this.keepAspect()) {
      const area = this.cropArea();
      if (area.height > 0) {
        const ratio = area.width / area.height;
        this.customWidth.set(Math.round(val * ratio));
      }
    }
  }

  protected toggleKeepAspect(): void {
    this.keepAspect.update((k) => !k);
  }

  protected onPointerDown(event: PointerEvent, handle: AfCropHandle): void {
    if (this.disabled() || !this.loadedImage()) return;
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
    this.activeHandle = handle;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startCrop = { ...this.cropArea() };
    (event.currentTarget as HTMLElement | null)?.setPointerCapture?.(event.pointerId);
  }

  @HostListener('window:pointermove', ['$event'])
  protected onPointerMove(event: PointerEvent): void {
    const img = this.loadedImage();
    if (!this.isDragging || !img || !this.activeHandle) return;

    const dx = event.clientX - this.startX;
    const dy = event.clientY - this.startY;

    const container = this.containerRef()?.nativeElement;
    const scaleX = container?.clientWidth ? img.naturalWidth / container.clientWidth : 1;
    const scaleY = container?.clientHeight ? img.naturalHeight / container.clientHeight : 1;
    const nextArea = afTransformCropArea(
      this.startCrop,
      this.activeHandle,
      dx * scaleX,
      dy * scaleY,
      img.naturalWidth,
      img.naturalHeight,
      this.activeAspectRatio(),
    );

    this.updateCropArea(nextArea);
  }

  @HostListener('window:pointerup')
  @HostListener('window:pointercancel')
  protected onPointerUp(): void {
    this.isDragging = false;
    this.activeHandle = null;
  }

  protected onCropKeydown(event: KeyboardEvent, handle: AfCropHandle): void {
    if (this.disabled() || !this.loadedImage()) return;

    const delta = event.shiftKey ? 10 : 2;
    const directions: Record<string, [number, number]> = {
      ArrowLeft: [-delta, 0],
      ArrowRight: [delta, 0],
      ArrowUp: [0, -delta],
      ArrowDown: [0, delta],
    };
    const movement = directions[event.key];
    if (!movement) return;

    event.preventDefault();
    const image = this.loadedImage()!;
    this.updateCropArea(
      afTransformCropArea(
        this.cropArea(),
        handle,
        movement[0],
        movement[1],
        image.naturalWidth,
        image.naturalHeight,
        this.activeAspectRatio(),
      ),
    );
  }

  protected async applyCrop(): Promise<void> {
    const img = this.loadedImage();
    if (!img || this.isProcessing()) return;

    try {
      this.isProcessing.set(true);
      const result = await afCropAndResizeImage(
        img,
        this.cropArea(),
        this.rotation(),
        this.customWidth() ?? undefined,
        this.customHeight() ?? undefined,
        this.currentFormat(),
        this.currentQuality(),
        this.fileName()
      );
      this.cropped.emit(result);
    } catch (err) {
      this.imageError.emit(err instanceof Error ? err : new Error(String(err)));
    } finally {
      this.isProcessing.set(false);
    }
  }

  protected onCancel(): void {
    this.cancel.emit();
  }

  // Position calculations for HTML overlay handles
  protected getOverlayStyles(): Record<string, string> {
    const img = this.loadedImage();
    if (!img) return {};
    const area = this.cropArea();

    const left = (area.x / img.naturalWidth) * 100;
    const top = (area.y / img.naturalHeight) * 100;
    const width = (area.width / img.naturalWidth) * 100;
    const height = (area.height / img.naturalHeight) * 100;

    return {
      left: `${left}%`,
      top: `${top}%`,
      width: `${width}%`,
      height: `${height}%`,
    };
  }

  private activeAspectRatio(): number | null {
    return this.aspectRatioNumeric() ??
      (this.maintainAspectRatio() && this.startCrop.height > 0
        ? this.startCrop.width / this.startCrop.height
        : null);
  }

  private updateCropArea(area: AfCropArea): void {
    this.cropArea.set(area);
    if (this.keepAspect()) {
      this.customWidth.set(Math.round(area.width));
      this.customHeight.set(Math.round(area.height));
    }
  }
}
