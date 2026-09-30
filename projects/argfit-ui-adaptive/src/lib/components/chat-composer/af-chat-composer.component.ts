import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AfButtonComponent } from '../button/af-button.component';
import { AfTextareaComponent } from '../textarea/af-textarea.component';

@Component({
  selector: 'af-chat-composer',
  imports: [ReactiveFormsModule, AfButtonComponent, AfTextareaComponent],
  template: `<form (submit)="send($event)" class="af-chat-composer__form">
    <af-textarea [label]="label()" [placeholder]="placeholder()" [rows]="rows()"
      [maxLength]="maxLength()" [formControl]="control" />
    <div class="af-chat-composer__actions"><ng-content />
      <af-button type="submit" variant="primary" [disabled]="disabled() || !control.value.trim()"
        [loading]="busy()">{{ submitLabel() }}</af-button></div>
  </form>`,
  styles: `
    :host { display:block; min-width:0; }
    .af-chat-composer__form { display:grid; gap:.65rem; }
    .af-chat-composer__actions { display:flex; justify-content:flex-end; align-items:center; gap:.65rem; flex-wrap:wrap; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfChatComposerComponent {
  readonly label = input('Tu mensaje');
  readonly placeholder = input('Escribe una pregunta');
  readonly submitLabel = input('Enviar');
  readonly rows = input(3);
  readonly maxLength = input(4000);
  readonly value = input('');
  readonly disabled = input(false);
  readonly busy = input(false);
  readonly valueChange = output<string>();
  readonly submitted = output<string>();
  readonly control = new FormControl('', { nonNullable: true });

  constructor() {
    effect(() => {
      if (this.disabled() || this.busy()) this.control.disable({ emitEvent: false });
      else this.control.enable({ emitEvent: false });
    });
    effect(() => {
      if (this.control.value !== this.value()) this.control.setValue(this.value(), { emitEvent: false });
    });
    this.control.valueChanges.subscribe((value) => this.valueChange.emit(value));
  }

  protected send(event: Event) {
    event.preventDefault();
    const value = this.control.value.trim();
    if (!value || this.disabled() || this.busy()) return;
    this.submitted.emit(value);
    this.control.reset('');
  }
}
