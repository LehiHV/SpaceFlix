import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VistaReportesUsuarioPageRoutingModule } from './vista-reportes-usuario-routing.module';

import { VistaReportesUsuarioPage } from './vista-reportes-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VistaReportesUsuarioPageRoutingModule
  ],
  declarations: [VistaReportesUsuarioPage]
})
export class VistaReportesUsuarioPageModule {}
