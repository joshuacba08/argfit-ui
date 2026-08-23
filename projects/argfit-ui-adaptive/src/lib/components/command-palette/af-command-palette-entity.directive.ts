import { Directive, inject, TemplateRef } from '@angular/core';

import type { AfCommandPaletteEntityContext } from '@argfit-ui/core';

@Directive({ selector: 'ng-template[afCommandPaletteEntity]' })
export class AfCommandPaletteEntityDirective {
  readonly templateRef = inject<TemplateRef<AfCommandPaletteEntityContext>>(TemplateRef);

  static ngTemplateContextGuard(
    _directive: AfCommandPaletteEntityDirective,
    context: unknown,
  ): context is AfCommandPaletteEntityContext {
    return true;
  }
}
