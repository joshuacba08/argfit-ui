import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { provideArgfitUi } from '@argfit-ui/core';

import { AfInputComponent } from './af-input.component';

@Component({
  imports: [AfInputComponent, ReactiveFormsModule],
  template: `
    <af-input
      label="Nombre"
      placeholder="Maria"
      [formControl]="control"
    />
  `,
})
class AfInputCvaHostComponent {
  readonly control = new FormControl<string>('Maria', { nonNullable: true });
}

describe('AfInputComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders the desktop implementation by default', async () => {
    @Component({
      imports: [AfInputComponent],
      template: `<af-input label="Email" placeholder="email@argfit.com" />`,
    })
    class DesktopHost {}

    await TestBed.configureTestingModule({
      imports: [DesktopHost],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(DesktopHost);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('af-input-desktop') as HTMLElement;
    expect(host).not.toBeNull();
    expect(host.classList.contains('af-input-desktop')).toBe(true);
  });

  it('renders the mobile implementation when platform is mobile', async () => {
    @Component({
      imports: [AfInputComponent],
      template: `<af-input label="Email" placeholder="email@argfit.com" />`,
    })
    class MobileHost {}

    await TestBed.configureTestingModule({
      imports: [MobileHost],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(MobileHost);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('af-input-mobile') as HTMLElement;
    expect(host).not.toBeNull();
    expect(host.classList.contains('af-input-mobile')).toBe(true);
  });

  it('synchronizes value with a FormControl via ControlValueAccessor', async () => {
    await TestBed.configureTestingModule({
      imports: [AfInputCvaHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfInputCvaHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('Maria');

    input.value = 'Lucia';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.control.value).toBe('Lucia');

    fixture.componentInstance.control.setValue('Ana');
    fixture.detectChanges();
    expect(input.value).toBe('Ana');
  });

  it('disables the underlying input when the FormControl is disabled', async () => {
    await TestBed.configureTestingModule({
      imports: [AfInputCvaHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfInputCvaHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.componentInstance.control.disable();
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });
});
