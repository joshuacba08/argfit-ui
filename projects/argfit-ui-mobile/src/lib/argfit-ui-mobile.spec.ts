import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArgfitUiMobile } from './argfit-ui-mobile';

describe('ArgfitUiMobile', () => {
  let component: ArgfitUiMobile;
  let fixture: ComponentFixture<ArgfitUiMobile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArgfitUiMobile],
    }).compileComponents();

    fixture = TestBed.createComponent(ArgfitUiMobile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
