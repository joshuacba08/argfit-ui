import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideArgfitUi } from '@argfit-ui/core';
import { AfButtonComponent } from './af-button.component';

@Component({
  imports: [AfButtonComponent],
  template: `<af-button variant="primary">Save</af-button>`,
})
class AfButtonHostComponent {}

describe('AfButtonComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders the desktop implementation by default', async () => {
    await TestBed.configureTestingModule({
      imports: [AfButtonHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfButtonHostComponent);

    fixture.detectChanges();
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.textContent?.trim()).toBe('Save');
    expect(button.classList).toContain('af-button-desktop');
  });

  it('preserves projected text when rendering the mobile implementation', async () => {
    await TestBed.configureTestingModule({
      imports: [AfButtonHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfButtonHostComponent);

    fixture.detectChanges();
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector('ion-button') as HTMLElement;
    expect(button.textContent?.trim()).toBe('Save');
    expect(button.getAttribute('aria-label')).toBe('Save');
  });
});
