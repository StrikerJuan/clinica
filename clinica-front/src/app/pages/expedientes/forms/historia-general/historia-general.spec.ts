import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriaGeneral } from './historia-general';

describe('HistoriaGeneral', () => {
  let component: HistoriaGeneral;
  let fixture: ComponentFixture<HistoriaGeneral>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriaGeneral],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoriaGeneral);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
