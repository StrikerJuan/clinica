import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriaDental } from './historia-dental';

describe('HistoriaDental', () => {
  let component: HistoriaDental;
  let fixture: ComponentFixture<HistoriaDental>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriaDental],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoriaDental);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
