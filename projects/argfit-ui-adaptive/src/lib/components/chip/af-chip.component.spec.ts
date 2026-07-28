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
      interactive
      [selected]="selected"
      removeAriaLabel="Remove athlete"
      ariaLabel="Filter by athlete"
      (removed)="removedCount = removedCount + 1"
      (pressed)="pressedCount = pressedCount + 1"
    >
      Athlete
    </af-chip>
  `,
})
class AfChipHostComponent {
  icon: AfIconName | undefined = 'bluetooth';
  removable = false;
  selected = true;
  removedCount = 0;
  pressedCount = 0;
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
    expect(removeButton).toBeNull();
    expect((desktop!.parentElement as HTMLElement).getAttribute('role')).toBe('button');
    expect((desktop!.parentElement as HTMLElement).getAttribute('aria-pressed')).toBe('true');

    (desktop!.parentElement as HTMLElement).click();
    expect(fixture.componentInstance.pressedCount).toBe(1);

    fixture.componentInstance.removable = true;
    fixture.detectChanges();
    const enabledRemoveButton = desktop?.querySelector(
      '.af-chip-desktop__remove',
    ) as HTMLButtonElement | null;
    expect((desktop!.parentElement as HTMLElement).getAttribute('role')).toBeNull();
    enabledRemoveButton!.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.removedCount).toBe(1);
    expect(fixture.componentInstance.pressedCount).toBe(1);
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
