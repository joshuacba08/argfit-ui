import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  afFormatFileSize,
  afMatchesAccept,
  provideArgfitUi,
  type AfFileUploadChange,
  type AfFileUploadProgress,
} from '@argfit-ui/core';

import { AfFileUploadComponent } from './af-file-upload.component';

function fakeFile(name: string, sizeBytes: number, type = 'text/csv'): File {
  const file = new File(['x'], name, { type });
  Object.defineProperty(file, 'size', { value: sizeBytes });
  return file;
}

@Component({
  imports: [AfFileUploadComponent],
  template: `
    <af-file-upload
      label="Archivo de importación"
      accept=".csv,.xlsx"
      [maxSizeBytes]="1048576"
      [maxFiles]="2"
      [multiple]="true"
      [files]="files()"
      [progress]="progress()"
      (filesChange)="lastChange = $event"
      (fileRemoved)="removed = $event"
    />
  `,
})
class HostComponent {
  readonly files = signal<readonly File[]>([]);
  readonly progress = signal<readonly AfFileUploadProgress[]>([]);
  lastChange: AfFileUploadChange | undefined;
  removed: File | undefined;
}

describe('AfFileUploadComponent', () => {
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

  /** El renderer expone el input real; sin él no hay teclado ni selector del sistema. */
  function fileInput(fixture: { nativeElement: HTMLElement }): HTMLInputElement {
    return fixture.nativeElement.querySelector('input[type="file"]') as HTMLInputElement;
  }

  function drop(fixture: { nativeElement: HTMLElement }, files: File[]): void {
    const zone = fixture.nativeElement.querySelector(
      '.af-file-upload-desktop__dropzone',
    ) as HTMLElement;
    const event = new Event('drop') as DragEvent & { dataTransfer: unknown };
    Object.defineProperty(event, 'dataTransfer', { value: { files } });
    zone.dispatchEvent(event);
  }

  it('conserva un input de archivo real y refleja las restricciones', async () => {
    const fixture = await setup('desktop');
    const input = fileInput(fixture);

    expect(input).not.toBeNull();
    expect(input.accept).toBe('.csv,.xlsx');
    expect(input.multiple).toBe(true);
  });

  /** Los límites se anuncian antes de elegir, no como error al fallar. */
  it('publica los límites y los enlaza con aria-describedby', async () => {
    const fixture = await setup('desktop');
    const input = fileInput(fixture);
    const constraints = fixture.nativeElement.querySelector(
      '.af-file-upload-desktop__constraints',
    ) as HTMLElement;

    expect(constraints.textContent).toContain('.csv,.xlsx');
    expect(constraints.textContent).toContain('1 MB');
    expect(constraints.textContent).toContain('Hasta 2 archivos');
    expect(input.getAttribute('aria-describedby')).toContain(constraints.id);
  });

  it('acepta los archivos válidos y devuelve los rechazados con su motivo', async () => {
    const fixture = await setup('desktop');

    drop(fixture, [
      fakeFile('gps.csv', 1000),
      fakeFile('foto.png', 500, 'image/png'),
      fakeFile('enorme.csv', 5_000_000),
    ]);
    fixture.detectChanges();

    const change = fixture.componentInstance.lastChange;
    expect(change?.files.map((f) => f.name)).toEqual(['gps.csv']);
    expect(change?.rejected).toHaveLength(2);
    expect(change?.rejected.find((r) => r.file.name === 'foto.png')?.reason).toBe('type');
    expect(change?.rejected.find((r) => r.file.name === 'enorme.csv')?.reason).toBe('size');
  });

  it('rechaza por encima del máximo de archivos contando los ya seleccionados', async () => {
    const fixture = await setup('desktop');
    fixture.componentInstance.files.set([fakeFile('uno.csv', 100), fakeFile('dos.csv', 100)]);
    fixture.detectChanges();

    drop(fixture, [fakeFile('tres.csv', 100)]);
    fixture.detectChanges();

    const change = fixture.componentInstance.lastChange;
    expect(change?.rejected[0]?.reason).toBe('count');
    expect(change?.files.map((f) => f.name)).toEqual(['uno.csv', 'dos.csv']);
  });

  it('lista los archivos con su tamaño y permite quitarlos', async () => {
    const fixture = await setup('desktop');
    const file = fakeFile('gps_semana30.csv', 2048);
    fixture.componentInstance.files.set([file]);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.textContent).toContain('gps_semana30.csv');
    expect(host.textContent).toContain('2 kB');

    const remove = host.querySelector('.af-file-upload-desktop__remove') as HTMLButtonElement;
    expect(remove.getAttribute('aria-label')).toBe('Quitar archivo: gps_semana30.csv');

    remove.click();
    expect(fixture.componentInstance.removed?.name).toBe('gps_semana30.csv');
  });

  it('muestra el progreso que reporta la aplicación y marca el error como alerta', async () => {
    const fixture = await setup('desktop');
    fixture.componentInstance.files.set([fakeFile('gps.csv', 100)]);
    fixture.componentInstance.progress.set([
      { fileName: 'gps.csv', status: 'error', message: 'El servidor rechazó el archivo' },
    ]);
    fixture.detectChanges();

    const status = fixture.nativeElement.querySelector(
      '.af-file-upload-desktop__item-status',
    ) as HTMLElement;
    expect(status.getAttribute('role')).toBe('alert');
    expect(status.textContent).toContain('El servidor rechazó el archivo');
  });

  it('usa el renderer móvil sin ofrecer arrastre', async () => {
    const fixture = await setup('mobile');
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('af-file-upload-mobile')).not.toBeNull();
    expect(host.querySelector('af-file-upload-desktop')).toBeNull();
    // En móvil no hay arrastre que ofrecer: el copy del drop no se presenta.
    expect(host.querySelector('.af-file-upload-mobile__drop-copy')).toBeNull();
    expect(host.querySelector('input[type="file"]')).not.toBeNull();
  });
});

describe('utilidades de archivo', () => {
  it('formatea tamaños de forma legible', () => {
    expect(afFormatFileSize(0)).toBe('0 B');
    expect(afFormatFileSize(2048)).toBe('2 kB');
    expect(afFormatFileSize(1_048_576)).toBe('1 MB');
    expect(afFormatFileSize(-1)).toBe('—');
  });

  it('acepta extensiones, MIME exactos y comodines', () => {
    const csv = fakeFile('datos.csv', 10, 'text/csv');
    const png = fakeFile('foto.png', 10, 'image/png');

    expect(afMatchesAccept(csv, '.csv')).toBe(true);
    expect(afMatchesAccept(csv, 'text/csv')).toBe(true);
    expect(afMatchesAccept(png, 'image/*')).toBe(true);
    expect(afMatchesAccept(png, '.csv,.xlsx')).toBe(false);
    // Sin lista no hay restricción que aplicar.
    expect(afMatchesAccept(png, undefined)).toBe(true);
  });
});
