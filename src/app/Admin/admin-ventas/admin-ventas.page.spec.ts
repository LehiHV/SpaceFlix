import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminVentasPage } from './admin-ventas.page';

describe('AdminVentasPage', () => {
  let component: AdminVentasPage;
  let fixture: ComponentFixture<AdminVentasPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdminVentasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
