import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { CardMenuComponent } from '../../../components/card-menu/card-menu.component';
import { TabsComponent } from '../../../components/tabs/tabs.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component:HomePage,
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
