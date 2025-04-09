import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SharedDataService } from '../../shared-data.service';
import { share } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface Ticket {
  Id: string;
  Servicio: string;
  Correo: string;
  // Agrega otros campos según sea necesario
}

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
})
export class ReportesPage implements OnInit {
  paginaActual: string = 'Reportes';
  correoCuenta: string = '';
  Reporte: string = '';
  fecha : string =''
  constructor(
    public navCtrl: NavController,
    public sharedDataService: SharedDataService,
    public http : HttpClient
  ) { }

  ngOnInit() {
    this.sharedDataService.ShowClientAccounts(this.sharedDataService.userData.Id);
    if (!this.sharedDataService.TicketList) {
      this.sharedDataService.TicketList = []; // Inicializa TicketList como un arreglo vacío si aún no está definido
    }
  }

  CrearReporte(cuenta: any){
    if(this.correoCuenta && this.Reporte){
      const fecha = new Date();
      const anio = fecha.getFullYear();
      const mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
      const dia = ('0' + fecha.getDate()).slice(-2);
      const hora = ('0' + fecha.getHours()).slice(-2);
      const minuto = ('0' + fecha.getMinutes()).slice(-2);
      this.fecha = anio+'-'+mes+'-'+dia + " " + hora + ":" + minuto;
      const url= "https://phmsoft.tech/SpaceentApp/API's/REPORTS_API_REST.php";
      const params ={
        comando : "Add",
        Id_Usuario: this.sharedDataService.userData.Id,
        Usuario: this.sharedDataService.userData.Usuario,
        Tipo : 1,
        Problema : this.Reporte,
        Fecha_Inicio: this.fecha,
        Cerrado : 0,
        Id_Cuenta: cuenta.Id_Cuenta,
        Id_Ticket : cuenta.Id,
        Correo: cuenta.Correo,
        Contrasena: cuenta.Contrasena,
        Servicio: cuenta.Producto,
        Perfiles : cuenta.Perfiles,
        PIN: cuenta.PIN,
        Fecha_de_Compra : cuenta.Fecha_de_Compra,
        Fecha_Expiracion : cuenta.Fecha_Expiracion,
        Dias_Vigentes: cuenta.Dias_Vigentes,
        Total: cuenta.Total
      }
      this.http.get<any>(url, {params}).subscribe(
        (response) =>{
          //console.log(response)
          if(response.message == "Reporte agregado correctamente"){
            this.sharedDataService.alert("Reportes","Cuentas",response.message);
            this.correoCuenta= "";
            this.Reporte = "";
          }
        },
        (error)=>{
          this.sharedDataService.alert("Reportes","Cuentas",error);
          this.correoCuenta= "";
        }
      )
    }else{
      this.sharedDataService.alert("Reportes","Cuentas","Porfavor rellenar los datos para crear un reporte")
    }
  }
  
}
