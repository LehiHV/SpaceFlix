import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MenuController } from '@ionic/angular';
import { SharedDataService } from '../../shared-data.service';
import { Storage } from '@ionic/storage-angular';
import { RecaptchaModule, RecaptchaFormsModule } from "ng-recaptcha";
import {UserData} from "../../shared-data.model";


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  usuario1: string = '';
  usuario: string = '';
  correo: string = '';
  contrasena: string = '';
  contrasena1: string = '';
  nombre_cliente: string = '';
  ref : string = "";
  telefono: string = '';
  lada: string = '';
  seleccion: string = '';
  isLoginView: boolean = true; // True para login, false para registro
  isDataMissing: boolean = false; // Variable para indicar si faltan datos
  recordarDatos: boolean = false;
  mostrarActualizacion: boolean = false;
  CNV: boolean = false;
  isLoading = false; // Controla la visibilidad del indicador de carga y el estado del botón
  captchaResolved: boolean = false;
  captchaResponse: string = '';

  segmentChanged(ev: any) {
    this.isLoginView = ev.detail.value === 'true';
  }


  constructor(
    public sharedDataService: SharedDataService,
    private http: HttpClient,
    private menu: MenuController,
    private storage: Storage
  ) {}

  ngOnInit() {
    this.sharedDataService.cargarLadas();

  }

  async ionViewWillEnter() {
    // Deshabilitar el menú en la página de login/registro
    this.menu.enable(false);

    // Cargar datos guardados si existen
    await this.storage.create();
    const recordarDatos = await this.storage.get('recordarDatos');
    if (recordarDatos !== null) {
      this.recordarDatos = recordarDatos;
      if (this.recordarDatos) {
        const usuario = await this.storage.get('usuario');
        const contrasena = await this.storage.get('contrasena');
        if (usuario !== null && contrasena !== null) {
          this.usuario1 = usuario;
          this.contrasena1 = contrasena;
        }
      }
    }
  }


  ionViewWillLeave() {
    // Habilitar el menú al salir de la página de login/registro
    this.menu.enable(true);
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  }


  onCaptchaResolved(response: string | null): void {
    if (response) {
      this.captchaResolved = true;
      this.captchaResponse = response;
    } else {
      this.captchaResolved = false;
      this.captchaResponse = ''; // O maneja el caso de 'null' como prefieras
    }
  }

  async LoginAccess() {
    if (!this.captchaResolved) {
      this.CNV = true;
    }
    this.isDataMissing = !(this.usuario1 && this.contrasena1 && this.captchaResolved);

    if (!this.isDataMissing) {
      this.isLoading = true;

      if (this.usuario1 === "admin1") {
        const url = "https://phmsoft.tech/SpaceentApp/API's/USERS_API_REST.php";
        const params = new HttpParams()
          .set('comando', 'Login2')
          .set('Usuario', this.usuario1)
          .set('Contrasena', this.contrasena1)
          .set('CaptchaResponse', this.captchaResponse);

        this.http.get<any>(url, { params }).subscribe(
          async (response) => {
            this.isLoading = false;
            if (response) {
              this.sharedDataService.userData = response;

              const userData: UserData = response
              const expireDate: Date = new Date()
              userData.expiresAt = new Date(expireDate.setDate(expireDate.getDate() + 1));
              await this.storage.set('userData', userData);

              this.sharedDataService.navegar("/home");

              if (this.recordarDatos) {
                await this.storage.set('usuario', this.usuario1);
                await this.storage.set('contrasena', this.contrasena1);
              }
            } else {
              this.sharedDataService.alert('Inicio de sesión', 'Datos Erroneos', 'Revisa sus datos de acceso');
            }
          },
          (error) => {
            this.isLoading = false;
            console.error('Error en la llamada HTTP:', error);
            this.sharedDataService.alert('Error en la llamada HTTP', "Por favor contactar con el servicio técnico", 'Ocurrió un error al intentar iniciar sesión.');
          }
        );
      } else {
        const versionUrl = "https://phmsoft.tech/SpaceentApp/API's/USERS_API_REST.php";
        const versionParams = new HttpParams()
          .set('comando', 'CheckVersion')
          .set('Version_App', "10"); ////// IMPORTANTE CHICOS Aquí se debe enviar la versión actual de la app, debemos cambairla aqui y en la base de datos cada que hagamos una nueva version para forzar a actualizar

        this.http.get<any>(versionUrl, { params: versionParams }).subscribe(
          async (versionResponse) => {
            if (versionResponse && versionResponse.Version_App == 10) {/////Y AQUI TAMBIEN CHICOS SE CAMBIA LA VERSION PARA FORZAR A MOSTRAR MENSAJE DE ACTUALIZACION
              const url = "https://phmsoft.tech/SpaceentApp/API's/USERS_API_REST.php";
              const params = new HttpParams()
                .set('comando', 'Login2')
                .set('Usuario', this.usuario1)
                .set('Contrasena', this.contrasena1)
                .set('CaptchaResponse', this.captchaResponse);

              this.http.get<any>(url, { params }).subscribe(
                async (response) => {
                  this.isLoading = false;
                  if (response) {

                    this.sharedDataService.userData = response;
                    const userData: UserData = response
                    const expireDate: Date = new Date()
                    userData.expiresAt = new Date(expireDate.setDate(expireDate.getDate() + 1));
                    await this.storage.set('userData', userData);

                    if (this.sharedDataService.userData.Admin == 1) {
                      this.sharedDataService.navegar("/home-admin");
                    } else if (this.sharedDataService.userData.Desabilitada == 0) {
                      this.sharedDataService.navegar("/home-admin");
                    } else if(response.message != "Usuario no encontrado") {
                      this.sharedDataService.navegar("/home");
                    } else {
                      this.sharedDataService.alert('Inicio de sesión', 'Datos Erroneos', 'Revisa sus datos de acceso');
                    }
                  } else {
                    this.sharedDataService.alert('Inicio de sesión', 'Datos Erroneos', 'Revisa sus datos de acceso');
                  }

                  if (this.recordarDatos) {
                    await this.storage.set('usuario', this.usuario1);
                    await this.storage.set('contrasena', this.contrasena1);
                  }
                },
                (error) => {
                  this.isLoading = false;
                  console.error('Error en la llamada HTTP:', error);
                  this.sharedDataService.alert('Error en la llamada HTTP', "Por favor contactar con el servicio técnico", 'Ocurrió un error al intentar iniciar sesión.');
                }
              );
            } else {
              this.isLoading = false;
              this.mostrarActualizacion = true;
            }
          },
          (versionError) => {
            this.isLoading = false;
            console.error('Error en la verificación de la versión:', versionError);
            this.sharedDataService.alert('Error en la verificación de la versión', "Por favor contactar con el servicio técnico", 'Ocurrió un error al verificar la versión de la aplicación.');
          }
        );
      }
    }
  }


  async RegisterAccess() {
    this.isDataMissing = !(this.usuario && this.contrasena && this.correo && this.nombre_cliente && this.telefono && this.seleccion);

    if (!this.isDataMissing && this.ref != this.usuario) {
      // Validar el correo electrónico
      if (!this.validateEmail(this.correo)) {
        this.sharedDataService.alert('Registro', "Correo no válido", 'Por favor, introduce un correo electrónico válido.');
        return;
      }

      this.isLoading = true; // Activa el indicador de carga
      const url = "https://phmsoft.tech/SpaceentApp/API's/USERS_API_REST.php";
      const params = {
        comando: 'Add',
        Usuario: this.usuario,
        Correo: this.correo,
        Contrasena: this.contrasena,
        Nombre_Cliente: this.nombre_cliente,
        Telefono: this.seleccion + this.telefono,
        Total_Compras: 0,
        Creditos: 0,
        Ref : this.ref
      };

      this.http.get<any>(url, { params }).subscribe(
        (response) => {
          this.isLoading = false; // Desactiva el indicador de carga
          if (response.message === 'Usuario agregado correctamente') {
            this.sharedDataService.navegar("/login");
            this.sharedDataService.alert('Registro', "Registro Exitoso", response.message);
          } else {
            this.sharedDataService.alert('Registro', "Error al Registrar", response.message);
          }
        },
        (error) => {
          this.isLoading = false; // Desactiva el indicador de carga
          console.error('Error en la llamada HTTP:', error);
          this.sharedDataService.alert('Registro', "Datos Erróneos", 'Revisa tus datos para registro.');
        }
      );
    } else {
      this.sharedDataService.alert('Registro', "Datos incompletos", 'Por favor, completa todos los campos.');
    }
  }

    togglePasswordVisibility() {
    const inputField = document.getElementById('contrasenaInput') as HTMLInputElement; // Realiza un casting explícito al tipo HTMLInputElement
    if (inputField.getAttribute('type') === 'password') {
        inputField.setAttribute('type', 'text'); // Cambia el tipo de entrada a texto claro
    } else {
        inputField.setAttribute('type', 'password'); // Cambia el tipo de entrada a contraseña
    }
}
contrasenaWhatsapp() {

  // Crear la URL de WhatsApp con el número de teléfono y el mensaje
  const url = `https://api.whatsapp.com/send?phone=5213316715889&text=Hola%2C%20necesito%20recuperar%20mi%20contrase%C3%B1a.%20%C2%BFMe%20puedes%20ayudar%3F`;

  // Abrir la URL en una nueva pestaña o ventana
  window.open(url);
}

async saveToggleState() {
  await this.storage.set('recordarDatos', this.recordarDatos);
}

irPolitica (){
  this.sharedDataService.navegar("/politica-privacidad")
}

irActualizacion(){
    // Crear la URL de WhatsApp con el número de teléfono y el mensaje
    const url = `https://play.google.com/store/apps/details?id=io.PHMSoft.SF`;

    // Abrir la URL en una nueva pestaña o ventana
    window.open(url);
}

}
