import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    inject,
    input,
    output,
    viewChild,
    type TemplateRef,
} from '@angular/core';

import {
    AfPlatformService,
    type AfOrganizationChartDensity,
    type AfOrganizationChartExpandedIds,
    type AfOrganizationChartNode,
    type AfOrganizationChartNodeTemplate,
    type AfOrganizationChartSelectedIds,
    type AfOrganizationChartSelectionMode,
} from '@argfit-ui/core';
import { AfOrganizationChartDesktopComponent } from '@argfit-ui/desktop';
import { AfOrganizationChartMobileComponent } from '@argfit-ui/mobile';

import { AfOrganizationChartNodeDirective } from './af-organization-chart-node.directive';
import {
    AfOrganizationChartActionsDirective,
    AfOrganizationChartEmptyDirective,
    AfOrganizationChartLoadingDirective,
} from './af-organization-chart-slots.directive';

@Component({
  selector: 'af-organization-chart',
  imports: [AfOrganizationChartDesktopComponent, AfOrganizationChartMobileComponent],
  templateUrl: './af-organization-chart.component.html',
  styleUrl: './af-organization-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfOrganizationChartComponent {
  private readonly platform = inject(AfPlatformService);

  readonly nodes = input<readonly AfOrganizationChartNode[]>([]);
  readonly selectedIds = input<AfOrganizationChartSelectedIds>([]);
  readonly expandedIds = input<AfOrganizationChartExpandedIds>([]);
  readonly selectionMode = input<AfOrganizationChartSelectionMode>('single');
  readonly density = input<AfOrganizationChartDensity>('comfortable');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly error = input<string | undefined>(undefined);
  readonly emptyTitle = input('Sin estructura');
  readonly emptyDescription = input<string | undefined>(undefined);
  readonly ariaLabel = input('Organigrama');

  readonly selectionChange = output<AfOrganizationChartSelectedIds>();
  readonly expandedChange = output<AfOrganizationChartExpandedIds>();
  readonly nodePressed = output<AfOrganizationChartNode>();

  private readonly nodeTemplateDirective = contentChild(AfOrganizationChartNodeDirective);
  private readonly actionsSlot = contentChild(AfOrganizationChartActionsDirective);
  private readonly emptySlot = contentChild(AfOrganizationChartEmptyDirective);
  private readonly loadingSlot = contentChild(AfOrganizationChartLoadingDirective);
  private readonly actionsTemplate = viewChild<TemplateRef<unknown>>('organizationChartActions');
  private readonly emptyTemplate = viewChild<TemplateRef<unknown>>('organizationChartEmpty');
  private readonly loadingTemplate = viewChild<TemplateRef<unknown>>('organizationChartLoading');

  protected readonly isMobile = this.platform.isMobile;
  protected readonly projectedNodeTemplate = computed<AfOrganizationChartNodeTemplate | undefined>(
    () => this.nodeTemplateDirective()?.templateRef,
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
