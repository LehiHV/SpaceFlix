import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { SharedDataService } from '../../shared-data.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-regsitro',
  templateUrl: './regsitro.page.html',
  styleUrls: ['./regsitro.page.scss'],
})

export class RegsitroPage implements OnInit {
  usuario: string = '';
  correo: string = '';
  contrasena: string = '';
  nombre_cliente: string = '';
  telefono: string = '';
  
  seleccion: string=''
  lada:string=''
  constructor(
    public navCtrl: NavController,
    public sharedDataService: SharedDataService,
    private http: HttpClient,
    private menu: MenuController
  ) { }

  ngOnInit() {
    this.sharedDataService.cargarLadas();
   }

  ionViewWillEnter() {
    // Deshabilitar el menú en la página de login
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    // Habilitar el menú al salir de la página de login
    this.menu.enable(true);
  }

  
  
  async RegisterAccess(){
    if (this.usuario && this.contrasena && this.correo && this.nombre_cliente && this.telefono) {
      // Realizar la llamada HTTP para registrar al usuario
      const url = "https://phmsoft.tech/SpaceentApp/API's/USERS_API_REST.php"; // Reemplaza con tu URL de registro
      const params = {
        comando: 'Add',
        Usuario: this.usuario,
        Correo: this.correo,
        Contrasena: this.contrasena,
        Nombre_Cliente: this.nombre_cliente,
        Telefono: this.seleccion + this.telefono,
        Total_Compras: 0,
        Creditos: 0
      };
      
      this.http.get<any>(url, { params }).subscribe(
        (response) => {
          // Verificar la respuesta del servidor
          console.log(response);
          if (response.message === 'Usuario agregado correctamente') {
            // Registro exitoso, puedes redirigir a la página de inicio de sesión u otra página
            this.sharedDataService.navegar("/login");
            this.sharedDataService.alert('Registro',"Registro Exitoso", response.message);
          } else {
            // Mensaje de error del servidor
            this.sharedDataService.alert('Registro',"Error al Registrar" ,response.message);
          }
        },
        (error) => {
          console.error('Error en la llamada HTTP:', error);
          this.sharedDataService.alert('Registro',"Datos Erroneos" ,'Revisa tus datos para registro.');
        }
      );
    } else {
      this.sharedDataService.alert('Registro',"Porfavor de completar los datos" ,'Por favor, complete todos los campos.');
    }
  }

 
  

}




