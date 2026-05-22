import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  output,
  viewChildren,
  ViewEncapsulation,
} from '@angular/core';

import {
  type AfStepChange,
  type AfStepItem,
  type AfStepPanelContext,
  type AfStepPanelDefinition,
  type AfStepperDensity,
  type AfStepState,
} from '@argfit-ui/core';

let nextAfStepperMobileId = 0;

@Component({
  selector: 'af-stepper-mobile',
  imports: [NgTemplateOutlet],
  templateUrl: './af-stepper-mobile.component.html',
  styleUrl: './af-stepper-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-stepper-mobile',
    '[attr.data-density]': 'density()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
})
export class AfStepperMobileComponent {
  private readonly defaultStepperId = `af-stepper-mobile-${++nextAfStepperMobileId}`;

  readonly steps = input<readonly AfStepItem[]>([]);
  readonly activeId = input<string | undefined>(undefined);
  readonly density = input<AfStepperDensity>('comfortable');
  readonly linear = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input('Stepper');
  readonly panelTemplates = input<readonly AfStepPanelDefinition[]>([]);

  readonly activeIdChange = output<string>();
  readonly stepChange = output<AfStepChange>();

  protected readonly stepButtons = viewChildren<ElementRef<HTMLButtonElement>>('stepButton');
  protected readonly selectedIndex = computed(() => this.resolveSelectedIndex());
  protected readonly selectedId = computed(() => this.steps()[this.selectedIndex()]?.id);
  protected readonly selectedStep = computed(() => this.steps()[this.selectedIndex()]);
  protected readonly selectedPanelTemplate = computed(() =>
    this.panelTemplates().find((panelTemplate) => panelTemplate.id === this.selectedId())?.templateRef,
  );

  protected stepId(stepId: string): string {
    return `${this.defaultStepperId}-step-${stepId}`;
  }

  protected panelId(stepId: string): string {
    return `${this.defaultStepperId}-panel-${stepId}`;
  }

  protected tabIndex(stepId: string): number {
    return this.selectedId() === stepId ? 0 : -1;
  }

  protected displayState(step: AfStepItem, index: number): AfStepState {
    if (step.id === this.selectedId()) {
      return 'current';
    }

    if (step.state) {
      return step.state;
    }

    return index < this.selectedIndex() ? 'completed' : 'upcoming';
  }

  protected panelContext(step: AfStepItem, index: number): AfStepPanelContext {
    return {
      $implicit: step,
      step,
      index,
      selected: step.id === this.selectedId(),
      activeId: this.selectedId() ?? step.id,
      state: this.displayState(step, index),
    };
  }

  protected isSelectable(step: AfStepItem, index: number): boolean {
    if (this.disabled() || step.disabled) {
      return false;
    }

    if (!this.linear() || index <= this.selectedIndex()) {
      return true;
    }

    return this.steps().slice(0, index).every((candidate, candidateIndex) => {
      const candidateState = candidate.state ?? (candidateIndex < this.selectedIndex() ? 'completed' : 'upcoming');
      return candidateState === 'completed';
    });
  }

  protected selectStep(step: AfStepItem, index: number): void {
    if (!this.isSelectable(step, index)) {
      return;
    }

    const previousId = this.selectedId();
    if (previousId === step.id) {
      return;
    }

    this.activeIdChange.emit(step.id);
    this.stepChange.emit({ activeId: step.id, previousId, step, index });
  }

  protected onStepKeydown(event: KeyboardEvent, index: number): void {
    const nextIndex = this.resolveNextEnabledIndex(index, event.key);
    if (nextIndex === undefined) {
      return;
    }

    event.preventDefault();
    const nextStep = this.steps()[nextIndex];
    if (!nextStep) {
      return;
    }

    this.selectStep(nextStep, nextIndex);
    queueMicrotask(() => this.stepButtons()[nextIndex]?.nativeElement.focus());
  }

  private resolveSelectedIndex(): number {
    const explicitIndex = this.steps().findIndex((step) => step.id === this.activeId() && !step.disabled);
    if (explicitIndex >= 0) {
      return explicitIndex;
    }

    return this.steps().findIndex((step) => !step.disabled);
  }

  private resolveNextEnabledIndex(currentIndex: number, key: string): number | undefined {
    if (this.disabled() || this.steps().length === 0) {
      return undefined;
    }

    if (key === 'Home') {
      return this.steps().findIndex((step, index) => this.isSelectable(step, index));
    }

    if (key === 'End') {
      for (let index = this.steps().length - 1; index >= 0; index -= 1) {
        if (this.isSelectable(this.steps()[index]!, index)) {
          return index;
        }
      }

      return undefined;
    }

    const step = key === 'ArrowRight' || key === 'ArrowDown' ? 1 : key === 'ArrowLeft' || key === 'ArrowUp' ? -1 : 0;
    if (step === 0) {
      return undefined;
    }

    let nextIndex = currentIndex;
    for (let attempts = 0; attempts < this.steps().length; attempts += 1) {
      nextIndex = (nextIndex + step + this.steps().length) % this.steps().length;
      if (this.isSelectable(this.steps()[nextIndex]!, nextIndex)) {
        return nextIndex;
      }
    }

    return undefined;
  }
}