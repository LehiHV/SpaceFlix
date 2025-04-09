import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoriaServicioPage } from './categoria-servicio.page';

const routes: Routes = [
  {
    path: '',
    component: CategoriaServicioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriaServicioPageRoutingModule {}
