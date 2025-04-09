import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerMovimientoPage } from './ver-movimiento.page';

const routes: Routes = [
  {
    path: '',
    component: VerMovimientoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerMovimientoPageRoutingModule {}
