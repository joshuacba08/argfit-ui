import { Directive } from '@angular/core';

/**
 * Semantic slot directives for `<af-dialog>`.
 *
 * These are pure styling hooks: each directive applies a stable class on its
 * host element so desktop/mobile dialog implementations can render consistent
 * slot styling regardless of the markup the consumer chooses.
 */

@Directive({
  selector: '[afDialogHeader]',
  host: { class: 'af-dialog__header' },
})
export class AfDialogHeaderDirective {}

@Directive({
  selector: '[afDialogTitle]',
  host: { class: 'af-dialog__title' },
})
export class AfDialogTitleDirective {}

@Directive({
  selector: '[afDialogDescription]',
  host: { class: 'af-dialog__description' },
})
export class AfDialogDescriptionDirective {}

@Directive({
  selector: '[afDialogContent]',
  host: { class: 'af-dialog__content' },
})
export class AfDialogContentDirective {}

@Directive({
  selector: '[afDialogFooter]',
  host: { class: 'af-dialog__footer' },
})
export class AfDialogFooterDirective {}

export const AF_DIALOG_SLOT_DIRECTIVES = [
  AfDialogHeaderDirective,
  AfDialogTitleDirective,
  AfDialogDescriptionDirective,
  AfDialogContentDirective,
  AfDialogFooterDirective,
] as const;
