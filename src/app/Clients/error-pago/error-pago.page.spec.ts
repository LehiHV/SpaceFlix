import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorPagoPage } from './error-pago.page';

describe('ErrorPagoPage', () => {
  let component: ErrorPagoPage;
  let fixture: ComponentFixture<ErrorPagoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorPagoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
