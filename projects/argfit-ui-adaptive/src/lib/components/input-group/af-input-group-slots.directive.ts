import { Directive } from '@angular/core';

@Directive({
  selector: '[afInputGroupPrefix]',
})
export class AfInputGroupPrefixDirective {}

@Directive({
  selector: '[afInputGroupControl]',
})
export class AfInputGroupControlDirective {}

@Directive({
  selector: '[afInputGroupSuffix]',
})
export class AfInputGroupSuffixDirective {}

export const AF_INPUT_GROUP_SLOT_DIRECTIVES = [
  AfInputGroupPrefixDirective,
  AfInputGroupControlDirective,
  AfInputGroupSuffixDirective,
] as const;