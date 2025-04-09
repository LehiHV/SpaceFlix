import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComprarCreditosPage } from './comprar-creditos.page';

describe('ComprarCreditosPage', () => {
  let component: ComprarCreditosPage;
  let fixture: ComponentFixture<ComprarCreditosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprarCreditosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
