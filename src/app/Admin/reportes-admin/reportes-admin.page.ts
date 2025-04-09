import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../../shared-data.service';
import { HttpClient } from '@angular/common/http';
import {NotificationPush} from "../../services/notification-push.model";
@Component({
  selector: 'app-reportes-admin',
  templateUrl: './reportes-admin.page.html',
  styleUrls: ['./reportes-admin.page.scss'],
})
export class ReportesAdminPage implements OnInit {
  reporte: any;
  Respuesta: string  = '';
  fecha : string = '';
  notificationUrl: string = "https://sendnotification-pxty2w666q-uc.a.run.app/";
  private apiUrl = "https://phmsoft.tech/SpaceentApp/API's/USUARIOS_SUPER_API_REST.php"
  reportFinishedMessage: NotificationPush = {
    title: "",
    body: "",
    token: ""
  }
  constructor(
    public sharedDataServices: SharedDataService,
    public http : HttpClient
    ) { }

  ngOnInit() {
    this.reporte = this.sharedDataServices.Item;
    if (!this.reporte) {
      console.error('No hay reporte seleccionado');
    }
    const precioEqui = this.reporte.Total / 30 ;
    const saldoEqui = precioEqui * this.reporte.Dias_Restantes;
    //console.log(precioEqui);
    //console.log(saldoEqui);
    //console.log("precio total " + this.reporte.Total);
    //console.log("precio dias restantes " + this.reporte.Dias_Restantes)
  }

  Accept(){
    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
    const dia = ('0' + fecha.getDate()).slice(-2);
    const hora = ('0' + fecha.getHours()).slice(-2);
    const minuto = ('0' + fecha.getMinutes()).slice(-2);
    this.fecha = anio+'-'+mes+'-'+dia + " " + hora + ":" + minuto;
    if(this.reporte.Respuesta){
      const url = "https://phmsoft.tech/SpaceentApp/API's/REPORTS_API_REST.php"
      const params = {
        comando : "Update2",
        Id : this.reporte.Id,
        Id_Admin : this.sharedDataServices.userData.Id,
        Admin : this.sharedDataServices.userData.Usuario,
        Id_Cuenta: this.reporte.Id_Cuenta,
        Id_Ticket: this.reporte.Id_Ticket,
        Respuesta : this.reporte.Respuesta,
        Fecha_Cierre : this.fecha,
        Correo : this.reporte.Correo,
        Contrasena : this.reporte.Contrasena,
        PIN : this.reporte.PIN,
        Perfiles: this.reporte.Perfiles,
        Fecha_Expiracion : this.reporte.Fecha_Expiracion,
        Opcion : "accept",
        admin : this.sharedDataServices.userData.admin
      }
      this.http.get<any>(url,{params}).subscribe(
        (response) => {
          if(response){
            if(response.message ="Reporte actualizado correctamente y datos de ticket actualizados"){
              this.reportFinishedMessage.body= `${this.reporte.Usuario}, tu reporte de ${this.reporte.Servicio} ha sido contestado.`;
              this.notifyUser(this.reporte.Id_Usuario, this.reportFinishedMessage)
              this.sharedDataServices.alert("Reportes Admin","Contestar Reporte","Reporte respondido correctamente");
              this.sharedDataServices.navegar("/admin-reportes")
            }else{
              this.sharedDataServices.alert("Admin","Recargas",response.message)
            }
          }
        },
        (error)=>{
            console.log(error);
        }
      )
    }else{
      this.sharedDataServices.alert("Reportes Admin","Contestar Reporte","Porfavor llenar los datos necesarios")
    }
  }
  Reject(){
    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
    const dia = ('0' + fecha.getDate()).slice(-2);
    const hora = ('0' + fecha.getHours()).slice(-2);
    const minuto = ('0' + fecha.getMinutes()).slice(-2);
    this.fecha = anio+'-'+mes+'-'+dia + " " + hora + ":" + minuto;
    if(this.reporte.Respuesta){
      const url = "https://phmsoft.tech/SpaceentApp/API's/REPORTS_API_REST.php"
      const params = {
        comando : "Update",
        Id : this.reporte.Id,
        Id_Admin : this.sharedDataServices.userData.Id,
        Admin : this.sharedDataServices.userData.Usuario,
        Respuesta : this.reporte.Respuesta,
        Fecha_Cierre : this.fecha,
        Opcion : "decline",
        admin : this.sharedDataServices.userData.admin
      }
      this.http.get<any>(url,{params}).subscribe(
        (response) => {
          if(response){
            if(response.message ="Reporte actualizado correctamente"){
              this.reportFinishedMessage.body= `${this.reporte.Usuario}, tu reporte de ${this.reporte.Servicio} ha sido contestado.`;
              this.notifyUser(this.reporte.Id_Usuario, this.reportFinishedMessage)
              this.sharedDataServices.alert("Reportes Admin","Contestar Reporte","Reporte respondido correctamente");
              this.sharedDataServices.navegar("/admin-reportes")
            }else{
              this.sharedDataServices.alert("Admin","Recargas",response.message)
            }
          }
        },
        (error)=>{
            console.log(error);
        }
      )
    }else{
      this.sharedDataServices.alert("Reportes Admin","Contestar Reporte","Porfavor llenar los datos necesarios")
    }
  }

