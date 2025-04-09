import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminReportesPage } from './admin-reportes.page';

const routes: Routes = [
  {
    path: '',
    component: AdminReportesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminReportesPageRoutingModule {}
