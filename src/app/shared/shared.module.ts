import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TabsComponent } from '../../components/tabs/tabs.component';
import { CardMenuComponent } from '../../components/card-menu/card-menu.component';

@NgModule({
  declarations: [
    TabsComponent,
    CardMenuComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    TabsComponent,
    CardMenuComponent,
    IonicModule
  ]
})
export class SharedModule { }
