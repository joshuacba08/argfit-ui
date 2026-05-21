import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  contentChild,
  input,
} from '@angular/core';

import type { AfFieldDensity, AfFieldLabelMode, AfFieldState } from '@argfit-ui/core';

import { AfFieldComponent } from '../field/af-field.component';
import {
  AfIconFieldPrefixDirective,
  AfIconFieldControlDirective,
  AfIconFieldSuffixDirective,
} from './af-icon-field-slots.directive';

@Component({
  selector: 'af-icon-field',
  imports: [AfFieldComponent],
  templateUrl: './af-icon-field.component.html',
  styleUrl: './af-icon-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'af-icon-field',
  },
})
export class AfIconFieldComponent {
  readonly label = input<string | undefined>(undefined);
  readonly helperText = input<string | undefined>(undefined);
  readonly errorText = input<string | undefined>(undefined);
  readonly required = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly density = input<AfFieldDensity>('comfortable');
  readonly labelMode = input<AfFieldLabelMode>('stacked');
  readonly state = input<AfFieldState>('default');
  readonly inputId = input<string | undefined>(undefined);

  protected readonly prefix = contentChild(AfIconFieldPrefixDirective);
  protected readonly control = contentChild(AfIconFieldControlDirective);
  protected readonly suffix = contentChild(AfIconFieldSuffixDirective);
}
