import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/app/shared-data.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.page.html',
  styleUrls: ['./admin-usuarios.page.scss'],
})
export class AdminUsuariosPage implements OnInit {
  showDetails: { [key: string]: boolean } = {};
  editingClient: { [key: string]: boolean } = {};
  Clientes: any[] = [];
  searchText: string = '';
  VIP: number = 0;
  paginas: number[] = [];
  searchExecuted: boolean = false;

  constructor(
    public sharedDataService: SharedDataService,
    public http: HttpClient,
    public alertController: AlertController,
    public loadingController: LoadingController
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    const loading = await this.loadingController.create({
      message: 'Cargando clientes...',
    });
    await loading.present();

    this.loadClients().subscribe(
      () => {
        loading.dismiss();
      },
      (error) => {
        console.error('Error loading clients:', error);
        loading.dismiss();
      }
    );
  }

  loadClients(): Observable<any> {
    return this.sharedDataService.ShowClients().pipe(
      tap(() => {
        this.Clientes = this.sharedDataService.ClientList;
        this.paginas = Array.from({ length: this.sharedDataService.Pages }, (_, i) => i + 1);
      })
    );
  }

  navigateToPage(pageNumber: number) {
    if (this.searchExecuted) {
      const url = "https://phmsoft.tech/SpaceentApp/API's/USERS_API_REST.php";
      const params = {
        comando: 'search',
        Page: pageNumber.toString(),
        Objeto: this.searchText
      };

      this.http.get<any>(url, { params }).subscribe(
        (response) => {
          if (response && response.usuarios) {
            this.Clientes = response.usuarios;
          } else {
            console.error('Respuesta inválida del servidor:', response);
          }
        },
        (error) => {
          console.error('Error en la llamada HTTP:', error);
        }
      );
    } else {
      const url = "https://phmsoft.tech/SpaceentApp/API's/USERS_API_REST.php";
      const params = {
        comando: 'View',
        Page: pageNumber.toString(),
      };

      this.http.get<any>(url, { params }).subscribe(
        (response) => {
          if (response && response.usuarios) {
            this.Clientes = response.usuarios;
          } else {
            console.error('Respuesta inválida del servidor:', response);
          }
        },
        (error) => {
          console.error('Error en la llamada HTTP:', error);
        }
      );
    }
  }

  toggleDetails(cliente: any) {
    this.showDetails[cliente.Id] = !this.showDetails[cliente.Id];
  }

  edit(cliente: any) {
    this.editingClient[cliente.Id] = true;
    console.log(cliente.VIP);
  }

  save(cliente: any) {
    if (cliente.Sub_Admin) {
      this.sub_alert(cliente);
    } else {
      if (cliente.VIP) {
        this.VIP = 1;
      } else {
        this.VIP = 0;
      }
      const url = "https://phmsoft.tech/SpaceentApp/API's/USERS_API_REST.php";
      const params = {
        comando: 'Update',
        Id: cliente.Id,
        Usuario: cliente.Usuario,
        Correo: cliente.Correo,
        Contrasena: cliente.Contrasena,
        Nombre_Cliente: cliente.Nombre_Cliente,
        Telefono: cliente.Telefono,
        Total_Compras: cliente.Total_Compras,
        Creditos: cliente.Creditos,
        VIP: this.VIP,
        Id_Admin: this.sharedDataService.userData.Id,
        admin: this.sharedDataService.userData.admin
      };
      this.http.get<any>(url, { params }).subscribe(
        (response) => {
          if (response) {
            if (response.message === 'Usuario actualizado correctamente') {
              this.sharedDataService.alert(
                'Admin',
                'Clientes',
                response.message
              );
              this.sharedDataService.ShowClients();
              this.editingClient[cliente.Id] = false;
            } else {
              this.sharedDataService.alert('Admin', 'Clientes', response.error);
            }
          } else {
            this.sharedDataService.alert('Admin', 'Clientes', response.error);
          }
        },
        (error) => {
          console.error('Error en la llamada HTTP:', error);
        }
      );
    }
  }

