import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerMovimientoPage } from './ver-movimiento.page';

describe('VerMovimientoPage', () => {
  let component: VerMovimientoPage;
  let fixture: ComponentFixture<VerMovimientoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerMovimientoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
