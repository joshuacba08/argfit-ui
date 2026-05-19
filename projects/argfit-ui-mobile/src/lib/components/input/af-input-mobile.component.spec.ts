import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AfInputMobileComponent } from './af-input-mobile.component';

@Component({
  imports: [AfInputMobileComponent],
  template: `
    <af-input-mobile
      label="Peso"
      placeholder="kg"
      suffix="kg"
      [value]="value"
      (valueChange)="value = $event"
    />
  `,
})
class AfInputMobileHostComponent {
  value = '';
}

describe('AfInputMobileComponent', () => {
  it('renders label, suffix and emits valueChange', async () => {
    await TestBed.configureTestingModule({
      imports: [AfInputMobileHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfInputMobileHostComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const label = root.querySelector('label.af-input-mobile__label') as HTMLLabelElement;
    const input = root.querySelector('input.af-input-mobile__input') as HTMLInputElement;
    const suffix = root.querySelector('.af-input-mobile__affix--suffix') as HTMLElement;

    expect(label.textContent?.trim().startsWith('Peso')).toBe(true);
    expect(label.getAttribute('for')).toBe(input.id);
    expect(suffix.textContent?.trim()).toBe('kg');

    input.value = '68';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe('68');
  });

  it('emits focusChange on focus/blur', async () => {
    @Component({
      imports: [AfInputMobileComponent],
      template: `
        <af-input-mobile
          label="Nombre"
          [value]="value"
          (focusChange)="focused = $event"
        />
      `,
    })
    class FocusHost {
      value = '';
      focused = false;
    }

    await TestBed.configureTestingModule({ imports: [FocusHost] }).compileComponents();
    const fixture = TestBed.createComponent(FocusHost);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('af-input-mobile') as HTMLElement;
    const input = host.querySelector('input') as HTMLInputElement;

    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    expect(fixture.componentInstance.focused).toBe(true);

    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(fixture.componentInstance.focused).toBe(false);
  });

  it('reflects error tone, aria attributes and disabled state', async () => {
    @Component({
      imports: [AfInputMobileComponent],
      template: `
        <af-input-mobile
          label="Email"
          error="Email invalido"
          [disabled]="true"
          [required]="true"
        />
      `,
    })
    class ErrorHost {}

    await TestBed.configureTestingModule({ imports: [ErrorHost] }).compileComponents();
    const fixture = TestBed.createComponent(ErrorHost);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('af-input-mobile') as HTMLElement;
    const input = host.querySelector('input') as HTMLInputElement;
    const error = host.querySelector('.af-input-mobile__message--error') as HTMLElement;

    expect(host.getAttribute('data-tone')).toBe('danger');
    expect(host.getAttribute('data-disabled')).toBe('');
    expect(input.disabled).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-required')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe(error.id);
  });
});
