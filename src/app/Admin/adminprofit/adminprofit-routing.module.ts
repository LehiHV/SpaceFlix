import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminprofitPage } from './adminprofit.page';

const routes: Routes = [
  {
    path: '',
    component: AdminprofitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminprofitPageRoutingModule {}
