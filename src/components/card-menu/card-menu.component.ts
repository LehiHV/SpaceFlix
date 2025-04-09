import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/app/shared-data.service';
import { HttpClient } from '@angular/common/http';
import { Clipboard, WriteOptions } from '@capacitor/clipboard';
import { LocalNotifications } from '@capacitor/local-notifications';
import {share} from "rxjs";

@Component({
  selector: 'app-card-menu',
  templateUrl: './card-menu.component.html',
  styleUrls: ['./card-menu.component.scss'],
})
export class CardMenuComponent implements OnInit {

  private notificationIdCounter = 0;

  constructor(
    public sharedDataServices: SharedDataService,
    public http: HttpClient,
  ) {
    this.sharedDataServices.ShowProducts()
  }

  ngOnInit() {
    this.loadNotificationIdCounter();
    this.sharedDataServices.ShowProducts()
    LocalNotifications.requestPermissions();
  }

  Nombre: string = "";
  producto_seleccionado: any;
  cuenta: any;
  ticket: any;
  mostrarServicio: boolean = false;
  mostrarConfirmacion: boolean = false;
  mostrarCompra: boolean = false;
  warningNoServicios: boolean = false;
  informacionCard: any // Variable para almacenar la información de la card
  textoBoton: string = "Copiar"; // Texto inicial del botón
  fecha: string = '';
  cuenta_texto: string = '';
  isLoading = false; // Controla la visibilidad del indicador de carga y el estado del botón

  mostrarSegundaCard(producto: any) {
    this.mostrarServicio = true;
    this.producto_seleccionado = producto;
  }

  cerrarWarning() {
    this.warningNoServicios = false;
  }

  confirmarServicio() {
    if (this.producto_seleccionado.Cantidad >= 1) {
      this.mostrarServicio = false;
      this.mostrarConfirmacion = true
    } else {
      this.mostrarServicio = false;
      this.warningNoServicios = true;
    }
  }

  async confirmarCompra() {
    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
    const dia = ('0' + fecha.getDate()).slice(-2);
    this.fecha = `${anio}-${mes}-${dia}`;

    // Verificar que el producto seleccionado tenga ID y cantidad mayor que 0
    if (this.producto_seleccionado.Id && this.producto_seleccionado.Cantidad > 0) {
        this.isLoading = true; // Activar el indicador de carga antes de la solicitud
        const url = "https://phmsoft.tech/SpaceentApp/API's/USERS_API_REST.php";
        const params = {
            comando: 'Buy',
            // Datos de usuario
            Id: this.sharedDataServices.userData.Id,
            Usuario: this.sharedDataServices.userData.Usuario,
            Creditos: this.sharedDataServices.userData.Creditos,
            Pagar: this.sharedDataServices.userData.Creditos - this.producto_seleccionado.Precio,
            Ref: this.sharedDataServices.userData.Ref,
            // Datos del producto
            Id_Producto: this.producto_seleccionado.Id,
            Producto: this.producto_seleccionado.Nombre,
            Descripcion: this.producto_seleccionado.Descripcion,
            Cantidad: this.producto_seleccionado.Cantidad,
            Tipo_de_Cuenta: this.producto_seleccionado.Tipo_de_Cuenta,
            Precio: this.producto_seleccionado.Precio,
            Costo: this.producto_seleccionado.Costo,
            Foto: this.producto_seleccionado.Foto,
            // Datos del ticket
            Fecha: this.fecha
        };

        this.http.get<any>(url, { params }).subscribe(
            async (response) => {
                this.isLoading = false; // Desactivar el indicador de carga

                if (response.message === "Compra realizada Exitosamente") {
                    try {
                        await this.scheduleNotifications(this.producto_seleccionado.VigenciaDias);
                    } catch (error) {
                        console.error('Error al programar notificaciones:', error);
                    }

                    this.mostrarCompra = true;
                    this.mostrarConfirmacion = false;
                    this.sharedDataServices.userData = response.user;
                    this.ticket = response.ticket;
                    this.sharedDataServices.ShowProducts();

                    const mensaje = `Compra Realizada\n` +
                        `Numero de seguimiento: ${this.ticket.Id}\n` +
                        `Producto: ${this.ticket.Producto}\n${this.ticket.Descripcion}\n` +
                        `Correo: ${this.ticket.Correo}\n` +
                        `Contrasena: ${this.ticket.Contrasena}\n` +
                        `Perfiles: ${this.ticket.Perfiles}\n` +
                        `Pin: ${this.ticket.PIN}\n` +
                        `Fecha de Compra: ${this.ticket.Fecha_de_Compra}\n` +
                        `Total: ${this.ticket.Total}\n` +
                        `Fecha de Vencimiento: ${this.ticket.Fecha_Expiracion}\n` +
                        `Terminos y condiciones: recuerda no se debe cambiar ni correo ni contraseña, use la cantidad de dispositivos comprados (1), no manipule otros servicios diferentes al suyo, en caso que el servicio corte antes de tiempo no se da garantia por horas ya que el servicio se disfruto en mas de un 97%, Incumplir los terminos podria ocasionar perdida de la cuenta sin devolucion alguna.`;

                    console.log(response.prueba);
                    this.sharedDataServices.ShareViaWhatsApp(this.sharedDataServices.userData.Telefono, mensaje);
                } else {
                    this.sharedDataServices.alert("Menu Principal", "Compra", response.message);
                    this.cancelarConfirmacion();
                }
            },
            (error) => {
                this.isLoading = false; // Desactivar el indicador de carga
                console.error('Error en la llamada HTTP:', error);
                this.sharedDataServices.alert('Error en la llamada HTTP', "Por favor contactar con el servicio técnico", 'Ocurrió un error al intentar realizar la compra.');
            }
        );
    }
}

// Función para programar notificaciones
async scheduleNotifications(vigenciaDias: number) {
    this.notificationIdCounter++;
    const compraExitosaId = this.notificationIdCounter;
    this.saveNotificationIdCounter();

    const mitadPeriodo = new Date();
    const unDiaAntes = new Date();
    mitadPeriodo.setDate(mitadPeriodo.getDate() + 15);
    unDiaAntes.setDate(unDiaAntes.getDate() + 29);

    this.notificationIdCounter++;
    const vencimientoMitadId = this.notificationIdCounter;
    this.saveNotificationIdCounter();

    this.notificationIdCounter++;
    const vencimientoUnDiaAntesId = this.notificationIdCounter;
    this.saveNotificationIdCounter();

    await LocalNotifications.schedule({
        notifications: [
            {
                title: "Spaceflix",
                body: `Hola! ${this.sharedDataServices.userData.Usuario}, tu compra de ${this.producto_seleccionado.Nombre} fue exitosa.`,
                id: compraExitosaId,
                schedule: { at: new Date((new Date().getTime())+10*1000) },
                sound: 'default',
                smallIcon: 'LogoNoti.png',
                actionTypeId: "",
                extra: null
            },
            {
                title: "Spaceflix",
                body: `Hola! ${this.sharedDataServices.userData.Usuario}, tu cuenta de ${this.producto_seleccionado.Nombre} le restan 15 días de vigencia.`,
                id: vencimientoMitadId,
                schedule: { at: mitadPeriodo },
                sound: 'default',
                smallIcon: 'LogoNoti.png',
                actionTypeId: "",
                extra: null
            },
            {
                title: "Spaceflix",
                body: `Hola! ${this.sharedDataServices.userData.Usuario}, tu cuenta de ${this.producto_seleccionado.Nombre} vence mañana.`,
                id: vencimientoUnDiaAntesId,
                schedule: { at: unDiaAntes },
                sound: 'default',
                smallIcon: 'LogoNoti.png',
                actionTypeId: "",
                extra: null
            }
        ]
    });
}

// Funciones para manejar el contador de ID
loadNotificationIdCounter() {
    const savedCounter = localStorage.getItem('notificationIdCounter');
    if (savedCounter) {
        this.notificationIdCounter = parseInt(savedCounter);
    }
}

saveNotificationIdCounter() {
    localStorage.setItem('notificationIdCounter', this.notificationIdCounter.toString());
}

