import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleMovimientosSubadminPageRoutingModule } from './detalle-movimientos-subadmin-routing.module';

import { DetalleMovimientosSubadminPage } from './detalle-movimientos-subadmin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleMovimientosSubadminPageRoutingModule
  ],
  declarations: [DetalleMovimientosSubadminPage]
})
export class DetalleMovimientosSubadminPageModule {}
