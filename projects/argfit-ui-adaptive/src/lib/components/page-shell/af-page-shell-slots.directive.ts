import { Directive } from '@angular/core';

@Directive({
  selector: '[afPageShellBrand]',
  host: { class: 'af-page-shell__brand' },
})
export class AfPageShellBrandDirective {}

@Directive({
  selector: '[afPageShellActions]',
  host: { class: 'af-page-shell__actions' },
})
export class AfPageShellActionsDirective {}

@Directive({
  selector: '[afPageShellUser]',
  host: { class: 'af-page-shell__user' },
})
export class AfPageShellUserDirective {}

@Directive({
  selector: '[afPageShellFooter]',
  host: { class: 'af-page-shell__footer' },
})
export class AfPageShellFooterDirective {}

export const AF_PAGE_SHELL_SLOT_DIRECTIVES = [
  AfPageShellBrandDirective,
  AfPageShellActionsDirective,
  AfPageShellUserDirective,
  AfPageShellFooterDirective,
] as const;
