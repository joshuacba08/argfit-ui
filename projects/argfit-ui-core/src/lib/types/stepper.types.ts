import type { TemplateRef } from '@angular/core';

export type AfStepperDensity = 'compact' | 'comfortable';

export type AfStepState = 'upcoming' | 'current' | 'completed' | 'error';

export interface AfStepItem<TData = unknown> {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly state?: Exclude<AfStepState, 'current'>;
  readonly optional?: boolean;
  readonly disabled?: boolean;
  readonly data?: TData;
}

export interface AfStepChange<TStep extends AfStepItem = AfStepItem> {
  readonly activeId: string;
  readonly previousId?: string;
  readonly step: TStep;
  readonly index: number;
}

export interface AfStepPanelContext<TStep extends AfStepItem = AfStepItem> {
  readonly $implicit: TStep;
  readonly step: TStep;
  readonly index: number;
  readonly selected: boolean;
  readonly activeId: string;
  readonly state: AfStepState;
}

export type AfStepPanelTemplate<TStep extends AfStepItem = AfStepItem> = TemplateRef<AfStepPanelContext<TStep>>;

export interface AfStepPanelDefinition<TStep extends AfStepItem = AfStepItem> {
  readonly id: string;
  readonly templateRef: AfStepPanelTemplate<TStep>;
}
