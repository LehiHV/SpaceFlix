import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AdminprofitPageRoutingModule } from './adminprofit-routing.module';
import { AdminprofitPage } from './adminprofit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminprofitPageRoutingModule
  ],
  declarations: [AdminprofitPage],
  providers: [DatePipe] // Añade DatePipe a los proveedores
})
export class AdminprofitPageModule {}
