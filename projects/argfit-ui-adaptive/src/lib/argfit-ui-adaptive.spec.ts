import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArgfitUiAdaptive } from './argfit-ui-adaptive';

describe('ArgfitUiAdaptive', () => {
  let component: ArgfitUiAdaptive;
  let fixture: ComponentFixture<ArgfitUiAdaptive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArgfitUiAdaptive],
    }).compileComponents();

    fixture = TestBed.createComponent(ArgfitUiAdaptive);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
