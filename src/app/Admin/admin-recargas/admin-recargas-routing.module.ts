import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminRecargasPage } from './admin-recargas.page';

const routes: Routes = [
  {
    path: '',
    component: AdminRecargasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRecargasPageRoutingModule {}
