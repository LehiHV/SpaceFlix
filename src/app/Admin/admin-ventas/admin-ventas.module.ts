import { NgModule } from '@angular/core';
import { CommonModule, DatePipe  } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AdminVentasPageRoutingModule } from './admin-ventas-routing.module';
import { AdminVentasPage } from './admin-ventas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminVentasPageRoutingModule
  ],
  declarations: [AdminVentasPage],
  providers: [DatePipe] // Añade DatePipe a los proveedores
})
export class AdminVentasPageModule {}
