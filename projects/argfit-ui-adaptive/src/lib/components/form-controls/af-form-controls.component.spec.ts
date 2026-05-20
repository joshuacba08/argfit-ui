import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { provideArgfitUi, type AfFormOption } from '@argfit-ui/core';

import { AfCheckboxComponent } from '../checkbox/af-checkbox.component';
import { AfRadioGroupComponent } from '../radio-group/af-radio-group.component';
import { AfSegmentedControlComponent } from '../segmented-control/af-segmented-control.component';
import { AfSelectComponent } from '../select/af-select.component';
import { AfTextareaComponent } from '../textarea/af-textarea.component';
import { AfToggleComponent } from '../toggle/af-toggle.component';

@Component({
  imports: [
    ReactiveFormsModule,
    AfSelectComponent,
    AfTextareaComponent,
    AfToggleComponent,
    AfCheckboxComponent,
    AfRadioGroupComponent,
    AfSegmentedControlComponent,
  ],
  template: `
    <af-select label="Tipo de test" [options]="testOptions" [formControl]="testType" />
    <af-textarea label="Observaciones" [maxLength]="300" [formControl]="notes" />
    <af-toggle label="Auto-conectar BLE" description="Conectar al abrir" [formControl]="bleAuto" />
    <af-checkbox label="CSV" [formControl]="exportCsv" />
    <af-radio-group label="Lateralidad" [options]="lateralityOptions" [formControl]="laterality" />
    <af-segmented-control label="Categoria" [options]="testOptions" [formControl]="segment" />
  `,
})
class AdaptiveFormControlsHostComponent {
  readonly testOptions: readonly AfFormOption[] = [
    { value: 'cmj', label: 'CMJ' },
    { value: 'sj', label: 'SJ' },
  ];
  readonly lateralityOptions: readonly AfFormOption[] = [
    { value: 'bilateral', label: 'Bilateral' },
    { value: 'left', label: 'Izquierda' },
  ];

  readonly testType = new FormControl<string>('cmj', { nonNullable: true });
  readonly notes = new FormControl<string>('Base', { nonNullable: true });
  readonly bleAuto = new FormControl<boolean>(true, { nonNullable: true });
  readonly exportCsv = new FormControl<boolean>(false, { nonNullable: true });
  readonly laterality = new FormControl<string>('bilateral', { nonNullable: true });
  readonly segment = new FormControl<string>('cmj', { nonNullable: true });
}

describe('adaptive form controls', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders desktop implementations by default', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptiveFormControlsHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptiveFormControlsHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-select-desktop')).not.toBeNull();
    expect(root.querySelector('af-textarea-desktop')).not.toBeNull();
    expect(root.querySelector('af-toggle-desktop')).not.toBeNull();
    expect(root.querySelector('af-checkbox-desktop')).not.toBeNull();
    expect(root.querySelector('af-radio-group-desktop')).not.toBeNull();
    expect(root.querySelector('af-segmented-control-desktop')).not.toBeNull();
  });

  it('renders mobile implementations when platform is mobile', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptiveFormControlsHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptiveFormControlsHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-select-mobile')).not.toBeNull();
    expect(root.querySelector('af-textarea-mobile')).not.toBeNull();
    expect(root.querySelector('af-toggle-mobile')).not.toBeNull();
    expect(root.querySelector('af-checkbox-mobile')).not.toBeNull();
    expect(root.querySelector('af-radio-group-mobile')).not.toBeNull();
    expect(root.querySelector('af-segmented-control-mobile')).not.toBeNull();
  });

  it('synchronizes all controls through ControlValueAccessor', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptiveFormControlsHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptiveFormControlsHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;

    const select = root.querySelector('af-select-desktop') as HTMLElement;
    expect(select.querySelector('p-select.af-select-desktop__select')).not.toBeNull();
    fixture.debugElement.query(By.css('af-select-desktop')).triggerEventHandler('valueChange', 'sj');
    fixture.detectChanges();
    expect(fixture.componentInstance.testType.value).toBe('sj');

    const textarea = root.querySelector('af-textarea-desktop textarea') as HTMLTextAreaElement;
    expect(textarea.value).toBe('Base');
    textarea.value = 'Carga reducida';
    textarea.dispatchEvent(new Event('input'));
    textarea.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(fixture.componentInstance.notes.value).toBe('Carga reducida');
    expect(fixture.componentInstance.notes.touched).toBe(true);

    (root.querySelector('af-toggle-desktop button') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.bleAuto.value).toBe(false);

    (root.querySelector('af-checkbox-desktop input') as HTMLInputElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.exportCsv.value).toBe(true);

    const radios = root.querySelectorAll('af-radio-group-desktop input');
    (radios[1] as HTMLInputElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.laterality.value).toBe('left');

    const segments = root.querySelectorAll('af-segmented-control-desktop button');
    (segments[1] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.segment.value).toBe('sj');

    fixture.componentInstance.testType.disable();
    fixture.detectChanges();
    expect(select.hasAttribute('data-disabled')).toBe(true);

    fixture.componentInstance.notes.setValue('Actualizado desde FormControl');
    fixture.detectChanges();
    expect(textarea.value).toBe('Actualizado desde FormControl');
  });
});
