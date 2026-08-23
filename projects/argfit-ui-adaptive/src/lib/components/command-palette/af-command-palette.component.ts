import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DestroyRef,
  effect,
  inject,
  output,
} from '@angular/core';

import {
  AfCommandPaletteService,
  AfPlatformService,
  type AfCommandExecutionEvent,
  type AfCommandPaletteEntityTemplate,
  type AfCommandPaletteResult,
  type AfCommandPaletteResultTemplate,
} from '@argfit-ui/core';
import { AfCommandPaletteDesktopComponent } from '@argfit-ui/desktop';
import { AfCommandPaletteMobileComponent } from '@argfit-ui/mobile';

import { AfCommandPaletteCommandDirective } from './af-command-palette-command.directive';
import { AfCommandPaletteEntityDirective } from './af-command-palette-entity.directive';

interface AfCommandPaletteGroup {
  readonly id: string;
  readonly label?: string;
  readonly items: readonly AfCommandPaletteResult[];
}

@Component({
  selector: 'af-command-palette',
  imports: [AfCommandPaletteDesktopComponent, AfCommandPaletteMobileComponent],
  templateUrl: './af-command-palette.component.html',
  styleUrl: './af-command-palette.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfCommandPaletteComponent {
  private readonly platform = inject(AfPlatformService);
  protected readonly palette = inject(AfCommandPaletteService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly resultTemplateDirective = contentChild(AfCommandPaletteCommandDirective);
  private readonly entityTemplateDirective = contentChild(AfCommandPaletteEntityDirective);

  readonly commandExecution = output<AfCommandExecutionEvent>();

  protected readonly isMobile = this.platform.isMobile;
  protected readonly resultTemplate = computed<AfCommandPaletteResultTemplate | undefined>(
    () => this.resultTemplateDirective()?.templateRef,
  );
  protected readonly entityTemplate = computed<AfCommandPaletteEntityTemplate | undefined>(
    () => this.entityTemplateDirective()?.templateRef,
  );
  protected readonly groups = computed<readonly AfCommandPaletteGroup[]>(() => {
    const groups = new Map<string, AfCommandPaletteGroup>();
    for (const result of this.palette.results()) {
      const key = result.group ?? '';
      const current = groups.get(key);
      groups.set(key, {
        id: current?.id ?? `group-${groups.size}`,
        label: result.group,
        items: [...(current?.items ?? []), result],
      });
    }
    return [...groups.values()];
  });

  constructor() {
    const detachHost = this.palette.attachHost();
    this.destroyRef.onDestroy(detachHost);
    let previousEvent: AfCommandExecutionEvent | null = null;
    effect(() => {
      const event = this.palette.executionEvent();
      if (event && event !== previousEvent) {
        previousEvent = event;
        this.commandExecution.emit(event);
      }
    });
  }

  protected onOpenChange(open: boolean): void {
    open ? this.palette.open() : this.palette.close();
  }
}
