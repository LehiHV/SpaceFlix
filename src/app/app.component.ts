import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { NavigationEnd, Router } from '@angular/router';
import { SharedDataService } from './shared-data.service';
import { register } from 'swiper/element/bundle';
import {Storage} from "@ionic/storage-angular";

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  activeRoute!: string;

  constructor(
    private router: Router,
    private menu: MenuController,
    public sharedDataService : SharedDataService,
    private storage: Storage) {
    // Suscribirse al evento de cambio de ruta
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Obtener la ruta activa
        this.activeRoute = this.router.url;
        this.menu.close('main-menu');
      }
    });
  }
  async logout(){
    await this.storage.create();
    await this.storage.remove('userData')
    this.sharedDataService.userData = null
    await this.sharedDataService.navCtrl.navigateBack("/welcome")
  }
}
