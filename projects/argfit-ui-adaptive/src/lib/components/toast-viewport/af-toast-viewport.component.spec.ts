import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideArgfitUi } from '@argfit-ui/core';

import { AfToastViewportComponent } from './af-toast-viewport.component';

describe('AfToastViewportComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders the desktop viewport by default', async () => {
    @Component({
      imports: [AfToastViewportComponent],
      template: `<af-toast-viewport />`,
    })
    class HostComponent {}

    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('af-toast-viewport-desktop')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('af-toast-viewport-mobile')).toBeNull();
  });

  it('renders the mobile viewport when platform is mobile', async () => {
    @Component({
      imports: [AfToastViewportComponent],
      template: `<af-toast-viewport />`,
    })
    class HostComponent {}

    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('af-toast-viewport-mobile')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('af-toast-viewport-desktop')).toBeNull();
  });
});
