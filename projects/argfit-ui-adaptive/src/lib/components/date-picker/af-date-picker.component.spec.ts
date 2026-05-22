import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { provideArgfitUi } from '@argfit-ui/core';
import { AfDatePickerDesktopComponent } from '@argfit-ui/desktop';

import { AfDatePickerComponent } from './af-date-picker.component';

@Component({
  imports: [ReactiveFormsModule, AfDatePickerComponent],
  template: `
    <af-date-picker
      label="Fecha de sesion"
      helperText="Fecha operativa del microciclo"
      min="2026-01-01"
      max="2026-12-31"
      [formControl]="sessionDate"
    />
  `,
})
class AfDatePickerHostComponent {
  readonly sessionDate = new FormControl<string>('2026-05-22', { nonNullable: true });
}

describe('AfDatePickerComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders the desktop implementation and synchronizes through ControlValueAccessor', async () => {
    await TestBed.configureTestingModule({
      imports: [AfDatePickerHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfDatePickerHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const desktopDebug = fixture.debugElement.query(By.directive(AfDatePickerDesktopComponent));
    const desktop = desktopDebug.nativeElement as HTMLElement;
    const desktopInstance = desktopDebug.componentInstance as AfDatePickerDesktopComponent;

    expect(desktop).not.toBeNull();
    expect(desktopInstance.value()).toBe('2026-05-22');

    desktopDebug.triggerEventHandler('valueChange', '2026-06-15');
    desktopDebug.triggerEventHandler('focusChange', false);
    fixture.detectChanges();

    expect(fixture.componentInstance.sessionDate.value).toBe('2026-06-15');
    expect(fixture.componentInstance.sessionDate.touched).toBe(true);

    fixture.componentInstance.sessionDate.disable();
    fixture.detectChanges();

    expect(desktop?.hasAttribute('data-disabled')).toBe(true);
  });

  it('renders the mobile implementation when platform is mobile', async () => {
    await TestBed.configureTestingModule({
      imports: [AfDatePickerHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfDatePickerHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('af-date-picker-mobile')).not.toBeNull();
    expect(root.querySelector('af-date-picker-desktop')).toBeNull();
  });
});
