import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../../shared-data.service';

interface Usuario {
  fotoPerfil: string;
  correo: string;
  status: 'completado' | 'alerta' | 'negado';
}

@Component({
  selector: 'app-vista-reportes-usuario',
  templateUrl: './vista-reportes-usuario.page.html',
  styleUrls: ['./vista-reportes-usuario.page.scss'],
})
export class VistaReportesUsuarioPage implements OnInit {

  constructor(
    public sharedDataServices: SharedDataService,
  ) {}

  obtenerIcono(status:string) {
    switch (status) {
      case "1":
        return 'checkmark-circle-outline';
      case "0":
        return 'alert-circle-outline';
      case "-1":
        return 'close-circle-outline';
      default:
        return 'help-circle-outline'; // Un icono por defecto para estados desconocidos
    }
  }

  obtenerColor(status:string) {
    switch (status) {
      case "1":
        return 'success';
      case "0":
        return 'warning';
      case "-1":
        return 'danger';
      default:
        return 'medium'; // Un color por defecto para estados desconocidos
    }
  }
  usuariosFiltrados: Usuario[] = [];
  filtroCorreo: string = '';

  ngOnInit() {
    this.sharedDataServices.ShowReports()
  }
  verInfo(reporteSeleccionado: any) {
    this.sharedDataServices.navegarConDatos("/reportes-ver-info", reporteSeleccionado);
  }
}
