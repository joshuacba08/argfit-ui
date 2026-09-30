import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideArgfitUi } from '@argfit-ui/core';
import { AfChatMessageComponent } from './af-chat-message.component';

@Component({ imports: [AfChatMessageComponent], template: `<af-chat-message role="user" author="Entrenador" timeLabel="10:30">Pregunta</af-chat-message>` })
class Host {}

describe('AfChatMessage', () => {
  afterEach(() => TestBed.resetTestingModule());
  for (const platform of ['desktop', 'mobile'] as const) {
    it(`renders projected content on ${platform}`, async () => {
      await TestBed.configureTestingModule({ imports: [Host], providers: [provideArgfitUi({ platform })] }).compileComponents();
      const fixture = TestBed.createComponent(Host);
      fixture.detectChanges();
      await fixture.whenStable();
      const message = fixture.nativeElement.querySelector(`af-chat-message-${platform}`) as HTMLElement;
      expect(message).not.toBeNull();
      expect(message.textContent).toContain('Pregunta');
      expect(message.querySelector('article')?.getAttribute('aria-label')).toBe('Entrenador');
    });
  }
});
