import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideArgfitUi, type AfIconName } from '@argfit-ui/core';
import { AfChipComponent } from './af-chip.component';

@Component({
  imports: [AfChipComponent],
  template: `
    <af-chip
      [icon]="icon"
      [removable]="removable"
      tone="success"
      variant="outline"
      size="md"
      removeAriaLabel="Remove athlete"
      (removed)="removedCount = removedCount + 1"
    >
      Athlete
    </af-chip>
  `,
})
class AfChipHostComponent {
  icon: AfIconName | undefined = 'bluetooth';
  removable = true;
  removedCount = 0;
}

describe('AfChipComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders the desktop implementation and emits when removed', async () => {
    await TestBed.configureTestingModule({
      imports: [AfChipHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfChipHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const desktop = fixture.nativeElement.querySelector('af-chip-desktop') as HTMLElement | null;
    const removeButton = desktop?.querySelector('.af-chip-desktop__remove') as HTMLButtonElement | null;

    expect(desktop).not.toBeNull();
    expect(desktop!.textContent).toContain('Athlete');
    expect(desktop!.getAttribute('data-tone')).toBe('success');
    expect(desktop!.getAttribute('data-variant')).toBe('outline');
    expect(desktop!.getAttribute('data-size')).toBe('md');
    expect(desktop!.querySelector('af-icon')).not.toBeNull();
    expect(removeButton).not.toBeNull();

    removeButton!.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.removedCount).toBe(1);
  });

  it('renders the mobile implementation without a remove button when not removable', async () => {
    await TestBed.configureTestingModule({
      imports: [AfChipHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfChipHostComponent);
    fixture.componentInstance.removable = false;
    fixture.detectChanges();
    await fixture.whenStable();

    const mobile = fixture.nativeElement.querySelector('af-chip-mobile') as HTMLElement | null;
    const desktop = fixture.nativeElement.querySelector('af-chip-desktop') as HTMLElement | null;

    expect(mobile).not.toBeNull();
    expect(desktop).toBeNull();
    expect(mobile!.textContent).toContain('Athlete');
    expect(mobile!.querySelector('.af-chip-mobile__remove')).toBeNull();
  });
});