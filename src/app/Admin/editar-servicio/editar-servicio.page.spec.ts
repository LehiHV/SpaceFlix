import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarServicioPage } from './editar-servicio.page';

describe('EditarServicioPage', () => {
  let component: EditarServicioPage;
  let fixture: ComponentFixture<EditarServicioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarServicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
