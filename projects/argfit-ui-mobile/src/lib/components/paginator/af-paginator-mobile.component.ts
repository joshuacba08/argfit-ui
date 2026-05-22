import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';

import type { AfPaginatorDensity, AfPaginatorPageChange } from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

@Component({
  selector: 'af-paginator-mobile',
  imports: [AfIconComponent],
  templateUrl: './af-paginator-mobile.component.html',
  styleUrl: './af-paginator-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-paginator-mobile',
    '[attr.data-density]': 'density()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
})
export class AfPaginatorMobileComponent {
  readonly pageIndex = input(0);
  readonly pageSize = input(12);
  readonly totalItems = input(0);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly density = input<AfPaginatorDensity>('comfortable');
  readonly ariaLabel = input('Paginacion');
  readonly previousLabel = input('Pagina anterior');
  readonly nextLabel = input('Pagina siguiente');

  readonly pageChange = output<AfPaginatorPageChange>();

  protected readonly safePageSize = computed(() => Math.max(1, Math.floor(this.pageSize()) || 1));
  protected readonly normalizedTotalItems = computed(() => Math.max(0, Math.floor(this.totalItems()) || 0));
  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.normalizedTotalItems() / this.safePageSize())),
  );
  protected readonly currentPage = computed(() =>
    clampPageIndex(this.pageIndex(), this.totalPages()),
  );
  protected readonly pageStart = computed(() => {
    if (this.normalizedTotalItems() === 0) {
      return 0;
    }

    return this.currentPage() * this.safePageSize() + 1;
  });
  protected readonly pageEnd = computed(() => {
    if (this.normalizedTotalItems() === 0) {
      return 0;
    }

    return Math.min((this.currentPage() + 1) * this.safePageSize(), this.normalizedTotalItems());
  });
  protected readonly canGoPrevious = computed(() => !this.disabled() && this.currentPage() > 0);
  protected readonly canGoNext = computed(() => !this.disabled() && this.currentPage() < this.totalPages() - 1);

  protected previousPage(): void {
    if (!this.canGoPrevious()) {
      return;
    }

    this.emitPageChange(this.currentPage() - 1);
  }

  protected nextPage(): void {
    if (!this.canGoNext()) {
      return;
    }

    this.emitPageChange(this.currentPage() + 1);
  }

  private emitPageChange(pageIndex: number): void {
    this.pageChange.emit({
      pageIndex: clampPageIndex(pageIndex, this.totalPages()),
      pageSize: this.safePageSize(),
    });
  }
}

function clampPageIndex(pageIndex: number, totalPages: number): number {
  const normalized = Number.isFinite(pageIndex) ? Math.floor(pageIndex) : 0;
  return Math.min(Math.max(0, normalized), Math.max(0, totalPages - 1));
}