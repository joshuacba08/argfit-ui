export interface AfFormOption<TValue = string> {
  readonly value: TValue;
  readonly label: string;
  readonly disabled?: boolean;
  readonly hint?: string;
}

export type AfControlSize = 'sm' | 'md' | 'lg';

export type AfValidationState = 'default' | 'error' | 'success';
