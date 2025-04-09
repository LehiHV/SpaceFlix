import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular'; // Asegúrate de importar AlertController
import { SharedDataService } from 'src/app/shared-data.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-sub-admin',
  templateUrl: './sub-admin.page.html',
  styleUrls: ['./sub-admin.page.scss'],
})
export class SubAdminPage implements OnInit {
  constructor(
    public alertController: AlertController,
    public sharedDataServices: SharedDataService,
    public http: HttpClient
  ) {} // Inyecta el AlertController aquí
  showDetails: { [key: string]: boolean } = {};
  editingClient: { [key: string]: boolean } = {};
  SubAdmins: any[] = [];
  searchText: string = '';
  toggleValue: any;
  ngOnInit() {
    // Este método se ejecutará cada vez que la página entre en la vista
    this.sharedDataServices.ShowSubAdmins();
    this.SubAdmins = this.sharedDataServices.SubAdminList;
  }
  ionViewDidEnter() {
    
  }
  toggleDetails(subadminItem: any) {
    this.showDetails[subadminItem.Id] = !this.showDetails[subadminItem.Id];
  }

  edit(subadminItem: any) {
    this.editingClient[subadminItem.Id] = true;
    
  }
  cancel(subadminItem: any) {
    this.editingClient[subadminItem.Id] = false;
  }
  save(subadminItem: any) {
    
    const url = "https://phmsoft.tech/SpaceentApp/API's/ADMIN_REST_API.php";
    const params = {
      comando: 'Update Sub Admin',
      Id: subadminItem.Id,
      Usuario: subadminItem.Usuario,
      Correo: subadminItem.Correo,
      Contrasena: subadminItem.Contrasena,
      Nombre: subadminItem.Nombre,
      Telefono: subadminItem.Telefono,
      Recargas : subadminItem.Recargas,
      Usuarios : subadminItem.Usuarios,
      Servicios : subadminItem.Servicios,
      Otros : subadminItem.Otros,
      Ventas : subadminItem.Ventas,
      Reportes : subadminItem.Reportes,
      Cuentas : subadminItem.Cuentas,
      Ticket: subadminItem.Ticket,
    };
    //console.log(subadminItem.Recargas)
    this.http.get<any>(url, { params }).subscribe(
      (response) => {
        if (response) {
          if (response.message === 'Sub Admin actualizado correctamente') {
            this.sharedDataServices.alert('Admin', 'Sub Admins', response.message);
            this.sharedDataServices.ShowSubAdmins();
            this.editingClient[subadminItem.Id] = false;
          } else {
            this.sharedDataServices.alert('Admin', 'Sub Admins', response.error);
          }
        } else {
          this.sharedDataServices.alert('Admin', 'Sub Admins', response.error);
        }
      },
      (error) => {
        console.error('Error en la llamada HTTP:', error);
        //this.sharedDataService.alert('Error al Actualizar Cliente', 'Porfavor contactar con el servicio tecnico' ,'Ocurrió un error al intentar eliminar al cliente.');
      }
    );
  }
  delete(subadminItem: any) {
    const url = "https://phmsoft.tech/SpaceentApp/API's/ADMIN_REST_API.php";
    const params = {
      comando: 'Delete Sub Admin',
      Id: subadminItem.Id,
    };

    this.http.get<any>(url, { params }).subscribe(
      (response) => {
        if (response) {
          if (response.message === 'Sub Admin Eliminado correctamente') {
            const index = this.SubAdmins.findIndex(
              (c) => c.Id === subadminItem.Id
            );
            if (index !== -1) {
              this.SubAdmins.splice(index, 1);
              this.sharedDataServices.alert(
                'Admin',
                'Sub Admins',
                response.message
              );
            } else {
              this.sharedDataServices.alert(
                'Admin',
                'Sub Admins',
                response.message
              );
            }
          }
        }
      },
      (error) => {
        console.error('Error en la llamada HTTP:', error);
        //this.sharedDataService.alert('Error al Eliminar al Cliente', 'Porfavor contactar con el servicio tecnico' ,'Ocurrió un error al intentar eliminar al cliente.');
      }
    );
  }
  async delete_alert(subadminItem: any) {
    const alert = await this.alertController.create({
      header: 'Eliminar Sub Admin',
      message: '¿Está seguro de eliminar este Sub Admin?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Sí',
          handler: () => {
            this.delete(subadminItem);
          },
        },
      ],
    });

    await alert.present();
  }
  async confirmDeshabilitar(subadminItem: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar deshabilitación',
      message: '¿Está seguro de deshabilitar este Sub Admin?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // Si el usuario cancela, restablecemos el estado del toggle
            this.toggleValue = false;
            this.Deshabilitar(subadminItem);
          }
        },
        {
          text: 'Sí',
          handler: () => {
            // Si el usuario confirma, ejecutamos la función para deshabilitar
            this.toggleValue = true;
            this.Deshabilitar(subadminItem);
          }
        }
      ]
    });
  
    await alert.present();
  }
  Deshabilitar(subadminItem:any){
    const url = "https://phmsoft.tech/SpaceentApp/API's/ADMIN_REST_API.php";
    const params = {
      comando: 'Disabled',
      Id: subadminItem.Id,
      cambio : subadminItem.Desabilitada
    };
    console.log(subadminItem.Desabilitada)
    this.http.get<any>(url, { params }).subscribe(
      (response) => {
        if (response) {
          if (response.message === 'Sub Admin actualizado correctamente') {
            this.sharedDataServices.alert('Admin', 'Sub Admins', response.message);
            this.sharedDataServices.ShowSubAdmins();
            this.editingClient[subadminItem.Id] = false;
          } else {
            this.sharedDataServices.alert('Admin', 'Sub Admins', response.error);
          }
        } else {
          this.sharedDataServices.alert('Admin', 'Sub Admins', response.error);
        }
      },
      (error) => {
        console.error('Error en la llamada HTTP:', error);
        //this.sharedDataService.alert('Error al Actualizar Cliente', 'Porfavor contactar con el servicio tecnico' ,'Ocurrió un error al intentar eliminar al cliente.');
      }
    );
  }
  irMovimientos(subadminItem:any){
    this.sharedDataServices.navegarConDatos("/sub-admin-movimientos",subadminItem)
  }
}
