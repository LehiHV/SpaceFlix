import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AdminRecargasPageRoutingModule } from './admin-recargas-routing.module';
import { AdminRecargasPage } from './admin-recargas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminRecargasPageRoutingModule
  ],
  declarations: [AdminRecargasPage]
})
export class AdminRecargasPageModule {}
