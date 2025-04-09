import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminCuentasBotPage } from './admin-cuentas-bot.page';

describe('AdminCuentasBotPage', () => {
  let component: AdminCuentasBotPage;
  let fixture: ComponentFixture<AdminCuentasBotPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCuentasBotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
