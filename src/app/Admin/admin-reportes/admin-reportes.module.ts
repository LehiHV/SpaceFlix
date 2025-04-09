import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminReportesPageRoutingModule } from './admin-reportes-routing.module';

import { AdminReportesPage } from './admin-reportes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminReportesPageRoutingModule
  ],
  declarations: [AdminReportesPage]
})
export class AdminReportesPageModule {}
