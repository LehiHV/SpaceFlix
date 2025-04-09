import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubAdminMovimientosPage } from './sub-admin-movimientos.page';

describe('SubAdminMovimientosPage', () => {
  let component: SubAdminMovimientosPage;
  let fixture: ComponentFixture<SubAdminMovimientosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SubAdminMovimientosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
