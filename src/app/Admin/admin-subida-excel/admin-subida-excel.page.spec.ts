import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminSubidaExcelPage } from './admin-subida-excel.page';

describe('AdminSubidaExcelPage', () => {
  let component: AdminSubidaExcelPage;
  let fixture: ComponentFixture<AdminSubidaExcelPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSubidaExcelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
