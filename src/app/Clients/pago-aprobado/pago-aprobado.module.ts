import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PagoAprobadoPageRoutingModule } from './pago-aprobado-routing.module';

import { PagoAprobadoPage } from './pago-aprobado.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    PagoAprobadoPageRoutingModule
  ],
  declarations: [PagoAprobadoPage]
})
export class PagoAprobadoPageModule {}
