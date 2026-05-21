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
  AfInputGroupPrefixDirective,
  AfInputGroupControlDirective,
  AfInputGroupSuffixDirective,
} from './af-input-group-slots.directive';

@Component({
  selector: 'af-input-group',
  imports: [AfFieldComponent],
  templateUrl: './af-input-group.component.html',
  styleUrl: './af-input-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'af-input-group',
  },
})
export class AfInputGroupComponent {
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

  protected readonly prefix = contentChild(AfInputGroupPrefixDirective);
  protected readonly control = contentChild(AfInputGroupControlDirective);
  protected readonly suffix = contentChild(AfInputGroupSuffixDirective);
}