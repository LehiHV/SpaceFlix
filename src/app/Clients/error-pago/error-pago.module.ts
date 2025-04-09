import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ErrorPagoPageRoutingModule } from './error-pago-routing.module';

import { ErrorPagoPage } from './error-pago.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ErrorPagoPageRoutingModule
  ],
  declarations: [ErrorPagoPage]
})
export class ErrorPagoPageModule {}
