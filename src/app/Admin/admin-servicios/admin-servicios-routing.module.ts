import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminServiciosPage } from './admin-servicios.page';

const routes: Routes = [
  {
    path: '',
    component: AdminServiciosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminServiciosPageRoutingModule {}
