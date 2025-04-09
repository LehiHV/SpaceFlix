import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerMovimientoPageRoutingModule } from './ver-movimiento-routing.module';

import { VerMovimientoPage } from './ver-movimiento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerMovimientoPageRoutingModule
  ],
  declarations: [VerMovimientoPage]
})
export class VerMovimientoPageModule {}
