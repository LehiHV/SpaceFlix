import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleMovimientosSubadminPage } from './detalle-movimientos-subadmin.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleMovimientosSubadminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleMovimientosSubadminPageRoutingModule {}
