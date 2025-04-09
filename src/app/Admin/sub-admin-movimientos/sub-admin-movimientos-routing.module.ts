import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubAdminMovimientosPage } from './sub-admin-movimientos.page';

const routes: Routes = [
  {
    path: '',
    component: SubAdminMovimientosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubAdminMovimientosPageRoutingModule {}
