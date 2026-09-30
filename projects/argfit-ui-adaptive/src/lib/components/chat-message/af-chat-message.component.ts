import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { AfPlatformService, type AfChatRole, type AfChatStatus } from '@argfit-ui/core';
import { AfChatMessageDesktopComponent } from '@argfit-ui/desktop';
import { AfChatMessageMobileComponent } from '@argfit-ui/mobile';

@Component({
  selector: 'af-chat-message',
  imports: [NgTemplateOutlet, AfChatMessageDesktopComponent, AfChatMessageMobileComponent],
  template: `<ng-template #content><ng-content /></ng-template>
    @if (isMobile()) {
      <af-chat-message-mobile [role]="role()" [status]="status()" [author]="author()" [timeLabel]="timeLabel()">
        <ng-container *ngTemplateOutlet="content" />
      </af-chat-message-mobile>
    } @else {
      <af-chat-message-desktop [role]="role()" [status]="status()" [author]="author()" [timeLabel]="timeLabel()">
        <ng-container *ngTemplateOutlet="content" />
      </af-chat-message-desktop>
    }`,
  styles: `:host { display:block; min-width:0; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AfChatMessageComponent {
  private readonly platform = inject(AfPlatformService);
  readonly role = input<AfChatRole>('assistant');
  readonly status = input<AfChatStatus>('complete');
  readonly author = input('Asistente');
  readonly timeLabel = input('');
  protected readonly isMobile = this.platform.isMobile;
}
