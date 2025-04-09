import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiciosAdminPage } from './servicios-admin.page';

describe('ServiciosAdminPage', () => {
  let component: ServiciosAdminPage;
  let fixture: ComponentFixture<ServiciosAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiciosAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
