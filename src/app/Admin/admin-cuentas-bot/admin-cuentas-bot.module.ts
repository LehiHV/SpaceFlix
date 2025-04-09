import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminCuentasBotPageRoutingModule } from './admin-cuentas-bot-routing.module';

import { AdminCuentasBotPage } from './admin-cuentas-bot.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminCuentasBotPageRoutingModule
  ],
  declarations: [AdminCuentasBotPage]
})
export class AdminCuentasBotPageModule {}
