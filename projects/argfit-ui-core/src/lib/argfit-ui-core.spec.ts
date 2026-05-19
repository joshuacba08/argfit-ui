import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArgfitUiCore } from './argfit-ui-core';

describe('ArgfitUiCore', () => {
  let component: ArgfitUiCore;
  let fixture: ComponentFixture<ArgfitUiCore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArgfitUiCore],
    }).compileComponents();

    fixture = TestBed.createComponent(ArgfitUiCore);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
