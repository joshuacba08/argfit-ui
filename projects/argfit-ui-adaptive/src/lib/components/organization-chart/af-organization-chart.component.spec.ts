import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  provideArgfitUi,
  type AfOrganizationChartExpandedIds,
  type AfOrganizationChartNode,
  type AfOrganizationChartSelectedIds,
} from '@argfit-ui/core';

import { AfOrganizationChartNodeDirective } from './af-organization-chart-node.directive';
import {
  AfOrganizationChartActionsDirective,
  AfOrganizationChartEmptyDirective,
  AfOrganizationChartLoadingDirective,
} from './af-organization-chart-slots.directive';
import { AfOrganizationChartComponent } from './af-organization-chart.component';

@Component({
  standalone: true,
  imports: [
    AfOrganizationChartActionsDirective,
    AfOrganizationChartComponent,
    AfOrganizationChartEmptyDirective,
    AfOrganizationChartLoadingDirective,
    AfOrganizationChartNodeDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <af-organization-chart
      [nodes]="nodes()"
      [selectedIds]="selectedIds()"
      [expandedIds]="expandedIds()"
      selectionMode="single"
      emptyDescription="No hay estructura jerarquica para esta cuenta"
      (selectionChange)="selectedIds.set($event)"
      (expandedChange)="expandedIds.set($event)"
      (nodePressed)="pressed.set($event)"
    >
      <div afOrganizationChartActions class="organization-chart-actions">Acciones organization chart</div>
      <div afOrganizationChartEmpty class="organization-chart-empty">Organization chart vacio custom</div>
      <div afOrganizationChartLoading class="organization-chart-loading">Organization chart loading custom</div>
      <ng-template afOrganizationChartNode let-node>
        <div class="organization-chart-template">{{ node.label }}</div>
      </ng-template>
    </af-organization-chart>
  `,
})
class AdaptiveOrganizationChartHostComponent {
  readonly nodes = signal<readonly AfOrganizationChartNode[]>([
    {
      id: 'org-root',
      label: 'Performance Hub',
      title: 'Direccion tecnica',
      description: 'Coordina microciclos, evaluacion y staff medico.',
      meta: '3 unidades',
      badge: { label: 'Activo', tone: 'success' },
      icon: 'users',
      children: [
        {
          id: 'org-lab',
          label: 'Sport Lab',
          title: 'Ciencia del deporte',
          meta: 'AM',
          icon: 'activity',
        },
      ],
    },
  ]);
  readonly selectedIds = signal<AfOrganizationChartSelectedIds>([]);
  readonly expandedIds = signal<AfOrganizationChartExpandedIds>(['org-root']);
  readonly pressed = signal<AfOrganizationChartNode | undefined>(undefined);
}

describe('AfOrganizationChartComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders desktop organization chart with actions, template, and controlled expansion', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptiveOrganizationChartHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptiveOrganizationChartHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-organization-chart-desktop')).not.toBeNull();
    expect(root.querySelector('af-organization-chart-mobile')).toBeNull();
    expect(root.querySelector('.organization-chart-actions')?.textContent).toContain('Acciones organization chart');
    expect(root.querySelector('.organization-chart-template')?.textContent).toContain('Performance Hub');

    const nodeButton = root.querySelector('.af-organization-chart-desktop__node-button') as HTMLButtonElement;
    nodeButton.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.pressed()).toEqual(expect.objectContaining({ id: 'org-root' }));
    expect(fixture.componentInstance.selectedIds()).toEqual(['org-root']);

    const toggle = root.querySelector('.af-organization-chart-desktop__toggle') as HTMLButtonElement;
    toggle.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.expandedIds()).toEqual([]);
  });

  it('renders mobile organization chart with the custom empty slot', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptiveOrganizationChartHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptiveOrganizationChartHostComponent);
    fixture.componentInstance.nodes.set([]);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-organization-chart-mobile')).not.toBeNull();
    expect(root.querySelector('af-organization-chart-desktop')).toBeNull();
    expect(root.querySelector('.organization-chart-empty')?.textContent).toContain('Organization chart vacio custom');
  });
});