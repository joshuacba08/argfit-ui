export type AfCropAspectRatio = '1:1' | '4:3' | '16:9' | '3:2' | 'free' | 'circle';

export type AfImageOutputFormat = 'image/png' | 'image/jpeg' | 'image/webp';

export interface AfCropArea {
  /** X coordinate in pixels relative to original image natural width. */
  x: number;
  /** Y coordinate in pixels relative to original image natural height. */
  y: number;
  /** Width in pixels relative to original image natural width. */
  width: number;
  /** Height in pixels relative to original image natural height. */
  height: number;
}

export type AfCropHandle = 'move' | 'nw' | 'ne' | 'sw' | 'se';

/**
 * Moves or resizes a crop rectangle while keeping it inside the source image.
 * Deltas are expressed in natural-image pixels, which keeps pointer handling
 * independent from the rendered preview size.
 */
export function afTransformCropArea(
  start: AfCropArea,
  handle: AfCropHandle,
  deltaX: number,
  deltaY: number,
  imageWidth: number,
  imageHeight: number,
  aspectRatio: number | null = null,
  minimumSize = 24,
): AfCropArea {
  const clamp = (value: number, min: number, max: number): number =>
    Math.min(Math.max(value, min), Math.max(min, max));

  if (handle === 'move') {
    return {
      ...start,
      x: clamp(start.x + deltaX, 0, imageWidth - start.width),
      y: clamp(start.y + deltaY, 0, imageHeight - start.height),
    };
  }

  const movesEast = handle.includes('e');
  const movesSouth = handle.includes('s');
  const fixedX = movesEast ? start.x : start.x + start.width;
  const fixedY = movesSouth ? start.y : start.y + start.height;
  const pointerX = (movesEast ? start.x + start.width : start.x) + deltaX;
  const pointerY = (movesSouth ? start.y + start.height : start.y) + deltaY;
  const maxWidth = movesEast ? imageWidth - fixedX : fixedX;
  const maxHeight = movesSouth ? imageHeight - fixedY : fixedY;

  let width = Math.abs(pointerX - fixedX);
  let height = Math.abs(pointerY - fixedY);

  if (aspectRatio && Number.isFinite(aspectRatio) && aspectRatio > 0) {
    const widthChange = Math.abs(width - start.width);
    const heightChangeAsWidth = Math.abs(height - start.height) * aspectRatio;

    if (widthChange >= heightChangeAsWidth) {
      height = width / aspectRatio;
    } else {
      width = height * aspectRatio;
    }

    const maximumWidth = Math.min(maxWidth, maxHeight * aspectRatio);
    const minimumWidth = Math.min(minimumSize, maximumWidth);
    width = clamp(width, minimumWidth, maximumWidth);
    height = width / aspectRatio;
  } else {
    width = clamp(width, Math.min(minimumSize, maxWidth), maxWidth);
    height = clamp(height, Math.min(minimumSize, maxHeight), maxHeight);
  }

  return {
    x: movesEast ? fixedX : fixedX - width,
    y: movesSouth ? fixedY : fixedY - height,
    width,
    height,
  };
}

export interface AfImageCroppedEvent {
  readonly file: File;
  readonly blob: Blob;
  readonly dataUrl: string;
  readonly width: number;
  readonly height: number;
  readonly sizeBytes: number;
  readonly format: AfImageOutputFormat;
}

export interface AfImageCropperOptions {
  aspectRatio?: AfCropAspectRatio;
  maintainAspectRatio?: boolean;
  resizeWidth?: number;
  resizeHeight?: number;
  format?: AfImageOutputFormat;
  quality?: number;
  circularCrop?: boolean;
}

/**
  * Crops, rotates, resizes and encodes an HTMLImageElement using HTML5 Canvas.
  */
export async function afCropAndResizeImage(
  image: HTMLImageElement,
  cropArea: AfCropArea,
  rotationDeg = 0,
  targetWidth?: number,
  targetHeight?: number,
  format: AfImageOutputFormat = 'image/png',
  quality = 0.92,
  fileName = 'cropped-image'
): Promise<AfImageCroppedEvent> {
  const normCropX = Math.max(0, Math.min(image.naturalWidth, cropArea.x));
  const normCropY = Math.max(0, Math.min(image.naturalHeight, cropArea.y));
  const normCropW = Math.max(1, Math.min(image.naturalWidth - normCropX, cropArea.width));
  const normCropH = Math.max(1, Math.min(image.naturalHeight - normCropY, cropArea.height));

  // Determine target canvas dimensions
  const finalW = Math.max(1, Math.round(targetWidth && targetWidth > 0 ? targetWidth : normCropW));
  const finalH = Math.max(1, Math.round(targetHeight && targetHeight > 0 ? targetHeight : normCropH));

  const canvas = document.createElement('canvas');
  canvas.width = finalW;
  canvas.height = finalH;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not obtain 2D canvas context');
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  if (rotationDeg !== 0) {
    ctx.save();
    ctx.translate(finalW / 2, finalH / 2);
    ctx.rotate((rotationDeg * Math.PI) / 180);
    ctx.drawImage(
      image,
      normCropX,
      normCropY,
      normCropW,
      normCropH,
      -finalW / 2,
      -finalH / 2,
      finalW,
      finalH
    );
    ctx.restore();
  } else {
    ctx.drawImage(
      image,
      normCropX,
      normCropY,
      normCropW,
      normCropH,
      0,
      0,
      finalW,
      finalH
    );
  }

  const mimeType = format;
  const ext = format === 'image/jpeg' ? '.jpg' : format === 'image/webp' ? '.webp' : '.png';
  const outName = fileName.endsWith(ext) ? fileName : `${fileName.replace(/\.[^/.]+$/, '')}${ext}`;

  return new Promise<AfImageCroppedEvent>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas toBlob failed'));
          return;
        }
        const file = new File([blob], outName, { type: mimeType, lastModified: Date.now() });
        const dataUrl = canvas.toDataURL(mimeType, quality);
        resolve({
          file,
          blob,
          dataUrl,
          width: finalW,
          height: finalH,
          sizeBytes: blob.size,
          format,
        });
      },
      mimeType,
      quality
    );
  });
}
