import { Directive, HostListener, output } from '@angular/core';

/**
 * Emits when the user presses Escape on the host element (or a descendant
 * that bubbles the keydown event). Does not perform any side effects on its
 * own — consumers wire up dismiss behaviour via the `afEscape` output.
 */
@Directive({
  selector: '[afEscapeKey]',
  exportAs: 'afEscapeKey',
})
export class AfEscapeKeyDirective {
  readonly afEscape = output<KeyboardEvent>();

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape' && event.key !== 'Esc') {
      return;
    }

    this.afEscape.emit(event);
  }
}
