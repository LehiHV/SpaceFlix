import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportesVerPage } from './reportes-ver.page';

describe('ReportesVerPage', () => {
  let component: ReportesVerPage;
  let fixture: ComponentFixture<ReportesVerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesVerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
