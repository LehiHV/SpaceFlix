import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../../shared-data.service';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.page.html',
  styleUrls: ['./ayuda.page.scss'],
})
export class AyudaPage implements OnInit {
  textoExpandido = false; // Controla la visualización del texto adicional
  textoExpandido1 = false;
  textoExpandido2 = false;
  textoExpandido3 = false; // Controla la visualización del texto adicional
  textoExpandido4 = false;
  textoExpandido5 = false;
  textoExpandido6 = false;
  textoExpandido7 = false;


  constructor(public sharedDataService: SharedDataService) { }

  ngOnInit() {
  }

  toggleText() {
    this.textoExpandido = !this.textoExpandido;
  }
  toggleText1() {
    this.textoExpandido1 = !this.textoExpandido1;
  }
  toggleText2() {
    this.textoExpandido2 = !this.textoExpandido2;
  }
  toggleText3() {
    this.textoExpandido3 = !this.textoExpandido3;
  }
  toggleText4() {
    this.textoExpandido4 = !this.textoExpandido4;
  }
  toggleText5() {
    this.textoExpandido5 = !this.textoExpandido5;
  }
  toggleText6() {
    this.textoExpandido6 = !this.textoExpandido6;
  }
  toggleText7() {
    this.textoExpandido7 = !this.textoExpandido7;
  }
}