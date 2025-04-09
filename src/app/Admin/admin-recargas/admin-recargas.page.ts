import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/app/shared-data.service';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import * as XLSX from 'xlsx';

// Interfaces
interface Recarga {
  Id: number;
  Id_Usuario: number;
  NombreUsuario: string;
  Fecha_Aprobacion_Compra: string;
  Total_Compra: number;
  Cantidad_Tarifa: number;
  Total_Con_Comision: number;
}

interface APIResponse {
  status: string;
  data: {
    recargas: Recarga[];
    stats: {
      total_recargas: number;
      monto_total: number;
      total_comisiones: number;
      monto_total_con_comision: number;
      promedio: number;
    };
    pagination: {
      total: number;
      current_page: number;
      per_page: number;
      total_pages: number;
    };
  };
}

@Component({
  selector: 'app-admin-recargas',
  templateUrl: './admin-recargas.page.html',
  styleUrls: ['./admin-recargas.page.scss'],
})

export class AdminRecargasPage implements OnInit {

  Usuario: string = '';
  CorreoTelefono: string = '';
  Saldo: number = 0;
  estaCargando: boolean = false;
  fechaInicio: string = '';
  fechaFin: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;
  recargas: any[] = [];
  stats: any = {
    total_recargas: 0,
    monto_total: 0,
    promedio: 0
  };

  constructor(
    public sharedDataService: SharedDataService,
    public http: HttpClient,
    private alertController: AlertController
  ) {
    this.initializeDates();
  }
  

