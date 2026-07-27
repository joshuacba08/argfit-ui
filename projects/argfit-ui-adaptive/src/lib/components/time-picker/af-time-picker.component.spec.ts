import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  afMinutesToTime,
  afTimeToMinutes,
  isAfTimeValue,
  provideArgfitUi,
} from '@argfit-ui/core';

import { AfTimePickerComponent } from './af-time-picker.component';

@Component({
  imports: [AfTimePickerComponent],
  template: `
    <af-time-picker
      label="Hora de inicio"
      [value]="value()"
      [min]="min()"
      [max]="max()"
      [required]="true"
      helperText="Hora local de la sede"
      (valueChange)="lastValue = $event"
    />
  `,
})
class TimePickerHostComponent {
  readonly value = signal('17:30');
  readonly min = signal<string | undefined>(undefined);
  readonly max = signal<string | undefined>(undefined);
  lastValue: string | undefined;
}

@Component({
  imports: [AfTimePickerComponent, ReactiveFormsModule],
  template: `<af-time-picker label="Hora" [formControl]="control" />`,
})
class TimePickerFormHostComponent {
  readonly control = new FormControl('09:00', { nonNullable: true });
}

describe('AfTimePickerComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  async function setup(platform: 'desktop' | 'mobile' = 'desktop') {
    await TestBed.configureTestingModule({
      imports: [TimePickerHostComponent],
      providers: [provideArgfitUi({ platform })],
    }).compileComponents();

    const fixture = TestBed.createComponent(TimePickerHostComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('renderiza el renderer de escritorio y etiqueta el control', async () => {
    const fixture = await setup('desktop');
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('af-time-picker-desktop')).not.toBeNull();
    expect(root.querySelector('af-time-picker-mobile')).toBeNull();
    expect(root.textContent).toContain('Hora de inicio');
    expect(root.textContent).toContain('Hora local de la sede');
  });

  it('renderiza el renderer móvil y muestra la hora en el disparador', async () => {
    const fixture = await setup('mobile');
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('af-time-picker-mobile')).not.toBeNull();
    expect(root.querySelector('af-time-picker-desktop')).toBeNull();

    const trigger = root.querySelector('.af-time-picker-mobile__trigger') as HTMLElement;
    expect(trigger.textContent).toContain('17:30');
  });

  it('expone el error y lo enlaza con aria-describedby', async () => {
    await TestBed.configureTestingModule({
      imports: [TimePickerHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    @Component({
      imports: [AfTimePickerComponent],
      template: `<af-time-picker label="Hora" errorText="La hora es obligatoria" />`,
    })
    class ErrorHostComponent {}

    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [ErrorHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(ErrorHostComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const trigger = root.querySelector('.af-time-picker-mobile__trigger') as HTMLElement;
    const message = root.querySelector('.af-time-picker-mobile__message--error') as HTMLElement;

    expect(message.textContent).toContain('La hora es obligatoria');
    expect(trigger.getAttribute('aria-invalid')).toBe('true');
    expect(trigger.getAttribute('aria-describedby')).toBe(message.id);
  });

  it('funciona como ControlValueAccessor en un formulario reactivo', async () => {
    await TestBed.configureTestingModule({
      imports: [TimePickerFormHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(TimePickerFormHostComponent);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '.af-time-picker-mobile__trigger',
    ) as HTMLElement;
    expect(trigger.textContent).toContain('09:00');

    fixture.componentInstance.control.setValue('18:45');
    fixture.detectChanges();
    expect(trigger.textContent).toContain('18:45');

    fixture.componentInstance.control.disable();
    fixture.detectChanges();
    expect((trigger as HTMLButtonElement).disabled).toBe(true);
  });
});

/**
 * El contrato del valor vive en core y es el que impide que una hora civil se convierta
 * en un instante: `17:30` significa las 17:30 en el reloj de la sede, y no debe moverse
 * al leerse desde otra zona horaria.
 */
describe('utilidades de hora civil', () => {
  it('acepta solo horas válidas de 24 horas', () => {
    expect(isAfTimeValue('00:00')).toBe(true);
    expect(isAfTimeValue('23:59')).toBe(true);
    expect(isAfTimeValue('9:00')).toBe(false);
    expect(isAfTimeValue('24:00')).toBe(false);
    expect(isAfTimeValue('17:60')).toBe(false);
    expect(isAfTimeValue('')).toBe(false);
    expect(isAfTimeValue(undefined)).toBe(false);
  });

  it('convierte entre minutos y HH:mm sin perder información', () => {
    expect(afTimeToMinutes('17:30')).toBe(1050);
    expect(afTimeToMinutes('00:00')).toBe(0);
    expect(afTimeToMinutes('no es una hora')).toBeNull();

    expect(afMinutesToTime(1050)).toBe('17:30');
    expect(afMinutesToTime(0)).toBe('00:00');
    expect(afMinutesToTime(1439)).toBe('23:59');
    // Fuera de un día no hay hora civil que representar.
    expect(afMinutesToTime(1440)).toBe('');
    expect(afMinutesToTime(-1)).toBe('');
  });
});
