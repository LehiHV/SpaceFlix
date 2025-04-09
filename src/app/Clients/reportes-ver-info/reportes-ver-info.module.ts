import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportesVerInfoPageRoutingModule } from './reportes-ver-info-routing.module';

import { ReportesVerInfoPage } from './reportes-ver-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportesVerInfoPageRoutingModule
  ],
  declarations: [ReportesVerInfoPage]
})
export class ReportesVerInfoPageModule {}
