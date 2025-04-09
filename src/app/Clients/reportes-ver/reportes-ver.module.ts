import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportesVerPageRoutingModule } from './reportes-ver-routing.module';

import { ReportesVerPage } from './reportes-ver.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportesVerPageRoutingModule
  ],
  declarations: [ReportesVerPage]
})
export class ReportesVerPageModule {}
