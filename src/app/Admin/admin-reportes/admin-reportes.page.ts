import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../../shared-data.service';
import { PushNotifications } from "@capacitor/push-notifications";
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface Usuario {
  fotoPerfil: string;
  correo: string;
  status: 'completado' | 'alerta' | 'negado';
}

@Component({
  selector: 'app-admin-reportes',
  templateUrl: './admin-reportes.page.html',
  styleUrls: ['./admin-reportes.page.scss'],
})
export class AdminReportesPage implements OnInit {

  usuariosFiltrados: Usuario[] = [];
  filtroCorreo: string = '';

  paginas: number[] = [];  // Lista de páginas
  currentPage: number = 1;  // Página actual
  totalPages: number = 0;  // Total de páginas

  constructor(public sharedDataServices: SharedDataService) {}

  ngOnInit() {
    this.loadReports(this.currentPage);  // Cargar la primera página al inicio
  }


  loadReports(page: number) {
    this.sharedDataServices.ShowReportsAdmin(page).subscribe((response: any) => {
      this.usuariosFiltrados = response.reportes;  // Asignar los usuarios de la página actual
      this.totalPages = response.pages;   // Obtener el total de páginas
      this.paginas = Array(this.totalPages).fill(0).map((x, i) => i + 1);  // Crear array de páginas
    });
  }


  navigateToPage(pageNumber: number) {
    this.currentPage = pageNumber;  // Actualizar la página actual
    this.loadReports(pageNumber);   // Cargar la nueva página
  }

  // Obtener icono según el status
  obtenerIcono(status: string) {
    switch (status) {
      case "1":
        return 'checkmark-circle-outline';
      case "0":
        return 'alert-circle-outline';
      case "-1":
        return 'close-circle-outline';
      default:
        return 'help-circle-outline';
    }
  }

  // Obtener color según el status
  obtenerColor(status: string) {
    switch (status) {
      case "1":
        return 'success';
      case "0":
        return 'warning';
      case "-1":
        return 'danger';
      default:
        return 'medium';
    }
  }

  // Navegar al detalle de un reporte seleccionado
  verInfo(reporteSeleccionado: any) {
    this.sharedDataServices.navegarConDatos("/reportes-admin", reporteSeleccionado);
  }
}
