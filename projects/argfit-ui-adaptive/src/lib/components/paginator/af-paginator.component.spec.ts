import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideArgfitUi, type AfPaginatorPageChange } from '@argfit-ui/core';

import { AfPaginatorComponent } from './af-paginator.component';

@Component({
  standalone: true,
  imports: [AfPaginatorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <af-paginator
      [pageIndex]="pageIndex()"
      [pageSize]="pageSize()"
      [totalItems]="totalItems()"
      (pageChange)="pageChanged.set($event)"
    />
  `,
})
class AdaptivePaginatorHostComponent {
  readonly pageIndex = signal(1);
  readonly pageSize = signal(4);
  readonly totalItems = signal(18);
  readonly pageChanged = signal<AfPaginatorPageChange | undefined>(undefined);
}

describe('AfPaginatorComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders desktop pagination and reemits next-page changes', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptivePaginatorHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptivePaginatorHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-paginator-desktop')).not.toBeNull();
    expect(root.querySelector('af-paginator-mobile')).toBeNull();
    expect(root.querySelector('.af-paginator-desktop__page--active')?.textContent?.trim()).toBe('2');

    const buttons = root.querySelectorAll('.af-paginator-desktop__pages button');
    (buttons[buttons.length - 1] as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.pageChanged()).toEqual({ pageIndex: 2, pageSize: 4 });
  });

  it('renders mobile pagination and reemits previous-page changes', async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptivePaginatorHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdaptivePaginatorHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-paginator-mobile')).not.toBeNull();
    expect(root.querySelector('af-paginator-desktop')).toBeNull();

    const buttons = root.querySelectorAll('.af-paginator-mobile__actions button');
    (buttons[0] as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.pageChanged()).toEqual({ pageIndex: 0, pageSize: 4 });
  });
});
