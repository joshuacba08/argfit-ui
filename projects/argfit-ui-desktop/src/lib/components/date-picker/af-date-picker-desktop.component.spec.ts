import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DatePicker } from 'primeng/datepicker';

import { provideArgfitUi } from '@argfit-ui/core';

import { AfDatePickerDesktopComponent } from './af-date-picker-desktop.component';

describe('AfDatePickerDesktopComponent', () => {
  it('permite seleccionar los dias visibles de meses adyacentes', async () => {
    await TestBed.configureTestingModule({
      imports: [AfDatePickerDesktopComponent],
      providers: [provideArgfitUi()],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfDatePickerDesktopComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const picker = fixture.debugElement.query(By.directive(DatePicker))
      .componentInstance as DatePicker;
    expect(picker.selectOtherMonths).toBe(true);
  });
});
