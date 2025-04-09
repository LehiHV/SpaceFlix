import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedDataService } from '../../shared-data.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.page.html',
  styleUrls: ['./perfil-usuario.page.scss'],
})
export class PerfilUsuarioPage implements OnInit {

  constructor(
    public sharedDataService: SharedDataService,
    private http: HttpClient) { }

  ngOnInit() {
  }

  mostrarConfirmacion: boolean = false;
  mostrarExito: boolean = false;
  mostrarSegundaCard() {
    this.mostrarConfirmacion = true;
   
  }
  cancelarCambio() {
    this.mostrarConfirmacion = false;
  }
  confirmarCambio() {
    const url = "https://phmsoft.tech/SpaceentApp/API's/USERS_API_REST.php"
    const params={
      comando : "Update",
      Id : this.sharedDataService.userData.Id,
      Usuario: this.sharedDataService.userData.Usuario,
      Nombre_Cliente: this.sharedDataService.userData.Nombre_Cliente,
      Correo: this.sharedDataService.userData.Correo,
      Telefono : this.sharedDataService.userData.Telefono,
      Contrasena : this.sharedDataService.userData.Contrasena,
      Total_Compras: this.sharedDataService.userData.Total_Compras,
      Creditos : this.sharedDataService.userData.Creditos,
      VIP: this.sharedDataService.userData.VIP
    }
    this.http.get<any>(url, {params}).subscribe(
      (response)=>{
        if(response.message = "Usuario actualizado Correctamente"){
          //console.log(response.message)
          //console.log(params)
          this.mostrarConfirmacion = false;
          this.mostrarExito = true;
        }else{
          this.sharedDataService.alert("Usuario","Actualizar Datos",response.message)
          this.mostrarConfirmacion = false;
        }
      },
      (error)=>{
        console.error('Error en la llamada HTTP:', error);

          // Mostrar alerta de error
          this.sharedDataService.alert('Error en la llamada HTTP',"Porfavor contactar con el servicio tecnico" ,'Ocurrió un error al intentar iniciar sesión.');
      }
    )
  };
  aceptarCambio(){
    this.mostrarExito = false;
  }

  

}
