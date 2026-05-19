import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'af-visually-hidden',
  templateUrl: './af-visually-hidden.component.html',
  styleUrl: './af-visually-hidden.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfVisuallyHiddenComponent {}
