import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriaServicioPage } from './categoria-servicio.page';

describe('CategoriaServicioPage', () => {
  let component: CategoriaServicioPage;
  let fixture: ComponentFixture<CategoriaServicioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriaServicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
