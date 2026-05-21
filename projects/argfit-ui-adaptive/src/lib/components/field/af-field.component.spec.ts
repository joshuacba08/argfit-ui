import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AfFieldComponent } from './af-field.component';
import { AfIconFieldComponent } from '../icon-field/af-icon-field.component';
import {
  AfIconFieldControlDirective,
  AfIconFieldPrefixDirective,
  AfIconFieldSuffixDirective,
} from '../icon-field/af-icon-field-slots.directive';
import { AfInputGroupComponent } from '../input-group/af-input-group.component';
import {
  AfInputGroupControlDirective,
  AfInputGroupPrefixDirective,
  AfInputGroupSuffixDirective,
} from '../input-group/af-input-group-slots.directive';

@Component({
  imports: [
    AfFieldComponent,
    AfIconFieldComponent,
    AfIconFieldPrefixDirective,
    AfIconFieldControlDirective,
    AfIconFieldSuffixDirective,
    AfInputGroupComponent,
    AfInputGroupPrefixDirective,
    AfInputGroupControlDirective,
    AfInputGroupSuffixDirective,
  ],
  template: `
    <af-field label="Sesion" helperText="Campo base" inputId="base-field" labelMode="ifta">
      <input id="base-field" />
    </af-field>

    <af-icon-field label="Buscar atleta" helperText="Con iconos" inputId="search-field">
      <span afIconFieldPrefix>#</span>
      <input afIconFieldControl id="search-field" />
      <span afIconFieldSuffix>⌕</span>
    </af-icon-field>

    <af-input-group label="Carga" errorText="Revision requerida" inputId="load-field">
      <span afInputGroupPrefix>kg</span>
      <input afInputGroupControl id="load-field" />
      <button afInputGroupSuffix type="button">Aplicar</button>
    </af-input-group>
  `,
})
class AfFieldCompositionHostComponent {}

describe('AfField composition components', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders af-field, af-icon-field and af-input-group with projected content', async () => {
    await TestBed.configureTestingModule({
      imports: [AfFieldCompositionHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfFieldCompositionHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    const field = root.querySelector('af-field') as HTMLElement | null;
    const iconField = root.querySelector('af-icon-field') as HTMLElement | null;
    const inputGroup = root.querySelector('af-input-group') as HTMLElement | null;

    expect(field?.getAttribute('data-label-mode')).toBe('ifta');
    expect(field?.textContent).toContain('Campo base');
    expect(iconField?.querySelector('.af-icon-field__slot--prefix')?.textContent).toContain('#');
    expect(iconField?.querySelector('.af-icon-field__slot--suffix')?.textContent).toContain('⌕');
    expect(inputGroup?.querySelector('.af-input-group__slot--prefix')?.textContent).toContain('kg');
    expect(inputGroup?.textContent).toContain('Revision requerida');
  });
});