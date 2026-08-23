import { Directive, inject, TemplateRef } from '@angular/core';

import type { AfCommandPaletteResultContext } from '@argfit-ui/core';

@Directive({ selector: 'ng-template[afCommandPaletteCommand]' })
export class AfCommandPaletteCommandDirective {
  readonly templateRef = inject<TemplateRef<AfCommandPaletteResultContext>>(TemplateRef);

  static ngTemplateContextGuard(
    _directive: AfCommandPaletteCommandDirective,
    context: unknown,
  ): context is AfCommandPaletteResultContext {
    return true;
  }
}
