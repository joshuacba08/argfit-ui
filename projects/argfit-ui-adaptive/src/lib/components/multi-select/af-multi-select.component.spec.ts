import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { provideArgfitUi } from '@argfit-ui/core';

import { AfMultiSelectComponent } from './af-multi-select.component';

@Component({
  imports: [ReactiveFormsModule, AfMultiSelectComponent],
  template: `
    <af-multi-select
      label="Tipos de test"
      placeholder="Selecciona tipos"
      [options]="options"
      optionLabel="label"
      optionValue="value"
      [searchable]="true"
      [clearable]="true"
      [maxSelected]="2"
      helperText="Elige hasta dos tipos"
      [formControl]="selection"
    />
  `,
})
class AfMultiSelectHostComponent {
  readonly options = [
    { label: 'CMJ', value: 'cmj', hint: 'Counter movement jump' },
    { label: 'SJ', value: 'sj', hint: 'Squat jump' },
    { label: 'DJ', value: 'dj', hint: 'Drop jump' },
  ];

  readonly selection = new FormControl<readonly unknown[]>(['cmj'], { nonNullable: true });
}

describe('AfMultiSelectComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders the desktop implementation and supports search, selection, max selected, clear, and keyboard', async () => {
    await TestBed.configureTestingModule({
      imports: [AfMultiSelectHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfMultiSelectHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    const desktop = root.querySelector('af-multi-select-desktop') as HTMLElement | null;
    const desktopTrigger = root.querySelector('.af-popover-desktop__trigger') as HTMLElement | null;

    expect(desktop).not.toBeNull();

    desktopTrigger?.click();
    fixture.detectChanges();

    const searchInput = root.querySelector('.af-multi-select-desktop__search') as HTMLInputElement | null;
    searchInput!.value = 'SJ';
    searchInput!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    let options = Array.from(root.querySelectorAll('.af-multi-select-desktop__option')) as HTMLButtonElement[];
    expect(options).toHaveLength(1);
    expect(options[0].textContent).toContain('SJ');

    options[0].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.selection.value).toEqual(['cmj', 'sj']);

    searchInput!.value = '';
    searchInput!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    options = Array.from(root.querySelectorAll('.af-multi-select-desktop__option')) as HTMLButtonElement[];
    const djOption = options.find(option => option.textContent?.includes('DJ')) as HTMLButtonElement | undefined;
    expect(djOption?.disabled).toBe(true);

    const clearButton = root.querySelector('.af-multi-select-desktop__clear') as HTMLButtonElement | null;
    clearButton?.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.selection.value).toEqual([]);

    desktopTrigger?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    const cmjOption = Array.from(root.querySelectorAll('.af-multi-select-desktop__option')).find(option =>
      option.textContent?.includes('CMJ'),
    ) as HTMLButtonElement | undefined;

    cmjOption?.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.selection.value).toEqual(['cmj']);
  });

  it('renders the mobile implementation and uses a drawer-based touch-first pattern', async () => {
    await TestBed.configureTestingModule({
      imports: [AfMultiSelectHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfMultiSelectHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    const mobile = root.querySelector('af-multi-select-mobile') as HTMLElement | null;
    const trigger = root.querySelector('.af-multi-select-mobile__trigger') as HTMLButtonElement | null;

    expect(mobile).not.toBeNull();

    trigger?.click();
    fixture.detectChanges();

    expect(root.querySelector('af-drawer-mobile')).not.toBeNull();

    const option = Array.from(root.querySelectorAll('.af-multi-select-mobile__option')).find(button =>
      button.textContent?.includes('SJ'),
    ) as HTMLButtonElement | undefined;

    option?.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.selection.value).toEqual(['cmj', 'sj']);
  });
});