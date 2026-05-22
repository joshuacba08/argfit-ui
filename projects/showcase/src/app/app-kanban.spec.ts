import { TestBed } from '@angular/core/testing';
import { ARGFIT_DARK_THEME, provideArgfitUi } from '@argfit-ui/core';
import { providePrimeNG } from 'primeng/config';

import { App } from './app';

describe('App Kanban HU-034', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideArgfitUi({ platform: 'desktop', theme: ARGFIT_DARK_THEME }), providePrimeNG()],
    }).compileComponents();
  });

  it('renders the HU-034 Kanban slice in the Beta+ showcase section', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.componentInstance['activeShellSection'].set('alpha');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Beta+ wave 5 current slice');
    expect(compiled.textContent).toContain('Workflow Beta+: AfKanban');
    expect(compiled.querySelector('af-kanban-desktop')).not.toBeNull();
    expect(compiled.querySelectorAll('af-kanban-desktop .af-kanban-desktop__column').length).toBeGreaterThanOrEqual(4);
    expect(compiled.querySelectorAll('af-kanban-desktop .af-kanban-desktop__card').length).toBeGreaterThanOrEqual(6);
    expect(compiled.querySelector('.alpha-kanban-header')?.textContent).toContain('Pendientes');
    expect(compiled.querySelector('.af-kanban-desktop__add-board')?.textContent).toContain('Nueva rutina');
  });
});
