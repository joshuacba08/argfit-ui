import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideArgfitUi } from '@argfit-ui/core';

import { AfDialogComponent } from './af-dialog.component';

describe('AfDialogComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders the desktop implementation by default', async () => {
    @Component({
      imports: [AfDialogComponent],
      template: `<af-dialog [open]="true" title="Hola"></af-dialog>`,
    })
    class DesktopHost {}

    await TestBed.configureTestingModule({
      imports: [DesktopHost],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(DesktopHost);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('af-dialog-desktop')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('af-dialog-mobile')).toBeNull();
  });

  it('renders the mobile implementation when platform is mobile', async () => {
    @Component({
      imports: [AfDialogComponent],
      template: `<af-dialog [open]="true" title="Hola"></af-dialog>`,
    })
    class MobileHost {}

    await TestBed.configureTestingModule({
      imports: [MobileHost],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(MobileHost);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('af-dialog-mobile')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('af-dialog-desktop')).toBeNull();
  });

  it('propagates openChange when the underlying dialog requests close', async () => {
    @Component({
      imports: [AfDialogComponent],
      template: `
        <af-dialog [open]="true" title="Detalle" (openChange)="changed = $event"></af-dialog>
      `,
    })
    class Host {
      changed: boolean | null = null;
    }

    await TestBed.configureTestingModule({
      imports: [Host],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();

    const close = fixture.nativeElement.querySelector(
      '.af-dialog-desktop__close',
    ) as HTMLButtonElement;
    close.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.changed).toBe(false);
  });
});
