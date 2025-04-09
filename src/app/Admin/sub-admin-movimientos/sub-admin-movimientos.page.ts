import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/app/shared-data.service';

@Component({
  selector: 'app-sub-admin-movimientos',
  templateUrl: './sub-admin-movimientos.page.html',
  styleUrls: ['./sub-admin-movimientos.page.scss'],
})
export class SubAdminMovimientosPage implements OnInit {
  constructor(
    public sharedDataServices : SharedDataService
  ) {}
  sub_admin: any
  searchText: string = '';
  ngOnInit() {
    this.sub_admin = this.sharedDataServices.Item;
    if (!this.sub_admin) {
      console.error('No hay sub admin seleccionado');
    }
    //console.log(this.sub_admin.acciones)
  }
  getImagenURL(seccion: string): string {
    switch (seccion) {
      case 'Recargas':
        return 'assets/Recargas.png';
      case 'Usuarios':
        return 'assets/Usuarios.png';
      case 'Servicios':
        return 'assets/Servicios.png';
      case 'Excel':
          return 'assets/Cuentas & Refs.png';
      case 'Ventas':
          return 'assets/Ventas.png';
      case 'Reportes':
          return 'assets/ReportesFallos.png';
      case 'Cuentas':
          return 'assets/Cuentas.png';
      default:
        return ''; // Si no hay una imagen definida para la sección, devolvemos una cadena vacía
    }
  }

  vermovimiento(sub_admin: any, action: object) {
      // Copiar todas las propiedades de sub_admin a un nuevo objeto
      const resultado = { ...sub_admin };

      // Agregar el objeto action al nuevo objeto resultado
      resultado['action'] = action;

      // Devolver el nuevo objeto resultado
      this.sharedDataServices.navegarConDatos("/detalle-movimientos-subadmin",resultado)
  }
}
