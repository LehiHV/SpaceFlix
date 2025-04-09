import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VistaReportesUsuarioPage } from './vista-reportes-usuario.page';

describe('VistaReportesUsuarioPage', () => {
  let component: VistaReportesUsuarioPage;
  let fixture: ComponentFixture<VistaReportesUsuarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaReportesUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
