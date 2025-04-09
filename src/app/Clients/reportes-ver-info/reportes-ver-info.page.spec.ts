import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportesVerInfoPage } from './reportes-ver-info.page';

describe('ReportesVerInfoPage', () => {
  let component: ReportesVerInfoPage;
  let fixture: ComponentFixture<ReportesVerInfoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesVerInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
