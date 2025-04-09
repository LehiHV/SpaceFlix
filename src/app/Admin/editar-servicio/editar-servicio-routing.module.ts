import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarServicioPage } from './editar-servicio.page';

const routes: Routes = [
  {
    path: '',
    component: EditarServicioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarServicioPageRoutingModule {}
