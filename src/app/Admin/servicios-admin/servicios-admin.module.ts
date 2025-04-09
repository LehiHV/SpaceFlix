import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiciosAdminPageRoutingModule } from './servicios-admin-routing.module';

import { ServiciosAdminPage } from './servicios-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiciosAdminPageRoutingModule
  ],
  declarations: [ServiciosAdminPage]
})
export class ServiciosAdminPageModule {}
