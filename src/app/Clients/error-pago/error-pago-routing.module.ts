import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorPagoPage } from './error-pago.page';

const routes: Routes = [
  {
    path: '',
    component: ErrorPagoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorPagoPageRoutingModule {}
