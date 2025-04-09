import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { SharedDataService } from '../../shared-data.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  constructor(
    private menu: MenuController,
    private sharedDataService: SharedDataService
  ) {}
 
  ngOnInit() {
  }

  ionViewWillEnter() {
    // Deshabilitar el menú en la página de login
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    // Habilitar el menú al salir de la página de login
    this.menu.enable(true);
  }

  irPagina2() {
    this.sharedDataService.navegar('/home');
    
  }
  
  irRegistro() {
    // Redirige a la página Home
    this.sharedDataService.navegar('/regsitro');
  }

  irLogin() {
    // Redirige a la página Home
    this.sharedDataService.navegar('/login');
  }

}

