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

let nextAfMobileCropperId = 0;

@Component({
  selector: 'af-image-cropper-mobile',
  imports: [CommonModule, AfIconComponent],
  templateUrl: './af-image-cropper-mobile.component.html',
  styleUrl: './af-image-cropper-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-image-cropper-mobile',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
})
export class AfImageCropperMobileComponent {
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

  protected readonly id = `af-image-cropper-mobile-${++nextAfMobileCropperId}`;
  protected readonly loadedImage = signal<HTMLImageElement | null>(null);
  protected readonly isProcessing = signal(false);

  // Editing state
  protected readonly zoom = signal(1.0);
  protected readonly rotation = signal(0);
  protected readonly currentFormat = signal<AfImageOutputFormat>('image/png');
  protected readonly currentQuality = signal(0.92);

  // Crop rectangle
  protected readonly cropArea = signal<AfCropArea>({ x: 0, y: 0, width: 100, height: 100 });

  // Custom output target dimensions
  protected readonly customWidth = signal<number | null>(null);
  protected readonly customHeight = signal<number | null>(null);

  // Pointer interaction state
  private isDragging = false;
  private activeHandle: AfCropHandle | null = null;
  private startX = 0;
  private startY = 0;
  private startCrop: AfCropArea = { x: 0, y: 0, width: 0, height: 0 };

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
      this.currentFormat.set(this.format());
    });

    effect(() => {
      this.currentQuality.set(this.quality());
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

    let cropW = nw * 0.85;
    let cropH = nh * 0.85;

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
      let width = Math.min(area.width * scale, image.naturalWidth);
      let height = Math.min(area.height * scale, image.naturalHeight);
      const ratio = this.activeAspectRatio();
      if (ratio) height = width / ratio;
      width = Math.min(width, image.naturalWidth);
      height = Math.min(height, image.naturalHeight);
      this.updateCropArea({
        x: Math.max(0, Math.min(image.naturalWidth - width, centerX - width / 2)),
        y: Math.max(0, Math.min(image.naturalHeight - height, centerY - height / 2)),
        width,
        height,
      });
    }

    this.zoom.set(val);
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
    const container = this.containerRef()?.nativeElement;
    const scaleX = container?.clientWidth ? img.naturalWidth / container.clientWidth : 1;
    const scaleY = container?.clientHeight ? img.naturalHeight / container.clientHeight : 1;
    this.updateCropArea(
      afTransformCropArea(
        this.startCrop,
        this.activeHandle,
        (event.clientX - this.startX) * scaleX,
        (event.clientY - this.startY) * scaleY,
        img.naturalWidth,
        img.naturalHeight,
        this.activeAspectRatio(),
        32,
      ),
    );
  }

  @HostListener('window:pointerup')
  @HostListener('window:pointercancel')
  protected onPointerUp(): void {
    this.isDragging = false;
    this.activeHandle = null;
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
    this.customWidth.set(Math.round(area.width));
    this.customHeight.set(Math.round(area.height));
  }
}
