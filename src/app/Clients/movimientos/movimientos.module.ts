import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MovimientosPageRoutingModule } from './movimientos-routing.module';
import { MovimientosPage } from './movimientos.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MovimientosPageRoutingModule,
    SharedModule
  ],
  declarations: [MovimientosPage]
})
export class MovimientosPageModule {}
