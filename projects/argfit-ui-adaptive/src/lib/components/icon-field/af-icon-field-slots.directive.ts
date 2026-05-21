import { Directive } from '@angular/core';

@Directive({
  selector: '[afIconFieldPrefix]',
})
export class AfIconFieldPrefixDirective {}

@Directive({
  selector: '[afIconFieldControl]',
})
export class AfIconFieldControlDirective {}

@Directive({
  selector: '[afIconFieldSuffix]',
})
export class AfIconFieldSuffixDirective {}

export const AF_ICON_FIELD_SLOT_DIRECTIVES = [
  AfIconFieldPrefixDirective,
  AfIconFieldControlDirective,
  AfIconFieldSuffixDirective,
] as const;