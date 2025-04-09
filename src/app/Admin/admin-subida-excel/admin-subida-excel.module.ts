import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminSubidaExcelPageRoutingModule } from './admin-subida-excel-routing.module';

import { AdminSubidaExcelPage } from './admin-subida-excel.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminSubidaExcelPageRoutingModule
  ],
  declarations: [AdminSubidaExcelPage]
})
export class AdminSubidaExcelPageModule {}
