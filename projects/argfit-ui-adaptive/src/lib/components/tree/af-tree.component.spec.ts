import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
    provideArgfitUi,
    type AfTreeExpandedIds,
    type AfTreeNode,
    type AfTreeSelectedIds,
} from '@argfit-ui/core';

import { AfTreeNodeDirective } from './af-tree-node.directive';
import {
    AfTreeActionsDirective,
    AfTreeEmptyDirective,
    AfTreeLoadingDirective,
} from './af-tree-slots.directive';
import { AfTreeComponent } from './af-tree.component';

@Component({
  standalone: true,
  imports: [
    AfTreeActionsDirective,
    AfTreeComponent,
    AfTreeEmptyDirective,
    AfTreeLoadingDirective,
    AfTreeNodeDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <af-tree
      [nodes]="nodes()"
      [selectedIds]="selectedIds()"
      [expandedIds]="expandedIds()"
      selectionMode="single"
      emptyDescription="Carga una estructura para empezar"
      (selectionChange)="selectedIds.set($event)"
      (expandedChange)="expandedIds.set($event)"
      (nodePressed)="pressed.set($event)"
    >
      <div afTreeActions class="tree-actions">Acciones tree</div>
      <div afTreeEmpty class="tree-empty">Tree vacio custom</div>
      <div afTreeLoading class="tree-loading">Tree loading custom</div>
      <ng-template afTreeNode let-node>
        <div class="tree-template">{{ node.label }}</div>
      </ng-template>
    </af-tree>
  `,
})
class AdaptiveTreeHostComponent {
  readonly nodes = signal<readonly AfTreeNode[]>([
    {
      id: 'club',
      label: 'Club ArgFit',
      description: 'Unidad principal',
      meta: '3 grupos',
      icon: 'users',
      children: [
        {
          id: 'team-performance',
          label: 'Equipo de performance',
          description: 'Staff y atletas prioritarios',
          meta: '6 atletas',
          icon: 'activity',
          children: [
            {
              id: 'athlete-maria',
              label: 'Maria Garcia',
              description: 'Voleibol',
              meta: 'Activa',
              icon: 'users',
            },
          ],
        },
      ],
    },
  ]);
  readonly selectedIds = signal<AfTreeSelectedIds>(['club']);
  readonly expandedIds = signal<AfTreeExpandedIds>(['club']);
  readonly pressed = signal<AfTreeNode | undefined>(undefined);
}

describe('AfTreeComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders desktop tree and supports expand plus selection', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptiveTreeHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptiveTreeHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-tree-desktop')).not.toBeNull();
    expect(root.querySelector('af-tree-mobile')).toBeNull();
    expect(root.querySelector('.tree-actions')?.textContent).toContain('Acciones tree');
    expect(root.querySelector('.tree-template')?.textContent).toContain('Club ArgFit');

    const nodeButtons = root.querySelectorAll('.af-tree-desktop__label');
    const teamButton = nodeButtons[1] as HTMLButtonElement;
    teamButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();

    expect(fixture.componentInstance.expandedIds()).toEqual(['club', 'team-performance']);

    teamButton.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedIds()).toEqual(['team-performance']);
    expect(fixture.componentInstance.pressed()).toEqual(
      expect.objectContaining({ id: 'team-performance', label: 'Equipo de performance' }),
    );
  });

  it('renders mobile tree with the custom empty slot', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptiveTreeHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptiveTreeHostComponent);
    fixture.componentInstance.nodes.set([]);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-tree-mobile')).not.toBeNull();
    expect(root.querySelector('af-tree-desktop')).toBeNull();
    expect(root.querySelector('.tree-empty')?.textContent).toContain('Tree vacio custom');
  });
});
