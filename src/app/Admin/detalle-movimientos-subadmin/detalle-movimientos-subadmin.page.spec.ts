import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleMovimientosSubadminPage } from './detalle-movimientos-subadmin.page';

describe('DetalleMovimientosSubadminPage', () => {
  let component: DetalleMovimientosSubadminPage;
  let fixture: ComponentFixture<DetalleMovimientosSubadminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleMovimientosSubadminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
