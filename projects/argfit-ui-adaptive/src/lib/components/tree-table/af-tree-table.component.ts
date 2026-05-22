import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    contentChildren,
    inject,
    input,
    output,
    viewChild,
    type TemplateRef,
} from '@angular/core';

import {
    AfPlatformService,
    type AfDataTableColumn,
    type AfTreeTableCellTemplate,
    type AfTreeTableDensity,
    type AfTreeTableExpandedIds,
    type AfTreeTableNode,
    type AfTreeTableSelectedIds,
    type AfTreeTableSelectionMode,
} from '@argfit-ui/core';
import { AfTreeTableDesktopComponent } from '@argfit-ui/desktop';
import { AfTreeTableMobileComponent } from '@argfit-ui/mobile';

import { AfTreeTableCellDirective } from './af-tree-table-cell.directive';
import {
    AfTreeTableActionsDirective,
    AfTreeTableEmptyDirective,
    AfTreeTableLoadingDirective,
} from './af-tree-table-slots.directive';

@Component({
  selector: 'af-tree-table',
  imports: [AfTreeTableDesktopComponent, AfTreeTableMobileComponent],
  templateUrl: './af-tree-table.component.html',
  styleUrl: './af-tree-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfTreeTableComponent {
  private readonly platform = inject(AfPlatformService);

  readonly columns = input.required<readonly AfDataTableColumn[]>();
  readonly nodes = input<readonly AfTreeTableNode[]>([]);
  readonly treeColumnKey = input<string | undefined>(undefined);
  readonly selectedIds = input<AfTreeTableSelectedIds>([]);
  readonly expandedIds = input<AfTreeTableExpandedIds>([]);
  readonly selectionMode = input<AfTreeTableSelectionMode>('single');
  readonly density = input<AfTreeTableDensity>('normal');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly error = input<string | undefined>(undefined);
  readonly emptyTitle = input('Sin nodos');
  readonly emptyDescription = input<string | undefined>(undefined);
  readonly ariaLabel = input('Tabla jerarquica');

  readonly selectionChange = output<AfTreeTableSelectedIds>();
  readonly expandedChange = output<AfTreeTableExpandedIds>();
  readonly nodePressed = output<AfTreeTableNode>();

  private readonly cellTemplateDirectives = contentChildren(AfTreeTableCellDirective);
  private readonly actionsSlot = contentChild(AfTreeTableActionsDirective);
  private readonly emptySlot = contentChild(AfTreeTableEmptyDirective);
  private readonly loadingSlot = contentChild(AfTreeTableLoadingDirective);
  private readonly actionsTemplate = viewChild<TemplateRef<unknown>>('treeTableActions');
  private readonly emptyTemplate = viewChild<TemplateRef<unknown>>('treeTableEmpty');
  private readonly loadingTemplate = viewChild<TemplateRef<unknown>>('treeTableLoading');

  protected readonly isMobile = this.platform.isMobile;
  protected readonly cellTemplates = computed<readonly AfTreeTableCellTemplate[]>(() =>
    this.cellTemplateDirectives().map((directive) => ({
      columnKey: directive.columnKey(),
      template: directive.templateRef,
    })),
  );
  protected readonly projectedActionsTemplate = computed(() =>
    this.actionsSlot() ? this.actionsTemplate() : undefined,
  );
  protected readonly projectedEmptyTemplate = computed(() =>
    this.emptySlot() ? this.emptyTemplate() : undefined,
  );
  protected readonly projectedLoadingTemplate = computed(() =>
    this.loadingSlot() ? this.loadingTemplate() : undefined,
  );
}
