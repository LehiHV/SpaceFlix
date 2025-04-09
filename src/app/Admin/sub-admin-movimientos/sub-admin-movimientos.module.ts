import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubAdminMovimientosPageRoutingModule } from './sub-admin-movimientos-routing.module';

import { SubAdminMovimientosPage } from './sub-admin-movimientos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubAdminMovimientosPageRoutingModule
  ],
  declarations: [SubAdminMovimientosPage]
})
export class SubAdminMovimientosPageModule {}
