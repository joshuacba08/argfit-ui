import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { provideArgfitUi } from '@argfit-ui/core';

import { AfInputCountComponent } from './af-input-count.component';

@Component({
  imports: [ReactiveFormsModule, AfInputCountComponent],
  template: `
    <af-input-count
      label="Edad"
      unit="años"
      [min]="10"
      [max]="60"
      [step]="2"
      helperText="Control numerico"
      [formControl]="age"
    />
  `,
})
class AfInputCountHostComponent {
  readonly age = new FormControl<number>(18, { nonNullable: true });
}

describe('AfInputCountComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders the desktop implementation and synchronizes through ControlValueAccessor', async () => {
    await TestBed.configureTestingModule({
      imports: [AfInputCountHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfInputCountHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    const desktop = root.querySelector('af-input-count-desktop') as HTMLElement | null;
    const incrementButton = desktop?.querySelector('[data-action="increment"]') as HTMLButtonElement | null;
    const input = desktop?.querySelector('input') as HTMLInputElement | null;

    expect(desktop).not.toBeNull();
    expect(input?.value).toBe('18');

    incrementButton?.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.age.value).toBe(20);

    input!.value = '33';
    input!.dispatchEvent(new Event('input'));
    input!.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(fixture.componentInstance.age.value).toBe(33);
    expect(fixture.componentInstance.age.touched).toBe(true);

    fixture.componentInstance.age.disable();
    fixture.detectChanges();

    expect(desktop?.hasAttribute('data-disabled')).toBe(true);
  });

  it('renders the mobile implementation when platform is mobile', async () => {
    await TestBed.configureTestingModule({
      imports: [AfInputCountHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfInputCountHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    const mobile = root.querySelector('af-input-count-mobile') as HTMLElement | null;
    const desktop = root.querySelector('af-input-count-desktop') as HTMLElement | null;
    const decrementButton = mobile?.querySelector('[data-action="decrement"]') as HTMLButtonElement | null;

    expect(mobile).not.toBeNull();
    expect(desktop).toBeNull();

    decrementButton?.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.age.value).toBe(16);
  });
});