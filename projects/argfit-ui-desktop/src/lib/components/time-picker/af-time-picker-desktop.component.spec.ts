import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideArgfitUi } from '@argfit-ui/core';

import { AfTimePickerDesktopComponent } from './af-time-picker-desktop.component';

@Component({
  imports: [AfTimePickerDesktopComponent],
  template: `
    <af-time-picker-desktop
      label="Hora de inicio"
      [value]="value()"
      [min]="min()"
      [max]="max()"
      (valueChange)="emitted = $event"
    />
  `,
})
class HostComponent {
  readonly value = signal('17:30');
  readonly min = signal<string | undefined>(undefined);
  readonly max = signal<string | undefined>(undefined);
  emitted: string | undefined;
}

/**
 * El renderer traduce entre la fecha que maneja PrimeNG y el `HH:mm` civil que es el
 * contrato público. Esa conversión es donde puede perderse la hora, así que se prueba
 * directamente sobre `onModelChange` en vez de a través del overlay del proveedor.
 */
describe('AfTimePickerDesktopComponent', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<HostComponent>>;
  let picker: AfTimePickerDesktopComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    picker = fixture.debugElement.children[0].componentInstance as AfTimePickerDesktopComponent;
  });

  /** `onModelChange` es protegido; el test ejerce el contrato público que dispara. */
  function emitModel(value: Date | string | null): void {
    (picker as unknown as { onModelChange(v: Date | string | null): void }).onModelChange(value);
    fixture.detectChanges();
  }

  it('serializa la fecha del proveedor como HH:mm de 24 horas', () => {
    emitModel(new Date(2000, 0, 1, 18, 45));
    expect(fixture.componentInstance.emitted).toBe('18:45');

    emitModel(new Date(2000, 0, 1, 9, 5));
    expect(fixture.componentInstance.emitted).toBe('09:05');

    // Medianoche no puede colapsar a cadena vacía: 00:00 es una hora válida.
    emitModel(new Date(2000, 0, 1, 0, 0));
    expect(fixture.componentInstance.emitted).toBe('00:00');
  });

  it('acepta una cadena ya normalizada y descarta lo que no es una hora', () => {
    emitModel('07:15');
    expect(fixture.componentInstance.emitted).toBe('07:15');

    emitModel(null);
    expect(fixture.componentInstance.emitted).toBe('');
  });

  it('recorta al rango en vez de descartar la selección en silencio', () => {
    fixture.componentInstance.min.set('09:00');
    fixture.componentInstance.max.set('20:00');
    fixture.detectChanges();

    emitModel(new Date(2000, 0, 1, 7, 30));
    expect(fixture.componentInstance.emitted).toBe('09:00');

    emitModel(new Date(2000, 0, 1, 23, 30));
    expect(fixture.componentInstance.emitted).toBe('20:00');

    emitModel(new Date(2000, 0, 1, 12, 0));
    expect(fixture.componentInstance.emitted).toBe('12:00');
  });

  it('renderiza la etiqueta y marca el campo como obligatorio de forma accesible', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(host.textContent).toContain('Hora de inicio');
    expect(host.querySelector('.af-time-picker-desktop__field')).not.toBeNull();
  });
});
