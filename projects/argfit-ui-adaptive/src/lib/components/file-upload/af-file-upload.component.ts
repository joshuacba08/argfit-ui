import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  numberAttribute,
  output,
} from '@angular/core';

import {
  AfPlatformService,
  type AfFileUploadChange,
  type AfFileUploadDensity,
  type AfFileUploadProgress,
  type AfFileUploadSize,
} from '@argfit-ui/core';
import { AfFileUploadDesktopComponent } from '@argfit-ui/desktop';
import { AfFileUploadMobileComponent } from '@argfit-ui/mobile';

/**
 * File selection with declared constraints and reported rejections.
 *
 * The component selects and presents; it never uploads. Transport, retries, presigned
 * URLs and authentication stay with the application, so the same control serves a direct
 * POST, a background queue or a resumable multipart flow. Feed it `progress` and it will
 * render whatever the application reports.
 *
 * Two behaviours are deliberate and worth keeping:
 * - Limits are announced *before* choosing. Discovering a size cap by failing is a poor
 *   way to learn it.
 * - Rejected files come back through `filesChange`. A file that silently fails to attach
 *   looks exactly like one that worked until someone notices it missing.
 */
@Component({
  selector: 'af-file-upload',
  imports: [AfFileUploadDesktopComponent, AfFileUploadMobileComponent],
  templateUrl: './af-file-upload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfFileUploadComponent {
  private readonly platform = inject(AfPlatformService);

  readonly label = input<string | undefined>(undefined);
  /** Misma sintaxis que el atributo nativo: extensiones, MIME exactos o comodines. */
  readonly accept = input<string | undefined>(undefined);
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly maxSizeBytes = input<number | undefined>(undefined);
  readonly maxFiles = input<number | undefined>(undefined, { transform: numberAttribute });
  readonly files = input<readonly File[]>([]);
  /** Estado de subida que reporta la aplicación, por nombre de archivo. */
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

  protected readonly isMobile = this.platform.isMobile;
}
