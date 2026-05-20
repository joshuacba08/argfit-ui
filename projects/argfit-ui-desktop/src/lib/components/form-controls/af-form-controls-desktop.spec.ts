import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';

import type { AfFormOption } from '@argfit-ui/core';

import { AfCheckboxDesktopComponent } from '../checkbox/af-checkbox-desktop.component';
import { AfRadioGroupDesktopComponent } from '../radio-group/af-radio-group-desktop.component';
import { AfSegmentedControlDesktopComponent } from '../segmented-control/af-segmented-control-desktop.component';
import { AfSelectDesktopComponent } from '../select/af-select-desktop.component';
import { AfTextareaDesktopComponent } from '../textarea/af-textarea-desktop.component';
import { AfToggleDesktopComponent } from '../toggle/af-toggle-desktop.component';

@Component({
  imports: [
    AfSelectDesktopComponent,
    AfTextareaDesktopComponent,
    AfToggleDesktopComponent,
    AfCheckboxDesktopComponent,
    AfRadioGroupDesktopComponent,
    AfSegmentedControlDesktopComponent,
  ],
  template: `
    <af-select-desktop
      label="Tipo de test"
      error="Selecciona un test"
      [options]="testOptions"
      [value]="testType"
      (valueChange)="testType = $event"
    />
    <af-textarea-desktop
      label="Observaciones"
      hint="Maximo 140 caracteres"
      [maxLength]="140"
      [value]="notes"
      (valueChange)="notes = $event"
    />
    <af-toggle-desktop
      label="Auto-conectar BLE"
      description="Conectar al abrir"
      [checked]="bleAuto"
      (checkedChange)="bleAuto = $event"
    />
    <af-checkbox-desktop
      label="CSV"
      hint="Datos tabulares"
      [checked]="exportCsv"
      (checkedChange)="exportCsv = $event"
    />
    <af-radio-group-desktop
      label="Lateralidad"
      [options]="lateralityOptions"
      [value]="laterality"
      (valueChange)="laterality = $event"
    />
    <af-segmented-control-desktop
      label="Categoria"
      [options]="segmentOptions"
      [value]="category"
      (valueChange)="category = $event"
    />
  `,
})
class DesktopFormControlsHostComponent {
  readonly testOptions: readonly AfFormOption[] = [
    { value: 'cmj', label: 'CMJ' },
    { value: 'sj', label: 'SJ' },
  ];
  readonly lateralityOptions: readonly AfFormOption[] = [
    { value: 'bilateral', label: 'Bilateral' },
    { value: 'left', label: 'Izquierda' },
  ];
  readonly segmentOptions: readonly AfFormOption[] = [
    { value: 'force', label: 'Fuerza' },
    { value: 'power', label: 'Potencia' },
  ];

  testType = 'cmj';
  notes = '';
  bleAuto = true;
  exportCsv = false;
  laterality = 'bilateral';
  category = 'force';
}

describe('desktop form controls', () => {
  it('renders labels, states and emits value changes', async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopFormControlsHostComponent],
      providers: [providePrimeNG()],
    }).compileComponents();

    const fixture = TestBed.createComponent(DesktopFormControlsHostComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-select-desktop[data-state="error"]')?.textContent).toContain('Tipo de test');
    expect(root.querySelector('af-textarea-desktop')?.textContent).toContain('Observaciones');
    expect(root.querySelector('af-toggle-desktop')?.textContent).toContain('Auto-conectar BLE');
    expect(root.querySelector('af-checkbox-desktop')?.textContent).toContain('CSV');
    expect(root.querySelector('af-radio-group-desktop')?.textContent).toContain('Lateralidad');
    expect(root.querySelector('af-segmented-control-desktop')?.textContent).toContain('Categoria');

    const select = root.querySelector('af-select-desktop') as HTMLElement;
    expect(select.getAttribute('data-state')).toBe('error');
    expect(select.textContent).toContain('Selecciona un test');

    const primeSelect = root.querySelector('af-select-desktop p-select.af-select-desktop__select');
    expect(primeSelect).not.toBeNull();
    fixture.debugElement.query(By.css('af-select-desktop p-select')).triggerEventHandler('onChange', { value: 'sj' });
    fixture.detectChanges();
    expect(fixture.componentInstance.testType).toBe('sj');

    const textarea = root.querySelector('af-textarea-desktop textarea') as HTMLTextAreaElement;
    textarea.value = 'Sesion con carga reducida';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.notes).toBe('Sesion con carga reducida');

    const toggle = root.querySelector('af-toggle-desktop button') as HTMLButtonElement;
    toggle.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.bleAuto).toBe(false);

    const checkbox = root.querySelector('af-checkbox-desktop input') as HTMLInputElement;
    checkbox.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.exportCsv).toBe(true);

    const radios = root.querySelectorAll('af-radio-group-desktop input');
    (radios[1] as HTMLInputElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.laterality).toBe('left');

    const segmentButtons = root.querySelectorAll('af-segmented-control-desktop button');
    (segmentButtons[1] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.category).toBe('power');
  });
});
