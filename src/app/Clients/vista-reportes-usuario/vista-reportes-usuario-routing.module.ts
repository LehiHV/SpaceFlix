import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VistaReportesUsuarioPage } from './vista-reportes-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: VistaReportesUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VistaReportesUsuarioPageRoutingModule {}
