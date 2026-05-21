import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideArgfitUi } from '@argfit-ui/core';
import { AfPopoverComponent } from './af-popover.component';
import {
  AfPopoverContentDirective,
  AfPopoverTriggerDirective,
} from './af-popover-slots.directive';

@Component({
  imports: [AfPopoverComponent, AfPopoverTriggerDirective, AfPopoverContentDirective],
  template: `
    <af-popover [open]="true" title="Details" placement="right" (openChange)="changed = $event">
      <ng-template afPopoverTrigger>
        <button type="button">Open</button>
      </ng-template>
      <ng-template afPopoverContent>
        <div>Popover body</div>
      </ng-template>
    </af-popover>
  `,
})
class AfPopoverHostComponent {
  changed: boolean | null = null;
}

describe('AfPopoverComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders the desktop implementation and closes from the close button', async () => {
    await TestBed.configureTestingModule({
      imports: [AfPopoverHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfPopoverHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const desktop = fixture.nativeElement.querySelector('af-popover-desktop') as HTMLElement | null;
    const closeButton = desktop?.querySelector('.af-popover-desktop__close') as HTMLButtonElement | null;

    expect(desktop).not.toBeNull();
    expect(desktop!.querySelector('[role="tooltip"]')).toBeNull();
    expect(desktop!.querySelector('.af-popover-desktop__body')?.textContent).toContain('Popover body');
    expect(desktop!.getAttribute('data-open')).toBe('');

    closeButton!.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.changed).toBe(false);
  });

  it('renders the mobile implementation when platform is mobile', async () => {
    await TestBed.configureTestingModule({
      imports: [AfPopoverHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfPopoverHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const mobile = fixture.nativeElement.querySelector('af-popover-mobile') as HTMLElement | null;
    const desktop = fixture.nativeElement.querySelector('af-popover-desktop') as HTMLElement | null;

    expect(mobile).not.toBeNull();
    expect(desktop).toBeNull();
    expect(mobile!.querySelector('.af-popover-mobile__body')?.textContent).toContain('Popover body');
  });
});