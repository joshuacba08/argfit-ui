import { Directive } from '@angular/core';

@Directive({ selector: '[afAuthShellBackground]' })
export class AfAuthShellBackgroundDirective {}

@Directive({ selector: '[afAuthShellBrand]' })
export class AfAuthShellBrandDirective {}

@Directive({ selector: '[afAuthShellAside]' })
export class AfAuthShellAsideDirective {}

@Directive({ selector: '[afAuthShellFooter]' })
export class AfAuthShellFooterDirective {}

export const AF_AUTH_SHELL_SLOT_DIRECTIVES = [
  AfAuthShellBackgroundDirective,
  AfAuthShellBrandDirective,
  AfAuthShellAsideDirective,
  AfAuthShellFooterDirective,
] as const;
