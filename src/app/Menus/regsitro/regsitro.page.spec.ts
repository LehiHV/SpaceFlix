import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegsitroPage } from './regsitro.page';

describe('RegsitroPage', () => {
  let component: RegsitroPage;
  let fixture: ComponentFixture<RegsitroPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RegsitroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
