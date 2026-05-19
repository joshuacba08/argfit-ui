import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArgfitUiDesktop } from './argfit-ui-desktop';

describe('ArgfitUiDesktop', () => {
  let component: ArgfitUiDesktop;
  let fixture: ComponentFixture<ArgfitUiDesktop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArgfitUiDesktop],
    }).compileComponents();

    fixture = TestBed.createComponent(ArgfitUiDesktop);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
