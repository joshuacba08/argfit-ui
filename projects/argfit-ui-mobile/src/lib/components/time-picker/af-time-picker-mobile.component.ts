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
import { IonDatetime } from '@ionic/angular/standalone';

import {
    afMinutesToTime,
    afTimeToMinutes,
    isAfTimeValue,
    type AfTimePickerDensity,
    type AfTimePickerMinuteStep,
    type AfTimePickerSize,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

import { AfDialogMobileComponent } from '../dialog/af-dialog-mobile.component';

interface AfIonDatetimeChangeDetail {
  readonly value?: string | readonly string[] | null;
}

/** Día portador para `ion-datetime`: solo se conservan hora y minuto. */
const CARRIER_DATE = '2000-01-01';

let nextAfMobileTimePickerId = 0;

/**
 * Mobile renderer for `AfTimePicker`, backed by Ionic's wheel picker in `time` mode.
 *
 * Opens in a sheet rather than inline: on a phone a time wheel inside the form pushes the
 * rest of the fields off-screen, and during a session the coach needs the surrounding
 * context to stay put.
 */
@Component({
  selector: 'af-time-picker-mobile',
  imports: [AfIconComponent, IonDatetime, AfDialogMobileComponent],
  templateUrl: './af-time-picker-mobile.component.html',
  styleUrl: './af-time-picker-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-time-picker-mobile',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'density()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-readonly]': 'readonly() ? "" : null',
    '[attr.data-invalid]': 'errorText() ? "" : null',
  },
})
export class AfTimePickerMobileComponent {
  private readonly defaultInputId = `af-time-picker-mobile-${++nextAfMobileTimePickerId}`;

  readonly value = input('');
  readonly label = input<string | undefined>(undefined);
  readonly placeholder = input<string | undefined>(undefined);
  readonly helperText = input<string | undefined>(undefined);
  readonly errorText = input<string | undefined>(undefined);
  readonly min = input<string | undefined>(undefined);
  readonly max = input<string | undefined>(undefined);
  readonly minuteStep = input<AfTimePickerMinuteStep, unknown>(5, {
    transform: (raw) => numberAttribute(raw, 5) as AfTimePickerMinuteStep,
  });
  readonly required = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly size = input<AfTimePickerSize>('md');
  readonly density = input<AfTimePickerDensity>('comfortable');
  readonly name = input<string | undefined>(undefined);
  readonly inputId = input<string | undefined>(undefined);

  readonly valueChange = output<string>();
  readonly focusChange = output<boolean>();

  protected readonly resolvedInputId = computed(() => this.inputId() ?? this.defaultInputId);
  protected readonly labelId = computed(() => `${this.resolvedInputId()}-label`);
  protected readonly ariaLabelledBy = computed(() => (this.label() ? this.labelId() : null));
  protected readonly ariaLabel = computed(() =>
    this.label() ? null : (this.placeholder() ?? 'Selecciona una hora'),
  );
  protected readonly hintId = computed(() => `${this.resolvedInputId()}-hint`);
  protected readonly errorId = computed(() => `${this.resolvedInputId()}-error`);
  protected readonly modalId = computed(() => `${this.resolvedInputId()}-dialog`);
  protected readonly open = signal(false);

  protected readonly datetimeValue = computed(() => this.toCarrier(this.value()));
  protected readonly minDatetime = computed(() => this.toCarrier(this.min()));
  protected readonly maxDatetime = computed(() => this.toCarrier(this.max()));

  protected readonly displayValue = computed(() => {
    const value = this.value();
    return isAfTimeValue(value) ? value : (this.placeholder() ?? 'Selecciona una hora');
  });

  /**
   * Ionic expresa la granularidad como lista explícita de minutos, no como paso.
   * Con `minuteStep = 1` se devuelve `undefined` para no construir 60 entradas inútiles.
   */
  protected readonly minuteValues = computed<number[] | undefined>(() => {
    const step = this.minuteStep();
    if (step <= 1) {
      return undefined;
    }
    return Array.from({ length: Math.ceil(60 / step) }, (_, index) => index * step);
  });

  protected readonly describedBy = computed(() => {
    if (this.errorText()) {
      return this.errorId();
    }
    if (this.helperText()) {
      return this.hintId();
    }
    return null;
  });

  protected requestOpen(): void {
    if (this.disabled() || this.readonly()) {
      return;
    }
    this.open.set(true);
    this.focusChange.emit(true);
  }

  protected onOverlayOpenChange(next: boolean): void {
    if (next) {
      if (!this.open()) {
        this.open.set(true);
        this.focusChange.emit(true);
      }
      return;
    }
    this.closeOverlay();
  }

  protected onDatetimeChange(event: CustomEvent<AfIonDatetimeChangeDetail>): void {
    if (this.readonly()) {
      return;
    }
    this.valueChange.emit(this.serialize(event.detail.value));
    this.closeOverlay();
  }

  protected onModalDismiss(): void {
    this.closeOverlay();
  }

  private closeOverlay(): void {
    if (!this.open()) {
      return;
    }
    this.open.set(false);
    this.focusChange.emit(false);
  }

  /** `ion-datetime` necesita un ISO completo; el día es fijo y se descarta al leer. */
  private toCarrier(value: string | undefined): string | undefined {
    const minutes = afTimeToMinutes(value);
    if (minutes === null) {
      return undefined;
    }
    return `${CARRIER_DATE}T${afMinutesToTime(minutes)}:00`;
  }

  private serialize(value: string | readonly string[] | undefined | null): string {
    const raw = Array.isArray(value) ? value[0] : value;
    if (typeof raw !== 'string' || raw === '') {
      return '';
    }
    const match = /T([01]\d|2[0-3]):([0-5]\d)/.exec(raw);
    return match ? `${match[1]}:${match[2]}` : '';
  }
}