  initializeDates() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    this.fechaInicio = firstDay.toISOString().split('T')[0];
    this.fechaFin = today.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.cargarRecargas();
  }

  async confirmarRecarga() {
    const alert = await this.alertController.create({
      header: 'Confirmar recarga',
      message: `¿Estás seguro de realizar la recarga al usuario: ${this.Usuario}, con correo: ${this.CorreoTelefono}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.sharedDataService.alert("Admin", "Recargas", "Cancelado");
          }
        },
        {
          text: 'Continuar',
          handler: () => {
            this.CargarSaldo();
          }
        }
      ]
    });

    await alert.present();
  }

  CargarSaldo() {
    if (this.Usuario && this.CorreoTelefono && this.Saldo) {
      this.estaCargando = true; // Activar el indicador de carga
      const url = "https://phmsoft.tech/SpaceentApp/API's/ADMIN_REST_API.php";

      // Obtener la fecha y hora actual del sistema
      const fechaActual = new Date();

      // Formatear la fecha y hora en una cadena adecuada para DateTime
      const año = fechaActual.getFullYear();
      const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
      const día = String(fechaActual.getDate()).padStart(2, '0');
      const horas = String(fechaActual.getHours()).padStart(2, '0');
      const minutos = String(fechaActual.getMinutes()).padStart(2, '0');
      const segundos = String(fechaActual.getSeconds()).padStart(2, '0');
      const fechaFormateada = `${año}-${mes}-${día} ${horas}:${minutos}:${segundos}`;

      const params = {
        comando: 'Recharge2',
        Usuario: this.Usuario,
        CoT: this.CorreoTelefono,
        Saldo: this.Saldo,
        Id_Admin: this.sharedDataService.userData.Id,
        admin: this.sharedDataService.userData.admin,
        Fecha: fechaFormateada
      };

      this.http.get<any>(url, { params }).subscribe(
        (response) => {
          this.estaCargando = false; // Desactivar el indicador de carga
          if (response && response.message === "Saldo Actualizado Correctamente") {
            this.sharedDataService.alert("Admin", "Recargas", response.message);
            this.Usuario = "";
            this.CorreoTelefono = "";
            this.Saldo = 0;
          } else {
            this.sharedDataService.alert("Admin", "Recargas", response.message);
          }
        },
        (error) => {
          this.estaCargando = false; // Desactivar el indicador de carga en caso de error
          console.log(error);
        }
      );
    } else {
      this.sharedDataService.alert("Admin", "Recargas", "Por favor rellenar todos los campos para realizar la recarga");
    }
  }

  getPaginasArray(): number[] {
    const paginas: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      paginas.push(i);
    }
    return paginas;
  }

  navigateToPage(pagina: number) {
    if (pagina !== this.currentPage && pagina > 0 && pagina <= this.totalPages) {
      this.currentPage = pagina;
      this.cargarRecargas();
    }
  }

  cargarRecargas() {
    this.estaCargando = true;
    const url = "https://phmsoft.tech/SpaceentApp/API's/RECARGAS_GET_API_USER.php";
    
    const params = {
      comando: 'GetRecargasAdmin',
      fecha_inicio: this.fechaInicio + ' 00:00:00',
      fecha_fin: this.fechaFin + ' 23:59:59',
      page: this.currentPage.toString(),
      limit: this.limit.toString()
    };

    this.http.get<any>(url, { params }).subscribe({
      next: (response) => {
        if (response.status === 'success' && response.data) {
          this.recargas = response.data.recargas;
          this.stats = response.data.stats;
          this.totalPages = response.data.pagination.total_pages;
        }
      },
      error: (error) => {
        console.error('Error al cargar recargas:', error);
        this.sharedDataService.alert(
          "Error",
          "Recargas",
          "Error al cargar los datos. Por favor intente nuevamente."
        );
      },
      complete: () => {
        this.estaCargando = false;
      }
    });
  }

  buscarRecargas() {
    this.currentPage = 1;
    this.cargarRecargas();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.cargarRecargas();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.cargarRecargas();
    }
  }

  exportarExcel() {
    const url = "https://phmsoft.tech/SpaceentApp/API's/RECARGAS_GET_API_USER.php";
    
    const params = {
      comando: 'GetRecargasAdmin',
      fecha_inicio: this.fechaInicio + ' 00:00:00',
      fecha_fin: this.fechaFin + ' 23:59:59',
      page: '1',
      limit: '1000000'
    };

    this.http.get<APIResponse>(url, { params }).subscribe({
      next: (response) => {
        if (response.status === 'success' && response.data) {
          const recargas = response.data.recargas;
          const stats = response.data.stats;
          
          // Formatear los datos para el Excel
          const datosRecargas = recargas.map((recarga: Recarga) => ({
            'ID Transacción': recarga.Id,
            'ID Usuario': recarga.Id_Usuario,
            'Nombre Usuario': recarga.NombreUsuario || 'No disponible',
            'Fecha y Hora': this.formatearFecha(recarga.Fecha_Aprobacion_Compra),
            'Monto Recargado': this.formatearNumero(recarga.Total_Compra),
            'Comisión': this.formatearNumero(recarga.Cantidad_Tarifa),
            'Total con Comisión': this.formatearNumero(recarga.Total_Con_Comision)
          }));

          // Preparar el resumen
          const resumen = [
            ['REPORTE DE RECARGAS'],
            ['Período:', `${this.formatearFecha(this.fechaInicio)} al ${this.formatearFecha(this.fechaFin)}`],
            [],
            ['RESUMEN'],
            ['Total de Recargas:', stats.total_recargas],
            ['Monto Total sin Comisión:', this.formatearNumero(stats.monto_total)],
            ['Total de Comisiones:', this.formatearNumero(stats.total_comisiones)],
            ['Monto Total con Comisión:', this.formatearNumero(stats.monto_total_con_comision)],
            ['Promedio por Recarga:', this.formatearNumero(stats.promedio)],
            []
          ];

          // Crear el libro de Excel
          const wb = XLSX.utils.book_new();
          
          // Agregar la hoja de resumen
          const wsResumen = XLSX.utils.aoa_to_sheet(resumen);
          XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen');

          // Agregar la hoja de detalles
          const wsDetalles = XLSX.utils.json_to_sheet(datosRecargas);
          
          // Ajustar el ancho de las columnas
          const wscols = [
            {wch: 15}, // ID Transacción
            {wch: 10}, // ID Usuario
            {wch: 30}, // Nombre Usuario
            {wch: 20}, // Fecha y Hora
            {wch: 15}, // Monto Recargado
            {wch: 15}, // Comisión
            {wch: 15}  // Total con Comisión
          ];
          wsDetalles['!cols'] = wscols;

          XLSX.utils.book_append_sheet(wb, wsDetalles, 'Detalles de Recargas');

          // Generar el nombre del archivo
          const fechaGeneracion = new Date().toLocaleString().replace(/[/:\s]/g, '-');
          const nombreArchivo = `Reporte_Recargas_${fechaGeneracion}.xlsx`;
          
          // Guardar el archivo
          XLSX.writeFile(wb, nombreArchivo);

          this.sharedDataService.alert(
            "Éxito",
            "Exportar",
            "El reporte se ha exportado correctamente"
          );
        }
      },
      error: (error) => {
        console.error('Error al exportar:', error);
        this.sharedDataService.alert(
          "Error",
          "Exportar",
          "Error al exportar los datos. Por favor intente nuevamente."
        );
      }
    });
  }

  // Funciones auxiliares para formateo
  private formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  private formatearNumero(numero: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(numero);
  }

}
