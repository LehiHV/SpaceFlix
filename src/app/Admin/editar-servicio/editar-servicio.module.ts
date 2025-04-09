import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarServicioPageRoutingModule } from './editar-servicio-routing.module';

import { EditarServicioPage } from './editar-servicio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarServicioPageRoutingModule
  ],
  declarations: [EditarServicioPage]
})
export class EditarServicioPageModule {}
