import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { SharedDataService } from '../../shared-data.service';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.page.html',
  styleUrls: ['./movimientos.page.scss'],
})
export class MovimientosPage implements OnInit {
  paginaActual: string = 'Reportes'; // Puedes establecer la página actual aquí
  constructor(
    public navCtrl: NavController,
    public sharedDataService: SharedDataService
    ) { }

  ngOnInit() {
    this.sharedDataService.ShowClientAccounts(this.sharedDataService.userData.Id)
  }
  correoCuenta : string = "";
  showMovementsDetails(cuenta:any){
    this.sharedDataService.navegarConDatos("/ver-movimiento", cuenta);
  }

}
