import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AfInputDesktopComponent } from './af-input-desktop.component';

@Component({
  imports: [AfInputDesktopComponent],
  template: `
    <af-input-desktop
      label="Nombre completo"
      placeholder="Maria Garcia"
      value="Maria Garcia"
      hint="Tal como aparece en el carnet"
      [required]="true"
    />
  `,
})
class AfInputDesktopHostComponent {}

describe('AfInputDesktopComponent', () => {
  it('renders label, placeholder, hint and binds value', async () => {
    await TestBed.configureTestingModule({
      imports: [AfInputDesktopHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfInputDesktopHostComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const label = root.querySelector('label.af-input-desktop__label') as HTMLLabelElement;
    const input = root.querySelector('input.af-input-desktop__input') as HTMLInputElement;
    const hint = root.querySelector('.af-input-desktop__message--hint') as HTMLElement;

    expect(label.textContent?.trim().startsWith('Nombre completo')).toBe(true);
    expect(label.getAttribute('for')).toBe(input.id);
    expect(input.placeholder).toBe('Maria Garcia');
    expect(input.value).toBe('Maria Garcia');
    expect(input.getAttribute('aria-required')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe(hint.id);
  });

  it('emits valueChange on input event and toggles focus', async () => {
    @Component({
      imports: [AfInputDesktopComponent],
      template: `
        <af-input-desktop
          label="Peso"
          [value]="value"
          (valueChange)="value = $event"
          (focusChange)="focus = $event"
        />
      `,
    })
    class EmittingHost {
      value = '';
      focus = false;
    }

    await TestBed.configureTestingModule({ imports: [EmittingHost] }).compileComponents();
    const fixture = TestBed.createComponent(EmittingHost);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '68';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe('68');

    input.dispatchEvent(new Event('focus'));
    expect(fixture.componentInstance.focus).toBe(true);
    input.dispatchEvent(new Event('blur'));
    expect(fixture.componentInstance.focus).toBe(false);
  });

  it('reflects error tone, disabled and readonly states', async () => {
    @Component({
      imports: [AfInputDesktopComponent],
      template: `
        <af-input-desktop
          label="Email"
          error="Ingresa un email valido"
          [disabled]="true"
          [readonly]="true"
        />
      `,
    })
    class StatesHost {}

    await TestBed.configureTestingModule({ imports: [StatesHost] }).compileComponents();
    const fixture = TestBed.createComponent(StatesHost);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('af-input-desktop') as HTMLElement;
    const input = host.querySelector('input') as HTMLInputElement;
    const error = host.querySelector('.af-input-desktop__message--error') as HTMLElement;

    expect(host.getAttribute('data-tone')).toBe('danger');
    expect(host.getAttribute('data-disabled')).toBe('');
    expect(host.getAttribute('data-readonly')).toBe('');
    expect(input.disabled).toBe(true);
    expect(input.readOnly).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe(error.id);
    expect(error.textContent?.trim()).toBe('Ingresa un email valido');
  });
});