  delete(cliente: any) {
    const url = "https://phmsoft.tech/SpaceentApp/API's/USERS_API_REST.php";
    const params = {
      comando: 'Delete',
      Id: cliente.Id,
      Id_Admin: this.sharedDataService.userData.Id,
      admin: this.sharedDataService.userData.admin
    };

    this.http.get<any>(url, { params }).subscribe(
      (response) => {
        if (response) {
          if (response.message === 'Usuario Eliminado correctamente') {
            const index = this.Clientes.findIndex((c) => c.Id === cliente.Id);
            if (index !== -1) {
              this.Clientes.splice(index, 1);
              this.sharedDataService.alert(
                'Admin',
                'Clientes',
                response.message
              );
            } else {
              this.sharedDataService.alert(
                'Admin',
                'Clientes',
                response.message
              );
            }
          }
        }
      },
      (error) => {
        console.error('Error en la llamada HTTP:', error);
      }
    );
  }

  async delete_alert(cliente: any) {
    const alert = await this.alertController.create({
      header: 'Eliminar Usuario',
      message: '¿Está seguro de eliminar este Usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Sí',
          handler: () => {
            this.delete(cliente);
          },
        },
      ],
    });

    await alert.present();
  }

  async sub_alert(cliente: any) {
    const alert = await this.alertController.create({
      header: 'Convertir en Sub Administrador',
      message:
        '¿Está seguro de Convertir en Sub Administrador a este Usuario?\n Esto lo borrara de usuarios regulares',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Sí',
          handler: () => {
            this.convertir_sub(cliente);
          },
        },
      ],
    });

    await alert.present();
  }

  convertir_sub(cliente: any) {
    const url = "https://phmsoft.tech/SpaceentApp/API's/USERS_API_REST.php";
    const params = {
      comando: 'Add Sub Admin',
      Id: cliente.Id,
      Usuario: cliente.Usuario,
      Correo: cliente.Correo,
      Contrasena: cliente.Contrasena,
      Nombre_Cliente: cliente.Nombre_Cliente,
      Telefono: cliente.Telefono,
    };

    this.http.get<any>(url, { params }).subscribe(
      (response) => {
        if (response) {
          if (
            response.message === 'Usuario agregado correctamente a Sub Admins'
          ) {
            const index = this.Clientes.findIndex((c) => c.Id === cliente.Id);
            if (index !== -1) {
              this.Clientes.splice(index, 1);
              this.sharedDataService.alert(
                'Admin',
                'Clientes',
                response.message
              );
            } else {
              this.sharedDataService.alert(
                'Admin',
                'Clientes',
                response.message
              );
            }
          } else {
            this.sharedDataService.alert('Admin', 'Clientes', response.error);
            this.sharedDataService.ShowClients();
            this.editingClient[cliente.Id] = false;
          }
        }
      },
      (error) => {
        console.error('Error en la llamada HTTP:', error);
      }
    );
  }

  cancel(cliente: any) {
    this.editingClient[cliente.Id] = false;
  }

  searchdeep() {
    if (this.searchText !== '') {
      this.paginas.splice(0, this.paginas.length);
      this.Clientes.splice(0, this.Clientes.length);

      const params = {
        comando: 'search',
        Objeto: this.searchText,
      };
      const url = "https://phmsoft.tech/SpaceentApp/API's/USERS_API_REST.php";

      this.http.get<any>(url, { params }).subscribe(
        (response) => {
          this.Clientes = response.usuarios;
          for (let i = 1; i <= response.pages; i++) {
            this.paginas.push(i);
          }
          this.searchExecuted = true;
        },
        (error) => {
          console.error('Error en la llamada HTTP:', error);
        }
      );
    }
  }

  onSearchBarClear() {
    this.sharedDataService.ShowClients().subscribe(
      () => {
        this.Clientes = this.sharedDataService.ClientList;
        this.paginas = [];
        for (let i = 1; i <= this.sharedDataService.Pages; i++) {
          this.paginas.push(i);
        }
      },
      (error) => {
        console.error('Error loading clients:', error);
      }
    );
  }
}
