import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegsitroPageRoutingModule } from './regsitro-routing.module';

import { RegsitroPage } from './regsitro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegsitroPageRoutingModule
  ],
  declarations: [RegsitroPage]
})
export class RegsitroPageModule {}
