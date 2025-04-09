import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiciosAdminPage } from './servicios-admin.page';

const routes: Routes = [
  {
    path: '',
    component: ServiciosAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiciosAdminPageRoutingModule {}
