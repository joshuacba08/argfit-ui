import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AfDialogDesktopComponent } from './af-dialog-desktop.component';

@Component({
  imports: [AfDialogDesktopComponent],
  template: `
    <af-dialog-desktop
      [open]="open()"
      title="Detalle"
      description="Resumen breve"
      size="md"
      (openChange)="onOpenChange($event)"
    >
      <p>Cuerpo</p>
    </af-dialog-desktop>
  `,
})
class HostComponent {
  readonly open = signal(false);
  lastOpenChange: boolean | null = null;
  onOpenChange(next: boolean): void {
    this.lastOpenChange = next;
    this.open.set(next);
  }
}

describe('AfDialogDesktopComponent', () => {
  it('does not render the panel when closed', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.af-dialog-desktop__panel')).toBeNull();
  });

  it('renders title, description and content when open', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector('.af-dialog-desktop__panel') as HTMLElement;
    expect(panel).not.toBeNull();
    expect(panel.getAttribute('aria-modal')).toBe('true');
    expect(panel.getAttribute('role')).toBe('dialog');

    const title = panel.querySelector('.af-dialog-desktop__title') as HTMLElement;
    const description = panel.querySelector('.af-dialog-desktop__description') as HTMLElement;
    const body = panel.querySelector('.af-dialog-desktop__body') as HTMLElement;

    expect(title.textContent?.trim()).toBe('Detalle');
    expect(description.textContent?.trim()).toBe('Resumen breve');
    expect(panel.getAttribute('aria-labelledby')).toBe(title.id);
    expect(panel.getAttribute('aria-describedby')).toBe(description.id);
    expect(body.textContent).toContain('Cuerpo');
  });

  it('emits openChange(false) when the close button is pressed', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();

    const close = fixture.nativeElement.querySelector(
      '.af-dialog-desktop__close',
    ) as HTMLButtonElement;
    close.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.lastOpenChange).toBe(false);
  });

  it('closes when the backdrop is clicked', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();

    const backdrop = fixture.nativeElement.querySelector(
      '.af-dialog-desktop__backdrop',
    ) as HTMLElement;
    backdrop.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.lastOpenChange).toBe(false);
  });

  it('does not close on backdrop when closeOnBackdrop is false', async () => {
    @Component({
      imports: [AfDialogDesktopComponent],
      template: `
        <af-dialog-desktop
          [open]="true"
          title="No"
          [closeOnBackdrop]="false"
          (openChange)="changed = $event"
        ></af-dialog-desktop>
      `,
    })
    class NoBackdropHost {
      changed: boolean | null = null;
    }

    await TestBed.configureTestingModule({ imports: [NoBackdropHost] }).compileComponents();
    const fixture = TestBed.createComponent(NoBackdropHost);
    fixture.detectChanges();

    const backdrop = fixture.nativeElement.querySelector(
      '.af-dialog-desktop__backdrop',
    ) as HTMLElement;
    backdrop.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.changed).toBeNull();
  });

  it('uses role="alertdialog" for danger tone', async () => {
    @Component({
      imports: [AfDialogDesktopComponent],
      template: `
        <af-dialog-desktop [open]="true" title="Borrar" tone="danger"></af-dialog-desktop>
      `,
    })
    class DangerHost {}

    await TestBed.configureTestingModule({ imports: [DangerHost] }).compileComponents();
    const fixture = TestBed.createComponent(DangerHost);
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector('.af-dialog-desktop__panel') as HTMLElement;
    expect(panel.getAttribute('role')).toBe('alertdialog');
    expect(panel.getAttribute('data-tone')).toBe('danger');
    expect(panel.querySelector('.af-dialog-desktop__tone-icon')).not.toBeNull();
  });

  it('renders semantic icons for non-danger tones without alertdialog role', async () => {
    @Component({
      imports: [AfDialogDesktopComponent],
      template: `
        <af-dialog-desktop [open]="true" title="Listo" tone="success"></af-dialog-desktop>
      `,
    })
    class SuccessHost {}

    await TestBed.configureTestingModule({ imports: [SuccessHost] }).compileComponents();
    const fixture = TestBed.createComponent(SuccessHost);
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector('.af-dialog-desktop__panel') as HTMLElement;
    expect(panel.getAttribute('role')).toBe('dialog');
    expect(panel.getAttribute('data-tone')).toBe('success');
    expect(panel.querySelector('.af-dialog-desktop__tone-icon')).not.toBeNull();
  });

  it('closes on Escape key by default', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector('.af-dialog-desktop__panel') as HTMLElement;
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.lastOpenChange).toBe(false);
  });
});
