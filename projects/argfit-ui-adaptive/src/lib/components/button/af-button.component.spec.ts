import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideArgfitUi } from '@argfit-ui/core';
import { AfButtonComponent } from './af-button.component';

@Component({
  imports: [AfButtonComponent],
  template: `<af-button variant="primary">Save</af-button>`,
})
class AfButtonHostComponent {}

@Component({
  imports: [AfButtonComponent],
  template: `<af-button icon="log-in" iconPosition="end" fullWidth>Ingresar</af-button>`,
})
class AfButtonIconHostComponent {}

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

  it('forwards icon, icon position and full-width behavior to the active renderer', async () => {
    await TestBed.configureTestingModule({
      imports: [AfButtonIconHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfButtonIconHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const renderer = fixture.nativeElement.querySelector('af-button-desktop') as HTMLElement;
    const button = renderer.querySelector('button') as HTMLButtonElement;
    const icon = button.querySelector('af-icon') as HTMLElement;

    expect(renderer.classList).toContain('af-button-host-full');
    expect(button.classList).toContain('af-button-desktop--full');
    expect(button.lastElementChild).toBe(icon);
    expect(icon.querySelector('svg path, svg polyline, svg line')).not.toBeNull();
  });
});
