import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComprarCreditosPageRoutingModule } from './comprar-creditos-routing.module';

import { ComprarCreditosPage } from './comprar-creditos.page';
import { SharedModule } from '../../shared/shared.module';
import { share } from 'rxjs';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ComprarCreditosPageRoutingModule
  ],
  declarations: [ComprarCreditosPage]
})
export class ComprarCreditosPageModule {}
