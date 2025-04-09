import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminCuentasBotPage } from './admin-cuentas-bot.page';

const routes: Routes = [
  {
    path: '',
    component: AdminCuentasBotPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminCuentasBotPageRoutingModule {}
