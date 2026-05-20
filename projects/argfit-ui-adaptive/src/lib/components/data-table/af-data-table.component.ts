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
    type AfDataTableCellTemplate,
    type AfDataTableColumn,
    type AfDataTableDensity,
    type AfDataTableExpandedRowTemplate,
    type AfDataTablePageChange,
    type AfDataTablePagination,
    type AfDataTableSelectionMode,
    type AfDataTableSort,
} from '@argfit-ui/core';
import { AfDataTableDesktopComponent } from '@argfit-ui/desktop';
import { AfDataTableMobileComponent } from '@argfit-ui/mobile';

import { AfDataTableCellDirective, AfDataTableExpandedRowDirective } from './af-data-table-cell.directive';
import { AfDataTableEmptyDirective, AfDataTableToolbarDirective } from './af-data-table-slots.directive';

@Component({
  selector: 'af-data-table',
  imports: [AfDataTableDesktopComponent, AfDataTableMobileComponent],
  templateUrl: './af-data-table.component.html',
  styleUrl: './af-data-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfDataTableComponent {
  private readonly platform = inject(AfPlatformService);

  readonly columns = input.required<readonly AfDataTableColumn[]>();
  readonly rows = input<readonly unknown[]>([]);
  readonly rowIdKey = input('id');
  readonly density = input<AfDataTableDensity>('normal');
  readonly selectionMode = input<AfDataTableSelectionMode>('none');
  readonly selectedRowIds = input<readonly string[]>([]);
  readonly expandedRowIds = input<readonly string[]>([]);
  readonly sort = input<AfDataTableSort | undefined>(undefined);
  readonly pagination = input<AfDataTablePagination | undefined>(undefined);
  readonly loading = input(false, { transform: booleanAttribute });
  readonly error = input<string | undefined>(undefined);
  readonly emptyTitle = input('Sin datos');
  readonly emptyDescription = input<string | undefined>(undefined);
  readonly ariaLabel = input('Tabla de datos');

  readonly sortChange = output<AfDataTableSort>();
  readonly pageChange = output<AfDataTablePageChange>();
  readonly rowPressed = output<unknown>();
  readonly selectionChange = output<readonly string[]>();
  readonly rowExpandedChange = output<readonly string[]>();

  private readonly cellTemplateDirectives = contentChildren(AfDataTableCellDirective);
  private readonly expandedRowDirective = contentChild(AfDataTableExpandedRowDirective);
  private readonly toolbarSlot = contentChild(AfDataTableToolbarDirective);
  private readonly emptySlot = contentChild(AfDataTableEmptyDirective);
  private readonly toolbarTemplate = viewChild<TemplateRef<unknown>>('dataTableToolbar');
  private readonly emptyTemplate = viewChild<TemplateRef<unknown>>('dataTableEmpty');

  protected readonly isMobile = this.platform.isMobile;
  protected readonly cellTemplates = computed<readonly AfDataTableCellTemplate[]>(() =>
    this.cellTemplateDirectives().map((directive) => ({
      columnKey: directive.columnKey(),
      template: directive.templateRef,
    })),
  );
  protected readonly expandedRowTemplate = computed<AfDataTableExpandedRowTemplate | undefined>(
    () => this.expandedRowDirective()?.templateRef,
  );
  protected readonly projectedToolbarTemplate = computed(() =>
    this.toolbarSlot() ? this.toolbarTemplate() : undefined,
  );
  protected readonly projectedEmptyTemplate = computed(() =>
    this.emptySlot() ? this.emptyTemplate() : undefined,
  );
}
