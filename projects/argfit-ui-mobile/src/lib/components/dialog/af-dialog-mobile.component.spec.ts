import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AfDialogMobileComponent } from './af-dialog-mobile.component';

@Component({
  imports: [AfDialogMobileComponent],
  template: `
    <af-dialog-mobile
      [open]="open()"
      [presentation]="presentation()"
      title="Detalle"
      description="Resumen"
      (openChange)="onOpenChange($event)"
    >
      <p>Cuerpo</p>
    </af-dialog-mobile>
  `,
})
class HostComponent {
  readonly open = signal(false);
  readonly presentation = signal<'sheet' | 'fullscreen'>('sheet');
  lastOpenChange: boolean | null = null;
  onOpenChange(next: boolean): void {
    this.lastOpenChange = next;
    this.open.set(next);
  }
}

describe('AfDialogMobileComponent', () => {
  it('renders nothing when closed', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.af-dialog-mobile__panel')).toBeNull();
  });

  it('renders sheet presentation with grabber when open', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector('.af-dialog-mobile__panel') as HTMLElement;
    expect(panel.getAttribute('data-presentation')).toBe('sheet');
    expect(panel.querySelector('.af-dialog-mobile__grabber')).not.toBeNull();
  });

  it('applies fullscreen presentation attribute and hides grabber', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.open.set(true);
    fixture.componentInstance.presentation.set('fullscreen');
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector('.af-dialog-mobile__panel') as HTMLElement;
    expect(panel.getAttribute('data-presentation')).toBe('fullscreen');
    expect(panel.querySelector('.af-dialog-mobile__grabber')).toBeNull();
  });

  it('renders semantic tone icons on mobile dialogs', async () => {
    @Component({
      imports: [AfDialogMobileComponent],
      template: `<af-dialog-mobile [open]="true" title="Info" tone="info"></af-dialog-mobile>`,
    })
    class InfoHost {}

    await TestBed.configureTestingModule({ imports: [InfoHost] }).compileComponents();
    const fixture = TestBed.createComponent(InfoHost);
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector('.af-dialog-mobile__panel') as HTMLElement;
    expect(panel.getAttribute('role')).toBe('dialog');
    expect(panel.getAttribute('data-tone')).toBe('info');
    expect(panel.querySelector('.af-dialog-mobile__tone-icon')).not.toBeNull();
  });

  it('emits openChange(false) when close button is pressed', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();

    const close = fixture.nativeElement.querySelector(
      '.af-dialog-mobile__close',
    ) as HTMLButtonElement;
    close.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.lastOpenChange).toBe(false);
  });

  it('closes on Escape key', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector('.af-dialog-mobile__panel') as HTMLElement;
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.lastOpenChange).toBe(false);
  });

  it('restores focus to the previously active trigger when closed', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.textContent = 'Abrir mobile dialog';
    document.body.appendChild(trigger);
    trigger.focus();

    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const close = fixture.nativeElement.querySelector(
      '.af-dialog-mobile__close',
    ) as HTMLButtonElement;
    close.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.activeElement).toBe(trigger);

    trigger.remove();
  });
});
