import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideArgfitUi } from '@argfit-ui/core';

import {
    AfCardContentDirective,
    AfCardEyebrowDirective,
    AfCardHeaderDirective,
    AfCardTitleDirective,
} from './af-card-slots.directive';
import { AfCardComponent } from './af-card.component';

@Component({
  imports: [
    AfCardComponent,
    AfCardHeaderDirective,
    AfCardTitleDirective,
    AfCardEyebrowDirective,
    AfCardContentDirective,
  ],
  template: `
    <af-card variant="metric" tone="primary" [interactive]="true" (pressed)="onPressed()">
      <header afCardHeader>
        <span afCardEyebrow>Atletas</span>
        <h3 afCardTitle>38 activos</h3>
      </header>
      <div afCardContent>Sesion semanal</div>
    </af-card>
  `,
})
class AfCardHostComponent {
  pressedCount = 0;
  onPressed(): void {
    this.pressedCount += 1;
  }
}

describe('AfCardComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders the desktop implementation by default and projects slotted content', async () => {
    await TestBed.configureTestingModule({
      imports: [AfCardHostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfCardHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const desktopHost = fixture.nativeElement.querySelector(
      'af-card-desktop',
    ) as HTMLElement | null;
    const mobileHost = fixture.nativeElement.querySelector('af-card-mobile');

    expect(desktopHost).not.toBeNull();
    expect(mobileHost).toBeNull();
    expect(desktopHost!.classList.contains('af-card-desktop--metric')).toBe(true);
    expect(desktopHost!.classList.contains('af-card-desktop--tone-primary')).toBe(true);
    expect(desktopHost!.classList.contains('af-card-desktop--interactive')).toBe(true);

    expect(desktopHost!.querySelector('.af-card__header')).not.toBeNull();
    expect(desktopHost!.querySelector('.af-card__title')?.textContent?.trim()).toBe('38 activos');
    expect(desktopHost!.querySelector('.af-card__eyebrow')?.textContent?.trim()).toBe('Atletas');
    expect(desktopHost!.querySelector('.af-card__content')?.textContent?.trim()).toBe(
      'Sesion semanal',
    );

    desktopHost!.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.pressedCount).toBe(1);
  });

  it('renders the mobile implementation when the platform is mobile', async () => {
    await TestBed.configureTestingModule({
      imports: [AfCardHostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfCardHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const mobileHost = fixture.nativeElement.querySelector(
      'af-card-mobile',
    ) as HTMLElement | null;
    const desktopHost = fixture.nativeElement.querySelector('af-card-desktop');

    expect(mobileHost).not.toBeNull();
    expect(desktopHost).toBeNull();
    expect(mobileHost!.classList.contains('af-card-mobile--metric')).toBe(true);
    expect(mobileHost!.querySelector('.af-card__title')?.textContent?.trim()).toBe('38 activos');
  });
});
