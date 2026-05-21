import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { provideArgfitUi, type AfListboxOption } from '@argfit-ui/core';

import { AfListboxComponent } from './af-listbox.component';

@Component({
  imports: [ReactiveFormsModule, AfListboxComponent],
  template: `
    <af-listbox
      label="Tests visibles"
      helperText="Seleccion multiple para el dashboard"
      selectionMode="multiple"
      [options]="testOptions"
      [formControl]="selectedTests"
    />
  `,
})
class AfListboxHostComponent {
  readonly testOptions: readonly AfListboxOption<string>[] = [
    { value: 'cmj', label: 'CMJ', hint: 'Potencia bilateral' },
    { value: 'sj', label: 'SJ', hint: 'Salto sin contramovimiento' },
    { value: 'dj', label: 'DJ', hint: 'Reactividad' },
  ];

  readonly selectedTests = new FormControl<readonly string[]>(['cmj'], { nonNullable: true });
}

describe('AfListboxComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders the desktop implementation and synchronizes multiple selection through ControlValueAccessor', async () => {
    await TestBed.configureTestingModule({
      imports: [AfListboxHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfListboxHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    const desktop = root.querySelector('af-listbox-desktop') as HTMLElement | null;
    const options = Array.from(root.querySelectorAll('af-listbox-desktop button')) as HTMLButtonElement[];

    expect(desktop).not.toBeNull();
    expect(options[0]?.getAttribute('aria-selected')).toBe('true');

    options[1]?.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedTests.value).toEqual(['cmj', 'sj']);

    options[1]?.dispatchEvent(new FocusEvent('focus'));
    options[1]?.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedTests.touched).toBe(true);

    fixture.componentInstance.selectedTests.disable();
    fixture.detectChanges();
    expect(desktop?.hasAttribute('data-disabled')).toBe(true);
  });

  it('renders the mobile implementation when platform is mobile', async () => {
    await TestBed.configureTestingModule({
      imports: [AfListboxHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfListboxHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-listbox-mobile')).not.toBeNull();
    expect(root.querySelector('af-listbox-desktop')).toBeNull();
  });
});