import { afTransformCropArea, type AfCropArea } from './image-cropper.types';

describe('afTransformCropArea', () => {
  const start: AfCropArea = { x: 100, y: 60, width: 240, height: 160 };

  it('resizes from every corner and keeps the opposite corner fixed', () => {
    expect(afTransformCropArea(start, 'nw', -40, -20, 600, 400)).toEqual({
      x: 60,
      y: 40,
      width: 280,
      height: 180,
    });

    expect(afTransformCropArea(start, 'se', 40, 20, 600, 400)).toEqual({
      x: 100,
      y: 60,
      width: 280,
      height: 180,
    });
  });

  it('keeps fixed-ratio crops inside the source bounds', () => {
    const result = afTransformCropArea(start, 'se', 500, 500, 600, 400, 16 / 9);

    expect(result.width / result.height).toBeCloseTo(16 / 9);
    expect(result.x + result.width).toBeLessThanOrEqual(600);
    expect(result.y + result.height).toBeLessThanOrEqual(400);
  });

  it('constrains movement to the source image', () => {
    expect(afTransformCropArea(start, 'move', -500, 500, 600, 400)).toEqual({
      ...start,
      x: 0,
      y: 240,
    });
  });
});
