import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type { AfFormOption } from '@argfit-ui/core';

import { AfCheckboxMobileComponent } from '../checkbox/af-checkbox-mobile.component';
import { AfRadioGroupMobileComponent } from '../radio-group/af-radio-group-mobile.component';
import { AfSegmentedControlMobileComponent } from '../segmented-control/af-segmented-control-mobile.component';
import { AfSelectMobileComponent } from '../select/af-select-mobile.component';
import { AfTextareaMobileComponent } from '../textarea/af-textarea-mobile.component';
import { AfToggleMobileComponent } from '../toggle/af-toggle-mobile.component';

@Component({
  imports: [
    AfSelectMobileComponent,
    AfTextareaMobileComponent,
    AfToggleMobileComponent,
    AfCheckboxMobileComponent,
    AfRadioGroupMobileComponent,
    AfSegmentedControlMobileComponent,
  ],
  template: `
    <af-select-mobile label="Periodo" [options]="periodOptions" [value]="period" (valueChange)="period = $event" />
    <af-textarea-mobile label="Notas" error="Campo requerido" [value]="notes" (valueChange)="notes = $event" />
    <af-toggle-mobile label="Audio feedback" [checked]="audio" (checkedChange)="audio = $event" />
    <af-checkbox-mobile label="PDF" [checked]="pdf" (checkedChange)="pdf = $event" />
    <af-radio-group-mobile label="Lateralidad" [options]="lateralityOptions" [value]="laterality" (valueChange)="laterality = $event" />
    <af-segmented-control-mobile label="Test" [options]="testOptions" [value]="testType" (valueChange)="testType = $event" />
  `,
})
class MobileFormControlsHostComponent {
  readonly periodOptions: readonly AfFormOption[] = [
    { value: 'week', label: 'Semana' },
    { value: 'month', label: 'Mes' },
  ];
  readonly lateralityOptions: readonly AfFormOption[] = [
    { value: 'bilateral', label: 'Bilateral' },
    { value: 'right', label: 'Derecha' },
  ];
  readonly testOptions: readonly AfFormOption[] = [
    { value: 'cmj', label: 'CMJ' },
    { value: 'dj', label: 'DJ' },
  ];

  period = 'week';
  notes = '';
  audio = true;
  pdf = false;
  laterality = 'bilateral';
  testType = 'cmj';
}

describe('mobile form controls', () => {
  it('renders mobile surfaces and emits value changes', async () => {
    await TestBed.configureTestingModule({ imports: [MobileFormControlsHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(MobileFormControlsHostComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-select-mobile')?.textContent).toContain('Periodo');
    expect(root.querySelector('af-textarea-mobile[data-state="error"]')?.textContent).toContain('Campo requerido');
    expect(root.querySelector('af-toggle-mobile')?.textContent).toContain('Audio feedback');
    expect(root.querySelector('af-checkbox-mobile')?.textContent).toContain('PDF');
    expect(root.querySelector('af-radio-group-mobile')?.textContent).toContain('Lateralidad');
    expect(root.querySelector('af-segmented-control-mobile')?.textContent).toContain('Test');

    const select = root.querySelector('af-select-mobile select') as HTMLSelectElement;
    select.value = 'month';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(fixture.componentInstance.period).toBe('month');

    const textarea = root.querySelector('af-textarea-mobile textarea') as HTMLTextAreaElement;
    textarea.value = 'Exportar solo sesiones recientes';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.notes).toBe('Exportar solo sesiones recientes');

    (root.querySelector('af-toggle-mobile button') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.audio).toBe(false);

    (root.querySelector('af-checkbox-mobile input') as HTMLInputElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.pdf).toBe(true);

    const radios = root.querySelectorAll('af-radio-group-mobile input');
    (radios[1] as HTMLInputElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.laterality).toBe('right');

    const segmentButtons = root.querySelectorAll('af-segmented-control-mobile button');
    (segmentButtons[1] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.testType).toBe('dj');
  });
});
