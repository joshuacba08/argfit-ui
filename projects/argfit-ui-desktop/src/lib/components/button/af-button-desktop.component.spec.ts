import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AfButtonDesktopComponent } from './af-button-desktop.component';

@Component({
  imports: [AfButtonDesktopComponent],
  template: `<af-button-desktop variant="danger">Delete</af-button-desktop>`,
})
class AfButtonDesktopHostComponent {}

@Component({
  imports: [AfButtonDesktopComponent],
  template: `<af-button-desktop icon="save">Save</af-button-desktop>`,
})
class AfButtonDesktopIconHostComponent {}

describe('AfButtonDesktopComponent', () => {
  it('renders projected button content with the requested variant', async () => {
    await TestBed.configureTestingModule({
      imports: [AfButtonDesktopHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfButtonDesktopHostComponent);

    fixture.detectChanges();
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.textContent?.trim()).toBe('Delete');
    expect(button.classList).toContain('af-button-desktop--danger');
  });

  it('renders a decorative leading icon from the shared icon registry', async () => {
    await TestBed.configureTestingModule({
      imports: [AfButtonDesktopIconHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfButtonDesktopIconHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const icon = button.querySelector('af-icon') as HTMLElement;

    expect(button.firstElementChild).toBe(icon);
    expect(icon.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });
});
