import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportesAdminPage } from './reportes-admin.page';

describe('ReportesAdminPage', () => {
  let component: ReportesAdminPage;
  let fixture: ComponentFixture<ReportesAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
