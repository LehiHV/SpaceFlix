import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportesAdminPageRoutingModule } from './reportes-admin-routing.module';

import { ReportesAdminPage } from './reportes-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportesAdminPageRoutingModule
  ],
  declarations: [ReportesAdminPage]
})
export class ReportesAdminPageModule {}
