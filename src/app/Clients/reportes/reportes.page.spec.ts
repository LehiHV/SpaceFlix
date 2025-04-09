import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReportesPage } from './reportes.page';

describe('ReportesPage', () => {
  let component: ReportesPage;
  let fixture: ComponentFixture<ReportesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReportesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
