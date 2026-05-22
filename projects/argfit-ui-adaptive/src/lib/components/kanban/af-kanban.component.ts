import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    inject,
    input,
    output,
} from '@angular/core';

import {
    AfPlatformService,
    type AfKanbanAddCardEvent,
    type AfKanbanCard,
    type AfKanbanCardClickEvent,
    type AfKanbanCardFooterTemplate,
    type AfKanbanCardTemplate,
    type AfKanbanColumn,
    type AfKanbanColumnActionEvent,
    type AfKanbanColumnHeaderTemplate,
    type AfKanbanDensity,
    type AfKanbanEmptyState,
    type AfKanbanEmptyTemplate,
    type AfKanbanFilter,
    type AfKanbanFilterChange,
    type AfKanbanMoveEvent,
} from '@argfit-ui/core';
import { AfKanbanDesktopComponent } from '@argfit-ui/desktop';
import { AfKanbanMobileComponent } from '@argfit-ui/mobile';

import { AfKanbanCardDirective } from './af-kanban-card.directive';
import { AfKanbanCardFooterDirective, AfKanbanColumnHeaderDirective, AfKanbanEmptyDirective } from './af-kanban-slots.directive';

const DEFAULT_EMPTY_STATE: AfKanbanEmptyState = {
  title: 'Sin rutinas',
  description: 'Ajusta filtros o agrega una nueva rutina para llenar esta columna.',
};

@Component({
  selector: 'af-kanban',
  imports: [AfKanbanDesktopComponent, AfKanbanMobileComponent],
  templateUrl: './af-kanban.component.html',
  styleUrl: './af-kanban.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfKanbanComponent {
  private readonly platform = inject(AfPlatformService);

  readonly columns = input<readonly AfKanbanColumn[]>([]);
  readonly cards = input<readonly AfKanbanCard[]>([]);
  readonly filters = input<readonly AfKanbanFilter[]>([]);
  readonly activeFilter = input<string | undefined>(undefined);
  readonly title = input<string | undefined>(undefined);
  readonly ariaLabel = input('Kanban');
  readonly cardIdKey = input<keyof AfKanbanCard>('id');
  readonly columnIdKey = input<keyof AfKanbanCard>('columnId');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly allowReorder = input(true, { transform: booleanAttribute });
  readonly allowCrossColumnMove = input(true, { transform: booleanAttribute });
  readonly density = input<AfKanbanDensity>('comfortable');
  readonly emptyState = input<AfKanbanEmptyState>(DEFAULT_EMPTY_STATE);

  readonly cardMove = output<AfKanbanMoveEvent>();
  readonly cardClick = output<AfKanbanCardClickEvent>();
  readonly addCard = output<AfKanbanAddCardEvent>();
  readonly filterChange = output<AfKanbanFilterChange>();
  readonly columnAction = output<AfKanbanColumnActionEvent>();

  private readonly cardTemplateDirective = contentChild(AfKanbanCardDirective);
  private readonly columnHeaderDirective = contentChild(AfKanbanColumnHeaderDirective);
  private readonly emptyDirective = contentChild(AfKanbanEmptyDirective);
  private readonly cardFooterDirective = contentChild(AfKanbanCardFooterDirective);

  protected readonly isMobile = this.platform.isMobile;
  protected readonly cardTemplate = computed<AfKanbanCardTemplate | undefined>(() => this.cardTemplateDirective()?.templateRef);
  protected readonly columnHeaderTemplate = computed<AfKanbanColumnHeaderTemplate | undefined>(
    () => this.columnHeaderDirective()?.templateRef,
  );
  protected readonly emptyTemplate = computed<AfKanbanEmptyTemplate | undefined>(() => this.emptyDirective()?.templateRef);
  protected readonly cardFooterTemplate = computed<AfKanbanCardFooterTemplate | undefined>(
    () => this.cardFooterDirective()?.templateRef,
  );
}
