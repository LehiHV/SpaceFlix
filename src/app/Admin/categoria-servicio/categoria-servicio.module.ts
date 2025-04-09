import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoriaServicioPageRoutingModule } from './categoria-servicio-routing.module';

import { CategoriaServicioPage } from './categoria-servicio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoriaServicioPageRoutingModule
  ],
  declarations: [CategoriaServicioPage]
})
export class CategoriaServicioPageModule {}
