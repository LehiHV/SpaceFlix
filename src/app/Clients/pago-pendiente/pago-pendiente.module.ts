import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PagoPendientePageRoutingModule } from './pago-pendiente-routing.module';

import { PagoPendientePage } from './pago-pendiente.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PagoPendientePageRoutingModule,
    SharedModule
  ],
  declarations: [PagoPendientePage]
})
export class PagoPendientePageModule {}
