import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AfPasswordMobileComponent } from './af-password-mobile.component';

@Component({
  imports: [AfPasswordMobileComponent],
  template: `
    <af-password-mobile
      label="Contrasena"
      placeholder="Clave segura"
      value="ArgFit#2026"
      hint="Minimo 8 caracteres"
      [required]="true"
      (valueChange)="value = $event"
    />
  `,
})
class AfPasswordMobileHostComponent {
  value = '';
}

describe('AfPasswordMobileComponent', () => {
  it('renders Ionic password input with password toggle', async () => {
    await TestBed.configureTestingModule({
      imports: [AfPasswordMobileHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfPasswordMobileHostComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const label = root.querySelector('label.af-password-mobile__label') as HTMLLabelElement;
    const input = root.querySelector('ion-input.af-password-mobile__input') as unknown as HTMLElement;
    const toggle = root.querySelector('ion-input-password-toggle') as unknown as HTMLElement;
    const hint = root.querySelector('.af-password-mobile__message--hint') as HTMLElement;

    expect(label.textContent?.trim().startsWith('Contrasena')).toBe(true);
    expect(label.getAttribute('for')).toBe(input.id);
    expect(input.getAttribute('type')).toBe('password');
    expect(input.getAttribute('aria-required')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe(hint.id);
    expect(toggle).not.toBeNull();

    toggle.click();
    fixture.detectChanges();
    expect(input.getAttribute('type')).toBe('text');
    expect(root.querySelector('af-password-mobile')?.getAttribute('data-visible')).toBe('');
  });

  it('emits valueChange from ionInput', async () => {
    await TestBed.configureTestingModule({ imports: [AfPasswordMobileHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(AfPasswordMobileHostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('ion-input') as unknown as HTMLElement;
    input.dispatchEvent(
      new CustomEvent('ionInput', { detail: { value: 'NuevaClave#1' }, bubbles: true }),
    );
    fixture.detectChanges();

    expect(fixture.componentInstance.value).toBe('NuevaClave#1');
  });

  it('reflects error tone and disabled state', async () => {
    @Component({
      imports: [AfPasswordMobileComponent],
      template: `
        <af-password-mobile
          label="Clave"
          error="La contrasena es obligatoria"
          [disabled]="true"
        />
      `,
    })
    class ErrorHost {}

    await TestBed.configureTestingModule({ imports: [ErrorHost] }).compileComponents();
    const fixture = TestBed.createComponent(ErrorHost);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('af-password-mobile') as HTMLElement;
    const input = host.querySelector('ion-input') as unknown as HTMLElement;
    const error = host.querySelector('.af-password-mobile__message--error') as HTMLElement;

    expect(host.getAttribute('data-tone')).toBe('danger');
    expect(host.getAttribute('data-disabled')).toBe('');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe(error.id);
  });
});
