import { Directive } from '@angular/core';

/**
 * Semantic slot directives for `<af-card>`.
 *
 * These are pure styling hooks: each directive applies a stable class on its
 * host element so the adaptive desktop/mobile implementations can render
 * consistent slot styling regardless of the markup the consumer chooses.
 */

@Directive({
  selector: '[afCardHeader]',
  host: { class: 'af-card__header' },
})
export class AfCardHeaderDirective {}

@Directive({
  selector: '[afCardTitle]',
  host: { class: 'af-card__title' },
})
export class AfCardTitleDirective {}

@Directive({
  selector: '[afCardSubtitle]',
  host: { class: 'af-card__subtitle' },
})
export class AfCardSubtitleDirective {}

@Directive({
  selector: '[afCardEyebrow]',
  host: { class: 'af-card__eyebrow' },
})
export class AfCardEyebrowDirective {}

@Directive({
  selector: '[afCardContent]',
  host: { class: 'af-card__content' },
})
export class AfCardContentDirective {}

@Directive({
  selector: '[afCardFooter]',
  host: { class: 'af-card__footer' },
})
export class AfCardFooterDirective {}

export const AF_CARD_SLOT_DIRECTIVES = [
  AfCardHeaderDirective,
  AfCardTitleDirective,
  AfCardSubtitleDirective,
  AfCardEyebrowDirective,
  AfCardContentDirective,
  AfCardFooterDirective,
] as const;
