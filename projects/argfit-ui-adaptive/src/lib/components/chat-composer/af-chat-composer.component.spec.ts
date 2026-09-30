import { TestBed } from '@angular/core/testing';
import { provideArgfitUi } from '@argfit-ui/core';
import { AfChatComposerComponent } from './af-chat-composer.component';

describe('AfChatComposer', () => {
  afterEach(() => TestBed.resetTestingModule());
  it('submits trimmed text and clears the field', async () => {
    await TestBed.configureTestingModule({ imports: [AfChatComposerComponent], providers: [provideArgfitUi({ platform: 'desktop' })] }).compileComponents();
    const fixture = TestBed.createComponent(AfChatComposerComponent);
    const values: string[] = [];
    const changes: string[] = [];
    fixture.componentInstance.submitted.subscribe((value) => values.push(value));
    fixture.componentInstance.valueChange.subscribe((value) => changes.push(value));
    fixture.detectChanges();
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    textarea.value = '  Hola  ';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance.control.value).toBe('  Hola  ');
    (fixture.nativeElement.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(values).toEqual(['Hola']);
    expect(changes).toEqual(['  Hola  ', '']);
    expect(fixture.componentInstance.control.value).toBe('');
  });
});
