import { Directive } from '@angular/core';

@Directive({
  selector: '[afTimelineActions]',
  host: { class: 'af-timeline__actions-slot' },
})
export class AfTimelineActionsDirective {}

@Directive({
  selector: '[afTimelineEmpty]',
  host: { class: 'af-timeline__empty-slot' },
})
export class AfTimelineEmptyDirective {}

@Directive({
  selector: '[afTimelineLoading]',
  host: { class: 'af-timeline__loading-slot' },
})
export class AfTimelineLoadingDirective {}

export const AF_TIMELINE_SLOT_DIRECTIVES = [
  AfTimelineActionsDirective,
  AfTimelineEmptyDirective,
  AfTimelineLoadingDirective,
] as const;
