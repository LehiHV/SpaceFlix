import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportesVerInfoPage } from './reportes-ver-info.page';

const routes: Routes = [
  {
    path: '',
    component: ReportesVerInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportesVerInfoPageRoutingModule {}
