import { Directive, ElementRef, inject } from '@angular/core';

/**
 * Marker directive used to flag the element that should receive focus first
 * when a focus trap activates. Has no visual side effects.
 */
@Directive({
  selector: '[afFocusInitial]',
  exportAs: 'afFocusInitial',
})
export class AfFocusInitialDirective {
  readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
}
