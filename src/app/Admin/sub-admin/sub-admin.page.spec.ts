import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubAdminPage } from './sub-admin.page';

describe('SubAdminPage', () => {
  let component: SubAdminPage;
  let fixture: ComponentFixture<SubAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SubAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
