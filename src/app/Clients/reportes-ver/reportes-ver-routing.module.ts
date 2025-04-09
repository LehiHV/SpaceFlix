import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportesVerPage } from './reportes-ver.page';

const routes: Routes = [
  {
    path: '',
    component: ReportesVerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportesVerPageRoutingModule {}
