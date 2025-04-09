import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../../shared-data.service';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-renovar',
  templateUrl: './renovar.page.html',
  styleUrls: ['./renovar.page.scss'],
})
export class RenovarPage implements OnInit {
  preciosActuales: { [key: number]: number } = {}; // Diccionario para almacenar precios de productos
  precioActual: number = 0; // Propiedad para almacenar el precio actual
  constructor(
    public sharedDataServices: SharedDataService,
    private cdr: ChangeDetectorRef,
    public http: HttpClient,
  ) {}

  ngOnInit() {
    this.sharedDataServices.ShowClientAccountsRenew(
      this.sharedDataServices.userData.Id
    );
  }
  mostrarConfirmacion: boolean = false;
  mostrarExitoRenovar: boolean = false;
  Ticket: any;

  // Método para obtener el precio actual del servicio desde la DB
  obtenerPrecioServicio(id: number) {
    const url = "https://phmsoft.tech/SpaceentApp/API's/PRODUCTS_API_REST.php";
    const params = {
      comando: 'ViewOnlyProducts',
      Id: this.sharedDataServices.userData.Id
    };

    this.http.get<any>(url, { params }).subscribe(
      (response) => {
        if (response && Array.isArray(response)) {
          const producto = response.find((p: any) => p.Id === id);
          this.precioActual = producto ? producto.Precio : 0;
        }
      },
      (error) => {
        this.sharedDataServices.alert('Error', 'Error al obtener el precio', error);
      }
    );
  }

  mostrarSegundaCard(objeto: any) {
    this.Ticket = objeto;
    // Verifica que this.Ticket y this.Ticket.Descripcion estén definidos y que Descripcion sea una cadena
    if (this.Ticket && typeof this.Ticket.Descripcion === 'string') {
      // Verifica si la descripción del producto contiene una palabra similar a "generico" o "generica"
      if (/gen[eé]ric[oa]/i.test(this.Ticket.Descripcion)) {
        this.sharedDataServices.alert(
          'Renovar',
          'Alerta',
          'No se pueden renovar cuentas genéricas'
        );
        return;
      }
    }
   // Obtener el precio del servicio cuando se muestra la confirmación
   this.obtenerPrecioServicio(this.Ticket.Id_Producto_Servicio);
    this.mostrarConfirmacion = true;
    console.log(this.precioActual);
  }

  cancelarConfirmacion() {
    this.mostrarConfirmacion = false;
  }
  cerrarExito() {
    this.mostrarExitoRenovar = false;
  }

  renovar(account: any) {
    // Obtener el precio actual del producto
    console.log(this.precioActual);
    this.mostrarConfirmacion = false;
    if (this.precioActual===0){
      this.sharedDataServices.alert(
        'Renovar',
        'Renovar cuentas',
        'Error al renovar, vuelve a intentar'
      );
    }

    if (this.sharedDataServices.userData.Creditos < this.precioActual) {
      this.sharedDataServices.alert(
        'Renovar',
        'Renovar Cuentas',
        'Saldo insuficiente para la renovación'
      );
    }
    else {
      const url = "https://phmsoft.tech/SpaceentApp/API's/ACCOUNT_API_REST.php";
      const params = {
        comando: 'Renew',
        Id: account.Id,
        Id_Usuario: this.sharedDataServices.userData.Id,
        Id_Producto_Servicio: account.Id_Producto_Servicio,
        Id_Cuenta: account.Id_Cuenta,
      };
      console.log(params);
      this.http.get<any>(url, { params }).subscribe(
        (response) => {
          if (response.message === 'Cuenta actualizada correctamente') {
            this.mostrarExitoRenovar = true;
          }
          this.sharedDataServices.userData = response.user
        },
        (error) => {
          this.sharedDataServices.alert('Renovar', 'Renovar Cuentas', error);
          this.correoCuenta = '';
        }
      );
    }
  }

  correoCuenta: string = '';
}
