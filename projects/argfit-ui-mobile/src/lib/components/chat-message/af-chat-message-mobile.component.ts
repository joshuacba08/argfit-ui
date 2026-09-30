import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { AfChatRole, AfChatStatus } from '@argfit-ui/core';

@Component({
  selector: 'af-chat-message-mobile',
  template: `<article class="af-chat-message-mobile__surface" [class.user]="role() === 'user'"
    [attr.aria-label]="author()" [attr.aria-busy]="status() === 'pending'">
    <header><strong>{{ author() }}</strong>@if (timeLabel()) { <small>{{ timeLabel() }}</small> }</header>
    <div class="af-chat-message-mobile__content"><ng-content /></div>
    @if (status() === 'failed') { <small role="status">Mensaje no completado</small> }
  </article>`,
  styles: `
    :host { display:block; max-width:100%; }
    .af-chat-message-mobile__surface { border:1px solid var(--af-border-soft); border-radius:var(--af-radius-lg);
      background:var(--af-bg-surface); padding:.85rem; color:var(--af-text-main); }
    .af-chat-message-mobile__surface.user { background:var(--af-bg-interactive); }
    header { display:flex; justify-content:space-between; gap:.5rem; margin-bottom:.4rem; font-size:.9rem; }
    small { color:var(--af-text-muted); }
    .af-chat-message-mobile__content { overflow-wrap:anywhere; white-space:pre-wrap; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfChatMessageMobileComponent {
  readonly role = input<AfChatRole>('assistant');
  readonly status = input<AfChatStatus>('complete');
  readonly author = input('Asistente');
  readonly timeLabel = input('');
}
