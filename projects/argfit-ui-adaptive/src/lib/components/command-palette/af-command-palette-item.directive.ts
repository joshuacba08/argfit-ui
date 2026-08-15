import { Directive, inject, TemplateRef } from '@angular/core';

import type { AfCommandPaletteItemContext } from '@argfit-ui/core';

@Directive({ selector: 'ng-template[afCommandPaletteItem]' })
export class AfCommandPaletteItemDirective {
  readonly templateRef = inject<TemplateRef<AfCommandPaletteItemContext>>(TemplateRef);

  static ngTemplateContextGuard(
    _directive: AfCommandPaletteItemDirective,
    context: unknown,
  ): context is AfCommandPaletteItemContext {
    return true;
  }
}