  cancelarConfirmacion() {
    this.mostrarServicio = false;
    this.mostrarConfirmacion = false;
  }

  cerrarCompra() {
    this.mostrarCompra = false;
    // Restablece el texto del botón a "Copiar" al cerrar la card
    this.textoBoton = "Copiar";
  }

  copiarInformacion() {
    this.textoBoton = "¡Copiado!";
    // Copia la información de la card al portapapeles
    this.cuenta_texto = this.ticket.Producto + "\n" + this.ticket.Descripcion + "\n" + "\nCorreo: " + this.ticket.Correo + "\nContraseña: " + this.ticket.Contrasena + "\nPerfiles: " + this.ticket.Perfiles + "\nPIN: " + this.ticket.PIN + "\nVencimiento: " + this.ticket.Fecha_Expiracion + "\nTerminos y condiciones: " + "\nRecuerda no se debe cambiar ni correo ni contraseña, use la cantidad de dispositivos comprados (1), no manipule otros servicios diferentes al suyo, en caso que el servicio corte antes de tiempo no se da garantia por horas ya que el servicio se disfruto en mas de un 97%, Incumplir los terminos podria ocasionar perdida de la cuenta sin devolucion alguna.";
    console.log(this.cuenta_texto);
    var options: WriteOptions = {
      string: this.cuenta_texto
    }
    Clipboard.write(options).then(() => {
      this.sharedDataServices.alert("Menu Principal", "Compra", "Datos copiados")
    })
  }

  copiarCorreo() {
    // Copia la información de la card al portapapeles
    this.cuenta_texto =  this.ticket.Correo;
    console.log(this.cuenta_texto);
    var options: WriteOptions = {
      string: this.cuenta_texto
    }
    Clipboard.write(options).then(() => {
      this.sharedDataServices.alert("Menu Principal", "Compra", "Correo copiado")
    })
  }

  copiarContrasena() {
    // Copia la información de la card al portapapeles
    this.cuenta_texto = this.ticket.Contrasena;
    console.log(this.cuenta_texto);
    var options: WriteOptions = {
      string: this.cuenta_texto
    }
    Clipboard.write(options).then(() => {
      this.sharedDataServices.alert("Menu Principal", "Compra", "Contraseña copiada")
    })
  }

  protected readonly share = share;
}
