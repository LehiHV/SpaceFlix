import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AdminRecargasPage } from './admin-recargas.page';

describe('AdminRecargasPage', () => {
  let component: AdminRecargasPage;
  let fixture: ComponentFixture<AdminRecargasPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdminRecargasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
