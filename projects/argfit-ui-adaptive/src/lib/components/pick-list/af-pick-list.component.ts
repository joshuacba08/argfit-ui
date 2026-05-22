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
  type AfPickListChange,
  type AfPickListDensity,
  type AfPickListItem,
  type AfPickListItemTemplate,
  type AfPickListSelectedIds,
} from '@argfit-ui/core';
import { AfPickListDesktopComponent } from '@argfit-ui/desktop';
import { AfPickListMobileComponent } from '@argfit-ui/mobile';

import { AfPickListItemDirective } from './af-pick-list-item.directive';
import {
  AfPickListActionsDirective,
  AfPickListLoadingDirective,
  AfPickListSourceEmptyDirective,
  AfPickListTargetEmptyDirective,
} from './af-pick-list-slots.directive';

@Component({
  selector: 'af-pick-list',
  imports: [AfPickListDesktopComponent, AfPickListMobileComponent],
  templateUrl: './af-pick-list.component.html',
  styleUrl: './af-pick-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfPickListComponent {
  private readonly platform = inject(AfPlatformService);

  readonly sourceItems = input<readonly AfPickListItem[]>([]);
  readonly targetItems = input<readonly AfPickListItem[]>([]);
  readonly sourceSelectedIds = input<AfPickListSelectedIds>([]);
  readonly targetSelectedIds = input<AfPickListSelectedIds>([]);
  readonly sourceTitle = input('Disponibles');
  readonly sourceDescription = input<string | undefined>(undefined);
  readonly targetTitle = input('Asignados');
  readonly targetDescription = input<string | undefined>(undefined);
  readonly density = input<AfPickListDensity>('comfortable');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly error = input<string | undefined>(undefined);
  readonly sourceEmptyTitle = input('Sin items disponibles');
  readonly sourceEmptyDescription = input<string | undefined>(undefined);
  readonly targetEmptyTitle = input('Sin items asignados');
  readonly targetEmptyDescription = input<string | undefined>(undefined);
  readonly ariaLabel = input('Pick list');

  readonly sourceSelectionChange = output<AfPickListSelectedIds>();
  readonly targetSelectionChange = output<AfPickListSelectedIds>();
  readonly transferChange = output<AfPickListChange>();

  private readonly itemTemplateDirective = contentChild(AfPickListItemDirective);
  private readonly actionsSlot = contentChild(AfPickListActionsDirective);
  private readonly sourceEmptySlot = contentChild(AfPickListSourceEmptyDirective);
  private readonly targetEmptySlot = contentChild(AfPickListTargetEmptyDirective);
  private readonly loadingSlot = contentChild(AfPickListLoadingDirective);
  private readonly actionsTemplate = viewChild<TemplateRef<unknown>>('pickListActions');
  private readonly sourceEmptyTemplate = viewChild<TemplateRef<unknown>>('pickListSourceEmpty');
  private readonly targetEmptyTemplate = viewChild<TemplateRef<unknown>>('pickListTargetEmpty');
  private readonly loadingTemplate = viewChild<TemplateRef<unknown>>('pickListLoading');

  protected readonly isMobile = this.platform.isMobile;
  protected readonly projectedItemTemplate = computed<AfPickListItemTemplate | undefined>(
    () => this.itemTemplateDirective()?.templateRef,
  );
  protected readonly projectedActionsTemplate = computed(() =>
    this.actionsSlot() ? this.actionsTemplate() : undefined,
  );
  protected readonly projectedSourceEmptyTemplate = computed(() =>
    this.sourceEmptySlot() ? this.sourceEmptyTemplate() : undefined,
  );
  protected readonly projectedTargetEmptyTemplate = computed(() =>
    this.targetEmptySlot() ? this.targetEmptyTemplate() : undefined,
  );
  protected readonly projectedLoadingTemplate = computed(() =>
    this.loadingSlot() ? this.loadingTemplate() : undefined,
  );
}
