import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComprarCreditosPage } from './comprar-creditos.page';

const routes: Routes = [
  {
    path: '',
    component: ComprarCreditosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComprarCreditosPageRoutingModule {}
