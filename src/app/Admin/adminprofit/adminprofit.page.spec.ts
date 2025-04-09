import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminprofitPage } from './adminprofit.page';

describe('AdminprofitPage', () => {
  let component: AdminprofitPage;
  let fixture: ComponentFixture<AdminprofitPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdminprofitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
