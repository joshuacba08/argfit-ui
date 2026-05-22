import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
    EnvironmentProviders,
    inject,
    input,
    makeEnvironmentProviders,
    output,
} from '@angular/core';

export function provideIonicAngular(): EnvironmentProviders {
  return makeEnvironmentProviders([]);
}

@Component({
  selector: 'ion-select',
  imports: [],
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.id]': 'id() ?? null',
    '[attr.name]': 'name() ?? null',
    '[attr.disabled]': 'disabled() ? "" : null',
    '[attr.label]': 'label() ?? null',
    '[attr.label-placement]': 'labelPlacement() ?? null',
    '[attr.placeholder]': 'placeholder() ?? null',
    '[attr.fill]': 'fill() ?? null',
    '[attr.interface]': 'selectInterface() ?? null',
  },
})
export class IonSelect {
  private readonly elementRef = inject<ElementRef<HTMLElement & { label?: string; value?: string }>>(ElementRef);

  readonly id = input<string | undefined>(undefined);
  readonly value = input<string | undefined>(undefined);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly name = input<string | undefined>(undefined);
  readonly label = input<string | undefined>(undefined);
  readonly labelPlacement = input<string | undefined>(undefined);
  readonly placeholder = input<string | undefined>(undefined);
  readonly fill = input<string | undefined>(undefined);
  readonly selectInterface = input<string | undefined>(undefined, { alias: 'interface' });
  readonly interfaceOptions = input<unknown>(undefined);

  constructor() {
    effect(() => {
      const element = this.elementRef.nativeElement;
      element.label = this.label();
      element.value = this.value();
    });
  }
}

@Component({
  selector: 'ion-select-option',
  imports: [],
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.value]': 'value() ?? null',
    '[attr.disabled]': 'disabled() ? "" : null',
  },
})
export class IonSelectOption {
  readonly value = input<string | undefined>(undefined);
  readonly disabled = input(false, { transform: booleanAttribute });
}

@Component({
  selector: 'ion-datetime',
  imports: [],
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.value]': 'value() ?? null',
    '[attr.min]': 'min() ?? null',
    '[attr.max]': 'max() ?? null',
    '[attr.name]': 'name() ?? null',
    '[attr.disabled]': 'disabled() ? "" : null',
    '[attr.readonly]': 'readonly() ? "" : null',
    '[attr.locale]': 'locale() ?? null',
    '[attr.presentation]': 'presentation() ?? null',
  },
})
export class IonDatetime {
  private readonly elementRef = inject<ElementRef<HTMLElement & { value?: string }>>(ElementRef);

  readonly value = input<string | undefined>(undefined);
  readonly min = input<string | undefined>(undefined);
  readonly max = input<string | undefined>(undefined);
  readonly name = input<string | undefined>(undefined);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly firstDayOfWeek = input<number | undefined>(undefined);
  readonly locale = input<string | undefined>(undefined);
  readonly presentation = input<string | undefined>(undefined);
  readonly showDefaultButtons = input(false, { transform: booleanAttribute });
  readonly showClearButton = input(false, { transform: booleanAttribute });
  readonly cancelText = input<string | undefined>(undefined);
  readonly doneText = input<string | undefined>(undefined);
  readonly clearText = input<string | undefined>(undefined);

  readonly ionChange = output<CustomEvent<{ value?: string | readonly string[] | null }>>();
  readonly ionCancel = output<Event>();

  constructor() {
    effect(() => {
      this.elementRef.nativeElement.value = this.value();
    });
  }
}
