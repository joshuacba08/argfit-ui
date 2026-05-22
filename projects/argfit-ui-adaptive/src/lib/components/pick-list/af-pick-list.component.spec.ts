import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  provideArgfitUi,
  type AfPickListChange,
  type AfPickListItem,
  type AfPickListSelectedIds,
} from '@argfit-ui/core';

import { AfPickListItemDirective } from './af-pick-list-item.directive';
import {
  AfPickListActionsDirective,
  AfPickListLoadingDirective,
  AfPickListSourceEmptyDirective,
  AfPickListTargetEmptyDirective,
} from './af-pick-list-slots.directive';
import { AfPickListComponent } from './af-pick-list.component';

@Component({
  standalone: true,
  imports: [
    AfPickListActionsDirective,
    AfPickListComponent,
    AfPickListItemDirective,
    AfPickListLoadingDirective,
    AfPickListSourceEmptyDirective,
    AfPickListTargetEmptyDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <af-pick-list
      [sourceItems]="sourceItems()"
      [targetItems]="targetItems()"
      [sourceSelectedIds]="sourceSelectedIds()"
      [targetSelectedIds]="targetSelectedIds()"
      sourceTitle="Disponibles"
      targetTitle="Asignados"
      (sourceSelectionChange)="sourceSelectedIds.set($event)"
      (targetSelectionChange)="targetSelectedIds.set($event)"
      (transferChange)="applyChange($event)"
    >
      <div afPickListActions class="pick-list-actions">Acciones pick list</div>
      <div afPickListSourceEmpty class="pick-list-source-empty">Source vacio custom</div>
      <div afPickListTargetEmpty class="pick-list-target-empty">Target vacio custom</div>
      <div afPickListLoading class="pick-list-loading">Pick list loading custom</div>
      <ng-template afPickListItem let-item let-list="list">
        <div class="pick-list-template">{{ list }}: {{ item.label }}</div>
      </ng-template>
    </af-pick-list>
  `,
})
class AdaptivePickListHostComponent {
  readonly sourceItems = signal<readonly AfPickListItem[]>([
    {
      id: 'maria',
      label: 'Maria Garcia',
      description: 'Voleibol',
      meta: 'CMJ',
      icon: 'users',
    },
    {
      id: 'lucia',
      label: 'Lucia Perez',
      description: 'Basquet',
      meta: 'Readiness',
      icon: 'users',
    },
  ]);
  readonly targetItems = signal<readonly AfPickListItem[]>([
    {
      id: 'santiago',
      label: 'Santiago Ruiz',
      description: 'Rugby',
      meta: 'Fuerza',
      icon: 'users',
    },
  ]);
  readonly sourceSelectedIds = signal<AfPickListSelectedIds>(['lucia']);
  readonly targetSelectedIds = signal<AfPickListSelectedIds>([]);

  applyChange(change: AfPickListChange): void {
    this.sourceItems.set(change.sourceItems);
    this.targetItems.set(change.targetItems);
    this.sourceSelectedIds.set(change.sourceSelectedIds);
    this.targetSelectedIds.set(change.targetSelectedIds);
  }
}

describe('AfPickListComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders desktop pick list with projected actions and transfers the selected source item', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptivePickListHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptivePickListHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-pick-list-desktop')).not.toBeNull();
    expect(root.querySelector('af-pick-list-mobile')).toBeNull();
    expect(root.querySelector('.pick-list-actions')?.textContent).toContain('Acciones pick list');
    expect(root.querySelector('.pick-list-template')?.textContent).toContain('source: Maria Garcia');

    const moveButton = root.querySelector(
      '.af-pick-list-desktop__control[data-direction="toTarget"]',
    ) as HTMLButtonElement;
    moveButton.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.sourceItems().map((item) => item.id)).toEqual(['maria']);
    expect(fixture.componentInstance.targetItems().map((item) => item.id)).toEqual(['santiago', 'lucia']);
  });

  it('renders mobile pick list with the custom target empty slot', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptivePickListHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptivePickListHostComponent);
    fixture.componentInstance.targetItems.set([]);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-pick-list-mobile')).not.toBeNull();
    expect(root.querySelector('af-pick-list-desktop')).toBeNull();
    expect(root.querySelector('.pick-list-target-empty')?.textContent).toContain('Target vacio custom');
  });
});
