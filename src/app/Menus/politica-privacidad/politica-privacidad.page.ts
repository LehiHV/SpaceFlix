import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-politica-privacidad',
  templateUrl: './politica-privacidad.page.html',
  styleUrls: ['./politica-privacidad.page.scss'],
})
export class PoliticaPrivacidadPage implements OnInit {

  constructor(
    private menu: MenuController
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    // Deshabilitar el menú en la página de login/registro
    this.menu.enable(false);
  }
}
