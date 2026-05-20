import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideArgfitUi } from '@argfit-ui/core';

import { AfPasswordComponent } from './af-password.component';

describe('AfPasswordComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders the desktop password implementation by default', async () => {
    @Component({
      imports: [AfPasswordComponent],
      template: `<af-password label="Clave" value="ArgFit#2026" />`,
    })
    class DesktopHost {}

    await TestBed.configureTestingModule({
      imports: [DesktopHost],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(DesktopHost);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('af-password-desktop')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('af-password-mobile')).toBeNull();
  });

  it('renders the mobile password implementation when platform is mobile', async () => {
    @Component({
      imports: [AfPasswordComponent],
      template: `<af-password label="Clave" value="ArgFit#2026" />`,
    })
    class MobileHost {}

    await TestBed.configureTestingModule({
      imports: [MobileHost],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(MobileHost);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('af-password-mobile')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('af-password-desktop')).toBeNull();
  });

  it('propagates valueChange from the underlying password input', async () => {
    @Component({
      imports: [AfPasswordComponent],
      template: `
        <af-password label="Clave" value="" (valueChange)="value = $event" />
      `,
    })
    class Host {
      value = '';
    }

    await TestBed.configureTestingModule({
      imports: [Host],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'ClaveNueva#1';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.value).toBe('ClaveNueva#1');
  });
});
