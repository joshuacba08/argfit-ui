import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideArgfitUi, type AfImageCroppedEvent } from '@argfit-ui/core';

import { AfImageCropperComponent } from './af-image-cropper.component';

@Component({
  imports: [AfImageCropperComponent],
  template: `
    <af-image-cropper
      [src]="src()"
      [aspectRatio]="'1:1'"
      (cropped)="lastCropped = $event"
      (cancel)="cancelled = true"
    />
  `,
})
class HostComponent {
  readonly src = signal<string | undefined>('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
  lastCropped: AfImageCroppedEvent | undefined;
  cancelled = false;
}

describe('AfImageCropperComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  async function setup(platform: 'desktop' | 'mobile' = 'desktop') {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideArgfitUi({ platform })],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('renders desktop cropper component on desktop platform', async () => {
    const fixture = await setup('desktop');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('af-image-cropper-desktop')).toBeTruthy();
  });

  it('renders mobile cropper component on mobile platform', async () => {
    const fixture = await setup('mobile');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('af-image-cropper-mobile')).toBeTruthy();
  });
});
