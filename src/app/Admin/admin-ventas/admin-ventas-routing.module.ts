import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminVentasPage } from './admin-ventas.page';

const routes: Routes = [
  {
    path: '',
    component: AdminVentasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminVentasPageRoutingModule {}
