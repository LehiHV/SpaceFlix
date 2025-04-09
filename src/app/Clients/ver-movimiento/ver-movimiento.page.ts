import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/app/shared-data.service';
import { Clipboard, WriteOptions } from '@capacitor/clipboard';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular'; 

@Component({
  selector: 'app-ver-movimiento',
  templateUrl: './ver-movimiento.page.html',
  styleUrls: ['./ver-movimiento.page.scss'],
})
export class VerMovimientoPage implements OnInit {
  cuenta: any;
  cuenta_texto: string = '';
  warningNoCodigo: boolean = false;
  readyCodigo: boolean = false;
  textoWarnigCodigo: string = '';
  textoReadyCodigo: string = '';

  constructor(
    public sharedDataService: SharedDataService,
    private http: HttpClient,
    public alertController: AlertController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.cuenta = this.sharedDataService.Item; // Accedes al reporte seleccionado
    if (!this.cuenta) {
      console.error('No hay reporte seleccionado');
    }
  }

  Close() {
    this.sharedDataService.navegar('/movimientos');
  }
  
  cerrarWarning() {
    this.warningNoCodigo = false;
  }

  cerrarReady() {
    this.readyCodigo = false;
  }

  async obtenerCodigo() {
   // Ajustar la regex para que coincida con nombres que comiencen con 'Netflix', 'Disney', etc.
   const productoElegibleRegex = /^(Netflix|Disney|Star Plus|Combo plus|Netflix 4 Pantallas)(\s.*)?$/;
  
    if (!productoElegibleRegex.test(this.cuenta.Producto)) {
      console.log(this.cuenta.Producto)
      this.sharedDataService.alert('Movimientos', 'Atención', 'Este servicio no es elegible para solicitar algún código');
      return;
    }
  
    let selectedService = this.cuenta.Producto;
  
    if (this.cuenta.Producto === 'Combo plus ') {
      const alert = await this.alertController.create({
        header: 'Selecciona un servicio',
        message: 'Elige uno de los siguientes servicios:',
        buttons: [
          {
            text: 'Star Plus',
            handler: () => {
              selectedService = 'Star Plus';
              this.enviarRequest(selectedService);
            },
          },
          {
            text: 'Disney Plus',
            handler: () => {
              selectedService = 'Disney Plus';
              this.enviarRequest(selectedService);
            },
          },
        ],
      });
      await alert.present();
    } else if (this.cuenta.Producto === 'Netflix 4 Pantallas' || this.cuenta.Producto === 'Netflix') {
      const alert = await this.alertController.create({
        header: 'Selecciona una opción',
        message: 'Elige una de las siguientes opciones:',
        buttons: [
          {
            text: 'Inicio de Sesión',
            handler: () => {
              this.enviarRequest('Netflix Inicio de Sesión');
            },
          },
          {
            text: 'Código Estoy de Viaje',
            handler: () => {
              selectedService = 'Netflix Código Estoy de Viaje';
              this.enviarRequest(selectedService);
            },
          },
          {
            text: 'Actualizar Hogar Netflix',
            handler: () => {
              selectedService = 'Netflix Actualizar Hogar'
              this.enviarRequest(selectedService);
            },
          },
        ],
      });
      await alert.present();
    } else {
      this.enviarRequest(selectedService);
    }
  }
  
  
  async enviarRequest(selectedService: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=UTF-8' });
    const options = { headers: headers };
    const data = {
      service: selectedService,
      email: this.cuenta.Correo,
    };
  
    this.http.post('https://python-server-1.onrender.com/obtener-codigo', data, options)
      .subscribe({
        next: async (response: any) => {
          let messages = response.text;
          let buttons = '';
  
          if (selectedService === 'Netflix Código Estoy de Viaje' || selectedService === 'Netflix Actualizar Hogar') {
            const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
            if (urlPattern.test(response.text)) {
              buttons = 'Click aquí';
              messages = 'Obtener código de verificación';
            }
  
            const alert = await this.alertController.create({
              header: 'Código de verificación',
              message: messages,
              buttons: [
                {
                  text: buttons,
                  handler: () => {
                    window.open(response.text, '_blank');
                  },
                },
                {
                  text: 'Cancelar',
                  role: 'cancel',
                  handler: () => {
                    console.log('Alerta cancelada');
                  },
                },
              ],
            });
  
            await alert.present();
          } else {
            const message = response.text;
            if (message === 'No se encontró el código de verificación, inténtalo de nuevo en 1 minuto') {
              this.textoWarnigCodigo = message;
              this.warningNoCodigo = true;
            } else {
              this.textoReadyCodigo = message;
              this.readyCodigo = true;
            }
          }
        },
        error: async (error) => {
          // Manejar el error aquí sin mostrarlo en la consola
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'Ocurrió un error al obtener el código. Por favor, inténtalo de nuevo más tarde.',
            buttons: ['OK'],
          });
  
          await alert.present();
        }
      });
  }
  
  Copy(){
    // Copia la información de la card al portapapeles
    if(this.cuenta.Correo != undefined){
      this.cuenta_texto ="Servicio: " + this.cuenta.Producto
                +  "\n" + "Correo: " + this.cuenta.Descripcion
                +  "\n" + "Correo: " + this.cuenta.Correo
                +  "\n" + "Contraseña: " + this.cuenta.Contrasena
                +  "\n" + "Perfiles: " + this.cuenta.Perfiles
                +  "\n" + "PIN: " + this.cuenta.PIN
                +  "\n" + "Fecha de Compra: " + this.cuenta.Fecha_de_Compra
                +  "\n" + "Expira: " + this.cuenta.Fecha_Expiracion
                +  "\n" + "Días Restantes: " + this.cuenta.Dias_Vigentes
      var options:WriteOptions = {
        string:this.cuenta_texto
      }
      Clipboard.write(options).then(()=>{
      this.sharedDataService.alert("Movimientos", "Movimientos","Datos Copiados")
      })
    }else{
      this.cuenta_texto ="Saldo: Recarga de Saldo"
                + "\n"  + "Cantidad: " + this.cuenta.Cantidad
                + "\n"  + "Usuario: " + this.sharedDataService.userData.Usuario
                + "\n"  + "Id de Seguimiento: " + this.cuenta.Id
                + "\n"  + "Fecha: " + this.cuenta.Fecha  
      var options:WriteOptions = {
        string:this.cuenta_texto
      }
      Clipboard.write(options).then(()=>{
      this.sharedDataService.alert("Movimientos", "Movimientos","Datos Copiados")
      });
    }
  }
}
