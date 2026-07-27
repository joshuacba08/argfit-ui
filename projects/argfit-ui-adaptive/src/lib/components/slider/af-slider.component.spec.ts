import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { afClampToStep, provideArgfitUi, type AfSliderMark } from '@argfit-ui/core';

import { AfSliderComponent } from './af-slider.component';

const RPE_MARKS: readonly AfSliderMark[] = [
  { value: 1, label: 'Muy suave' },
  { value: 10, label: 'Máximo' },
];

@Component({
  imports: [AfSliderComponent],
  template: `
    <af-slider
      label="RPE objetivo"
      [value]="value()"
      [min]="1"
      [max]="10"
      [step]="1"
      [marks]="marks"
      helperText="Escala 1–10 declarada por el atleta"
      (valueChange)="emitted = $event"
    />
  `,
})
class HostComponent {
  readonly value = signal(6);
  readonly marks = RPE_MARKS;
  emitted: number | undefined;
}

@Component({
  imports: [AfSliderComponent, ReactiveFormsModule],
  template: `<af-slider label="Carga" [min]="0" [max]="100" [formControl]="control" />`,
})
class FormHostComponent {
  readonly control = new FormControl(40, { nonNullable: true });
}

describe('AfSliderComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  async function setup(platform: 'desktop' | 'mobile' = 'desktop') {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideArgfitUi({ platform })],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    return fixture;
  }

  function rangeInput(fixture: { nativeElement: HTMLElement }): HTMLInputElement {
    return fixture.nativeElement.querySelector('input[type="range"]') as HTMLInputElement;
  }

  it('renderiza el renderer de escritorio con el rango y el valor', async () => {
    const fixture = await setup('desktop');
    const input = rangeInput(fixture);

    expect(fixture.nativeElement.querySelector('af-slider-desktop')).not.toBeNull();
    expect(input.min).toBe('1');
    expect(input.max).toBe('10');
    expect(input.value).toBe('6');
  });

  it('renderiza el renderer móvil con el mismo contrato', async () => {
    const fixture = await setup('mobile');

    expect(fixture.nativeElement.querySelector('af-slider-mobile')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('af-slider-desktop')).toBeNull();
    expect(rangeInput(fixture).value).toBe('6');
  });

  it('emite el valor cuando el usuario mueve el control', async () => {
    const fixture = await setup();
    const input = rangeInput(fixture);

    input.value = '8';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.emitted).toBe(8);
  });

  /**
   * §20: un control cuyo valor solo se anuncia como número obliga al usuario a recordar
   * qué significa. Cuando la posición coincide con una marca, se anuncia su etiqueta.
   */
  it('anuncia la etiqueta de la marca en los extremos de la escala', async () => {
    const fixture = await setup();
    const input = rangeInput(fixture);

    expect(input.getAttribute('aria-valuetext')).toBe('6');

    fixture.componentInstance.value.set(10);
    fixture.detectChanges();
    expect(rangeInput(fixture).getAttribute('aria-valuetext')).toBe('Máximo');
  });

  it('enlaza etiqueta, ayuda y estado obligatorio de forma accesible', async () => {
    const fixture = await setup();
    const input = rangeInput(fixture);
    const hint = fixture.nativeElement.querySelector(
      '.af-slider-desktop__message--hint',
    ) as HTMLElement;

    expect(input.getAttribute('aria-describedby')).toBe(hint.id);
    expect(fixture.nativeElement.textContent).toContain('RPE objetivo');
    expect(fixture.nativeElement.textContent).toContain('Escala 1–10');
  });

  it('funciona como ControlValueAccessor', async () => {
    await TestBed.configureTestingModule({
      imports: [FormHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(FormHostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="range"]') as HTMLInputElement;
    expect(input.value).toBe('40');

    input.value = '75';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.control.value).toBe(75);

    fixture.componentInstance.control.disable();
    fixture.detectChanges();
    expect(input.disabled).toBe(true);
  });
});

/**
 * El ajuste al paso vive en core porque decide qué número se emite. Sin él, un paso
 * decimal produce valores como 6.999999999999999 por el redondeo binario, y ese es el
 * valor que acabaría guardado.
 */
describe('afClampToStep', () => {
  it('recorta al rango', () => {
    expect(afClampToStep(-5, 1, 10, 1)).toBe(1);
    expect(afClampToStep(99, 1, 10, 1)).toBe(10);
  });

  it('ajusta a la parada más cercana', () => {
    expect(afClampToStep(6.4, 0, 10, 1)).toBe(6);
    expect(afClampToStep(6.6, 0, 10, 1)).toBe(7);
    expect(afClampToStep(37, 0, 100, 5)).toBe(35);
  });

  it('no arrastra residuos binarios con pasos decimales', () => {
    expect(afClampToStep(0.7, 0, 1, 0.1)).toBe(0.7);
    expect(afClampToStep(0.30000000000000004, 0, 1, 0.1)).toBe(0.3);
  });

  it('devuelve el mínimo ante un valor no numérico', () => {
    expect(afClampToStep(Number.NaN, 3, 9, 1)).toBe(3);
  });
});
