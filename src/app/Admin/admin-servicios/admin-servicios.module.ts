import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminServiciosPageRoutingModule } from './admin-servicios-routing.module';

import { AdminServiciosPage } from './admin-servicios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminServiciosPageRoutingModule
  ],
  declarations: [AdminServiciosPage]
})
export class AdminServiciosPageModule {}
