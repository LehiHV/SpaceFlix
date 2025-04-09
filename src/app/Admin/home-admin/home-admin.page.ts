import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedDataService } from '../../shared-data.service';
import { MenuController } from '@ionic/angular';
import {Storage} from "@ionic/storage-angular";

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.page.html',
  styleUrls: ['./home-admin.page.scss'],
})
export class HomeAdminPage implements OnInit {
  FechaHoy: Date | null = null; // Definido como Date

  constructor(
    public sharedDataService: SharedDataService,
    private http: HttpClient,
    private menu: MenuController,
    private storage: Storage) {
      this.sharedDataService.ShowFechaHoy()
     }

  ngOnInit() {
    this.sharedDataService.ShowFechaHoy()
  }

  ionViewWillEnter() {
    // Deshabilitar el menú en la página home -admin
    this.menu.enable(false);
  }


  irVentas() {
    // Redirige a la página Home
    this.sharedDataService.navegar("/adminprofit");
  }

  irRecargas() {
    // Redirige a la página Recargas
    this.sharedDataService.navegar("/admin-recargas");
  }

  irUsuarios() {
    // Redirige a la página Usuarios
    this.sharedDataService.navegar("/admin-usuarios");
  }

  irServicios() {
    // Redirige a la página servicios
    this.sharedDataService.navegar("/admin-servicios");
  }

  irExcel() {
    // Redirige a la página Subida-excel
    this.sharedDataService.navegar("/admin-subida-excel");
  }

  irReportes() {
    // Redirige a la página Home
    this.sharedDataService.navegar("/admin-reportes");
  }
  irCuentas(){
    this.sharedDataService.navegar("/cuentas");
  }
  irSub_Admins(){
    this.sharedDataService.navegar("/sub-admin");
  }
  irCuentas_Bot(){
    this.sharedDataService.navegar("/admin-cuentas-bot");
  }
  irTickets(){
    this.sharedDataService.navegar("/tickets");
  }
  async logout(){
    await this.storage.create();
    await this.storage.remove('userData')
    this.sharedDataService.userData = null
    await this.sharedDataService.navCtrl.navigateBack("/welcome")
  }

}
