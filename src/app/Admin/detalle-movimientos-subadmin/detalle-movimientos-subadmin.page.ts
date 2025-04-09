import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/app/shared-data.service';

@Component({
  selector: 'app-detalle-movimientos-subadmin',
  templateUrl: './detalle-movimientos-subadmin.page.html',
  styleUrls: ['./detalle-movimientos-subadmin.page.scss'],
})
export class DetalleMovimientosSubadminPage implements OnInit {

  constructor(
    public sharedDataServices : SharedDataService
  ) { }
  sub_admin: any
  ngOnInit() {
    this.sub_admin = this.sharedDataServices.Item;
    if (!this.sub_admin) {
      console.error('No hay sub admin seleccionado');
    }
    
  }
  volver(){
      this.sharedDataServices.navegar("/sub-admin-movimientos")
  }
}
