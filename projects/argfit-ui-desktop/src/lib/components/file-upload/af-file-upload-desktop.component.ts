import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    numberAttribute,
    output,
    signal,
    ViewEncapsulation,
} from '@angular/core';

import {
    afFormatFileSize,
    afMatchesAccept,
    type AfFileRejection,
    type AfFileUploadChange,
    type AfFileUploadDensity,
    type AfFileUploadProgress,
    type AfFileUploadSize,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

let nextAfDesktopFileUploadId = 0;

/**
 * Desktop renderer for `AfFileUpload`.
 *
 * Keeps a real `<input type="file">` as the control: it is what makes the keyboard path,
 * the OS picker and assistive technology work without reimplementation. The drop zone is
 * an enhancement layered on top, never the only way in.
 */
@Component({
  selector: 'af-file-upload-desktop',
  imports: [AfIconComponent],
  templateUrl: './af-file-upload-desktop.component.html',
  styleUrl: './af-file-upload-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-file-upload-desktop',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'density()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-invalid]': 'errorText() ? "" : null',
    '[attr.data-dragging]': 'dragging() ? "" : null',
  },
})
export class AfFileUploadDesktopComponent {
  private readonly defaultInputId = `af-file-upload-desktop-${++nextAfDesktopFileUploadId}`;

  readonly label = input<string | undefined>(undefined);
  readonly accept = input<string | undefined>(undefined);
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly maxSizeBytes = input<number | undefined>(undefined);
  readonly maxFiles = input<number | undefined>(undefined, { transform: numberAttribute });
  readonly files = input<readonly File[]>([]);
  readonly progress = input<readonly AfFileUploadProgress[]>([]);
  readonly helperText = input<string | undefined>(undefined);
  readonly errorText = input<string | undefined>(undefined);
  readonly required = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly size = input<AfFileUploadSize>('md');
  readonly density = input<AfFileUploadDensity>('comfortable');
  readonly name = input<string | undefined>(undefined);
  readonly inputId = input<string | undefined>(undefined);
  readonly buttonLabel = input('Elegir archivos');
  readonly dropLabel = input('o arrastra los archivos aquí');
  readonly removeLabel = input('Quitar archivo');

  readonly filesChange = output<AfFileUploadChange>();
  readonly fileRemoved = output<File>();

  protected readonly dragging = signal(false);

  protected readonly resolvedInputId = computed(() => this.inputId() ?? this.defaultInputId);
  protected readonly labelId = computed(() => `${this.resolvedInputId()}-label`);
  protected readonly hintId = computed(() => `${this.resolvedInputId()}-hint`);
  protected readonly errorId = computed(() => `${this.resolvedInputId()}-error`);
  protected readonly describedBy = computed(() => {
    const ids = [this.constraintsId()];
    if (this.errorText()) {
      ids.push(this.errorId());
    } else if (this.helperText()) {
      ids.push(this.hintId());
    }
    return ids.join(' ');
  });
  protected readonly constraintsId = computed(() => `${this.resolvedInputId()}-constraints`);

  /**
   * Los límites se anuncian antes de elegir, no como error después.
   * Un usuario no debería descubrir el tamaño máximo fallando.
   */
  protected readonly constraintsText = computed(() => {
    const parts: string[] = [];
    const accept = this.accept();
    if (accept) {
      parts.push(`Formatos: ${accept}`);
    }
    const maxSize = this.maxSizeBytes();
    if (maxSize !== undefined) {
      parts.push(`Máximo ${afFormatFileSize(maxSize)} por archivo`);
    }
    const maxFiles = this.maxFiles();
    if (maxFiles !== undefined) {
      parts.push(maxFiles === 1 ? 'Un archivo' : `Hasta ${maxFiles} archivos`);
    }
    return parts.join(' · ');
  });

  protected onSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.accept_(Array.from(target.files ?? []));
    // Permite volver a elegir el mismo archivo tras quitarlo.
    target.value = '';
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
    if (this.disabled()) {
      return;
    }
    this.accept_(Array.from(event.dataTransfer?.files ?? []));
  }

  protected onDragOver(event: DragEvent): void {
    if (this.disabled()) {
      return;
    }
    event.preventDefault();
    this.dragging.set(true);
  }

  protected onDragLeave(): void {
    this.dragging.set(false);
  }

  protected remove(file: File): void {
    this.fileRemoved.emit(file);
  }

  protected sizeOf(file: File): string {
    return afFormatFileSize(file.size);
  }

  protected progressFor(file: File): AfFileUploadProgress | undefined {
    return this.progress().find((entry) => entry.fileName === file.name);
  }

  /**
   * Filtra la selección y **reporta lo descartado**.
   *
   * Un archivo rechazado en silencio es indistinguible de uno aceptado hasta que el
   * usuario descubre, mucho después, que no estaba.
   */
  private accept_(incoming: readonly File[]): void {
    const accepted: File[] = [];
    const rejected: AfFileRejection[] = [];
    const maxSize = this.maxSizeBytes();
    const maxFiles = this.maxFiles();
    const alreadySelected = this.multiple() ? this.files().length : 0;

    for (const file of incoming) {
      if (!afMatchesAccept(file, this.accept())) {
        rejected.push({
          file,
          reason: 'type',
          message: `«${file.name}» no tiene un formato admitido.`,
        });
        continue;
      }

      if (maxSize !== undefined && file.size > maxSize) {
        rejected.push({
          file,
          reason: 'size',
          message: `«${file.name}» pesa ${afFormatFileSize(file.size)} y el máximo es ${afFormatFileSize(maxSize)}.`,
        });
        continue;
      }

      if (maxFiles !== undefined && alreadySelected + accepted.length >= maxFiles) {
        rejected.push({
          file,
          reason: 'count',
          message: `«${file.name}» supera el máximo de ${maxFiles} archivos.`,
        });
        continue;
      }

      accepted.push(file);
    }

    const files = this.multiple() ? [...this.files(), ...accepted] : accepted.slice(0, 1);
    this.filesChange.emit({ files, rejected });
  }
}
