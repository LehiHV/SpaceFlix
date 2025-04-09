import { Component } from '@angular/core';
import { SharedDataService } from 'src/app/shared-data.service';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-admin-servicios',
  templateUrl: './admin-servicios.page.html',
  styleUrls: ['./admin-servicios.page.scss'],
})
export class AdminServiciosPage {
  public filtroServicio: string = '';

  constructor(
    public sharedDataServices: SharedDataService,
    public http: HttpClient,
    public alertController: AlertController
  ) { }

  ionViewWillEnter() {
    this.sharedDataServices.ShowProducts();
  }

  irNuevoServicio() {
    // Redirige a la página Home
    this.sharedDataServices.navegar("/servicios-admin");
  }
  irNuevaCategoria() {
    // Redirige a la página Home
    this.sharedDataServices.navegar("/categoria-servicio");
  }

  irEditarServicio(servicio: any) {
    this.sharedDataServices.navegarConDatos("/editar-servicio", servicio);
  }

  async eliminarServicio(servicio: any) {
    const alert = await this.alertController.create({
      header: 'Eliminar Servicio',
      message: '¿Estás seguro de que deseas eliminar este servicio?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            // Realizar la llamada HTTP para eliminar el servicio
            const url = "https://phmsoft.tech/SpaceentApp/API's/PRODUCTS_API_REST.php";
            const params = {
              comando: 'Delete',
              Id: servicio.Id,
              Id_Admin : this.sharedDataServices.userData.Id,
              admin : this.sharedDataServices.userData.admin
            };

            this.http.get<any>(url, { params }).subscribe(
              (response) => {
                // Verificar la respuesta del servidor
                if (response) {
                  if (response.message === "Producto Eliminado correctamente") {
                    // Eliminar el servicio del arreglo
                    const index = this.sharedDataServices.ProductList.findIndex((item: any) => item.Id === servicio.Id);
                    if (index !== -1) {
                      this.sharedDataServices.ProductList.splice(index, 1);
                    }
                  } else {
                    this.sharedDataServices.alert("Servicios - Admin", "Servicios", "No se pudo eliminar el Servicio");
                  }
                }
              }
            );
          }
        }
      ]
    });

    await alert.present();
  }

}
