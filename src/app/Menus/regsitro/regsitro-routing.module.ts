import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegsitroPage } from './regsitro.page';

const routes: Routes = [
  {
    path: '',
    component: RegsitroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegsitroPageRoutingModule {}
