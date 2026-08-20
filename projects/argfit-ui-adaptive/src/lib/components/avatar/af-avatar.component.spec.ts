import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideArgfitUi, type AfIconName } from '@argfit-ui/core';
import { AfAvatarComponent } from './af-avatar.component';

@Component({
  imports: [AfAvatarComponent],
  template: `
    <af-avatar
      [label]="label"
      [initials]="initials"
      [imageSrc]="imageSrc"
      [imageAlt]="imageAlt"
      loading="lazy"
      decoding="async"
      [icon]="icon"
      tone="accent"
      size="lg"
      shape="rounded"
      ariaLabel="Athlete avatar"
    />
  `,
})
class AfAvatarHostComponent {
  label: string | undefined = 'Maria Garcia';
  initials: string | undefined;
  imageSrc: string | undefined;
  imageAlt: string | undefined = 'Maria Garcia';
  icon: AfIconName | undefined;
}

describe('AfAvatarComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders the desktop implementation and derives initials from the label', async () => {
    await TestBed.configureTestingModule({
      imports: [AfAvatarHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfAvatarHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const desktop = fixture.nativeElement.querySelector('af-avatar-desktop') as HTMLElement | null;
    const mobile = fixture.nativeElement.querySelector('af-avatar-mobile') as HTMLElement | null;

    expect(desktop).not.toBeNull();
    expect(mobile).toBeNull();
    expect(desktop!.textContent?.trim()).toBe('MG');
    expect(desktop!.getAttribute('data-tone')).toBe('accent');
    expect(desktop!.getAttribute('data-size')).toBe('lg');
    expect(desktop!.getAttribute('data-shape')).toBe('rounded');
    expect(desktop!.getAttribute('aria-label')).toBe('Athlete avatar');
  });

  it('renders the mobile implementation and falls back to an icon', async () => {
    await TestBed.configureTestingModule({
      imports: [AfAvatarHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfAvatarHostComponent);
    fixture.componentInstance.label = undefined;
    fixture.componentInstance.initials = undefined;
    fixture.componentInstance.icon = 'monitor';
    fixture.detectChanges();
    await fixture.whenStable();

    const mobile = fixture.nativeElement.querySelector('af-avatar-mobile') as HTMLElement | null;
    const desktop = fixture.nativeElement.querySelector('af-avatar-desktop') as HTMLElement | null;

    expect(mobile).not.toBeNull();
    expect(desktop).toBeNull();
    expect(mobile!.getAttribute('data-tone')).toBe('accent');
    expect(mobile!.querySelector('af-icon')).not.toBeNull();
    expect(mobile!.querySelector('img')).toBeNull();
  });

  it('keeps initials visible until a lazy image loads and restores them on error', async () => {
    await TestBed.configureTestingModule({
      imports: [AfAvatarHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfAvatarHostComponent);
    fixture.componentInstance.initials = 'MG';
    fixture.componentInstance.imageSrc = '/maria.webp';
    fixture.detectChanges();
    await fixture.whenStable();

    const image = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    const initials = fixture.nativeElement.querySelector(
      '.af-avatar-desktop__initials',
    ) as HTMLElement;
    expect(initials.textContent?.trim()).toBe('MG');
    expect(image.getAttribute('loading')).toBe('lazy');
    expect(image.getAttribute('decoding')).toBe('async');
    expect(image.classList.contains('af-avatar-desktop__image--loaded')).toBe(false);

    image.dispatchEvent(new Event('load'));
    fixture.detectChanges();
    expect(image.classList.contains('af-avatar-desktop__image--loaded')).toBe(true);

    image.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(image.classList.contains('af-avatar-desktop__image--loaded')).toBe(false);
  });
});