  async showReembolsoConfirmation() {
    // Primero obtener los días vigentes
    const urlGetDiasVigente = "https://phmsoft.tech/SpaceentApp/API's/REPORTS_API_REST.php";
    const paramsGetDias = {
      comando: 'GetDiasVigenteCuenta',
      Id_Cuenta: this.reporte.Id_Cuenta
    };
  
    try {
      const responseDias: any = await this.http.get<any>(urlGetDiasVigente, { params: paramsGetDias }).toPromise();
      const diasVigenteCuenta = responseDias.Dias_vigente;
      
      // Calcular el reembolso usando diasVigenteCuenta
      const precioEqui = this.reporte.Total / diasVigenteCuenta;
      const saldoEqui = precioEqui * this.reporte.Dias_Vigentes;
      
      const alert = await this.sharedDataServices.alertController.create({
        header: 'Confirmar Reembolso',
        message: `¿Estás seguro que deseas realizar el reembolso por $${saldoEqui.toFixed(2)}?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary'
          },
          {
            text: 'Confirmar',
            handler: () => {
              this.Reembolso();
            }
          }
        ]
      });
  
      await alert.present();
    } catch (error) {
      console.error('Error al obtener días vigentes:', error);
      this.sharedDataServices.alert(
        "Error",
        "Reembolso",
        "Hubo un error al calcular el reembolso"
      );
    }
  }

 async Reembolso() {

    const urlGetDiasVigente = "https://phmsoft.tech/SpaceentApp/API's/REPORTS_API_REST.php";
    const paramsGetDias = {
          comando: 'GetDiasVigenteCuenta',
          Id_Cuenta: this.reporte.Id_Cuenta };

    const responseDias: any = await this.http.get<any>(urlGetDiasVigente, { params: paramsGetDias }).toPromise();
    const diasVigenteCuenta = responseDias.Dias_vigente;

    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
    const dia = ('0' + fecha.getDate()).slice(-2);
    const hora = ('0' + fecha.getHours()).slice(-2);
    const minuto = ('0' + fecha.getMinutes()).slice(-2);
    this.fecha = anio+'-'+mes+'-'+dia + " " + hora + ":" + minuto;
    const fechaActual = new Date();

    // Formatear la fecha y hora en una cadena adecuada para DateTime
    const año = fechaActual.getFullYear();
    const mes1 = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const día = String(fechaActual.getDate()).padStart(2, '0');
    const horas = String(fechaActual.getHours()).padStart(2, '0');
    const minutos = String(fechaActual.getMinutes()).padStart(2, '0');
    const segundos = String(fechaActual.getSeconds()).padStart(2, '0');
    const fechaFormateada = `${año}-${mes1}-${día} ${horas}:${minutos}:${segundos}`;
    const fechaPura = `${año}-${mes1}-${día}`;
    console.log(fechaFormateada);
    console.log(fechaPura);
    const precioEqui = this.reporte.Total / diasVigenteCuenta;
    const saldoEqui = precioEqui * this.reporte.Dias_Vigentes;
    const url = "https://phmsoft.tech/SpaceentApp/API's/REPORTS_API_REST.php";
      const params = {
        comando: "Reembolso",
        Usuario: this.reporte.Usuario,
        saldoEqui: saldoEqui,
        Id : this.reporte.Id,
        Id_Admin : this.sharedDataServices.userData.Id,
        Admin : this.sharedDataServices.userData.Usuario,
        Respuesta : "Se realiazo reembolso equivalente a : " + saldoEqui,
        Fecha_Cierre : this.fecha,
        Correo : this.reporte.Correo,
        Contrasena : this.reporte.Contrasena,
        PIN : this.reporte.PIN,
        Perfiles: this.reporte.Perfiles,
        Id_Usuario: this.reporte.Id_Usuario,
        Id_Cuenta: this.reporte.Id_Cuenta,
        Id_Ticket: this.reporte.Id_Ticket,
        Fecha : fechaFormateada,
        Fecha_Expiracion : fechaPura

      };
      console.log ("saldo agregado" + saldoEqui);
      console.log(this.sharedDataServices.userData.admin);
      this.http.get<any>(url, { params }).subscribe(
        (response) => {
          console.log (response && response.message);
          if (response && response.message === "Reporte y saldo actualizados correctamente") {
            this.reportFinishedMessage.body= `${this.reporte.Usuario}, tu reporte de ${this.reporte.Servicio} ha sido contestado.`;
            this.notifyUser(this.reporte.Id_Usuario, this.reportFinishedMessage)
            this.sharedDataServices.alert("Reportes Admin", "Contestar Reporte", "Reporte respondido correctamente");
            this.sharedDataServices.navegar("/admin-reportes");
          } else {
            this.sharedDataServices.alert("Admin","Reportes",response.message)
          }
        },
        (error) => {
          console.log(error);
          this.sharedDataServices.alert("Admin", "Recargas", "Error al actualizar el reporte");
        }
      );
  }


  getUser(userId: number): Promise<any> {
    const params = {
      action: "show",
      userId: userId
    }
    return this.http.get<any>(this.apiUrl, { params }).toPromise()
  }

  sendNotificationPushByToken(token: string, message: NotificationPush){
    message.token = token;
    this.http.post<any>(this.notificationUrl, message).subscribe(
      (response) => {
        if (response) {

        } else {
          console.error('Respuesta inválida del servidor:', response);
        }
      },
      (error) => {
        console.error('Error en la llamada HTTP:', error);
      }
    );
  }

  async notifyUser(userId: number, message: any){
    const response = await this.getUser(userId);
    const user = response.data;
    if(!user){
      return false;
    }
    this.sendNotificationPushByToken(user.Token_Notificaciones, message);
    return true;
  }

  }


