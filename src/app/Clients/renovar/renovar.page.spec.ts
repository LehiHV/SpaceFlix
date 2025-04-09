import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RenovarPage } from './renovar.page';

describe('RenovarPage', () => {
  let component: RenovarPage;
  let fixture: ComponentFixture<RenovarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RenovarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
