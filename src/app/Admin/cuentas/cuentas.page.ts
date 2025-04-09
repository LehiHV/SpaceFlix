import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/app/shared-data.service';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.page.html',
  styleUrls: ['./cuentas.page.scss'],
})
export class CuentasPage implements OnInit {
  showDetails: { [key: string]: boolean } = {};
  editingAccount: { [key: string]: boolean } = {};
  Cuentas: any[] = [];
  searchText: string = '';
  Valido: number = 0;
  paginas: number[] = [];
  filterValidAccounts: boolean = false;
  filterInvalidAccounts: boolean = false;
  filteredCuentas: any[] = [];
  searchExecuted: boolean = false;
  selectedOption: number =0;
  constructor(
    public sharedDataService: SharedDataService,
    public http: HttpClient,
    public alertController: AlertController
  ) {}

  ngOnInit() {}
  navigateToPage(pageNumber: number) {
    if (this.searchExecuted) {
      const url = "https://phmsoft.tech/SpaceentApp/API's/ACCOUNT_API_REST.php";
      const params = {
        comando: 'search',
        Page: pageNumber.toString(),
        Objeto: this.searchText,
        Option : this.selectedOption // Convertir el número de página a cadena
        
      };

      this.http.get<any>(url, { params }).subscribe(
        (response) => {
          if (response && response.cuentas) {
            // Actualizar la lista de clientes con los nuevos datos recibidos
            this.Cuentas = response.cuentas;
          } else {
            console.error('Respuesta inválida del servidor:', response);
          }
        },
        (error) => {
          console.error('Error en la llamada HTTP:', error);
        }
      );
    } else {
      const url = "https://phmsoft.tech/SpaceentApp/API's/ACCOUNT_API_REST.php";
      const params = {
        comando: 'ViewOnlyAccounts',
        Page: pageNumber.toString(),
        Option: this.selectedOption // Convertir el número de página a cadena
      };

      this.http.get<any>(url, { params }).subscribe(
        (response) => {
          if (response && response.cuentas) {
            // Actualizar la lista de clientes con los nuevos datos recibidos
            this.Cuentas = response.cuentas;
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
  applyFilter() {
    this.filteredCuentas = this.sharedDataService.filterEmailAccount(
      this.Cuentas,
      this.searchText,
      this.filterValidAccounts,
      this.filterInvalidAccounts
    );
  }
  ionViewDidEnter() {
    // Este método se ejecutará cada vez que la página entre en la vista
    this.sharedDataService.ShowAccounts();
    this.Cuentas = this.sharedDataService.AccountList;
    for (let i = 1; i <= this.sharedDataService.Pages; i++) {
      this.paginas.push(i);
    }
  }
  toggleDetails(cuenta: any) {
    this.showDetails[cuenta.Id] = !this.showDetails[cuenta.Id];
  }

  edit(cuenta: any) {
    this.editingAccount[cuenta.Id] = true;
  }
  

  save(cuenta: any) {
    if (cuenta.Valido) {
      this.Valido = 1;
    } else {
      this.Valido = 0;
    }
    const url = "https://phmsoft.tech/SpaceentApp/API's/ACCOUNT_API_REST.php";
    const params = {
      comando: 'Update',
      Id: cuenta.Id,
      Correo: cuenta.Correo,
      Contrasena: cuenta.Contrasena,
      Perfiles: cuenta.Perfiles,
      PIN: cuenta.PIN,
      Fecha_Registro: cuenta.Fecha_Registro,
      Dias_Vigente: cuenta.Dias_Vigente,
      Dias_Restantes: cuenta.Dias_Restantes,
      Fecha_Expiracion: cuenta.Fecha_Expiracion,
      Renovaciones: cuenta.Renovaciones,
      Tipo_de_Cuenta: cuenta.Tipo_de_Cuenta,
      Valido: this.Valido,
      Id_Admin : this.sharedDataService.userData.Id,
      admin : this.sharedDataService.userData.admin
    };
    this.http.get<any>(url, { params }).subscribe(
      (response) => {
        console.table(this.sharedDataService.userData);
        if (response) {
          if (response.message === 'Cuenta actualizada correctamente') {
            this.sharedDataService.alert('Admin', 'Cuentas', response.message);
            this.sharedDataService.ShowAccounts();
            this.editingAccount[cuenta.Id] = false;
          } else {
            this.sharedDataService.alert('Admin', 'Cuentas', response.error);
          }
        } else {
          this.sharedDataService.alert('Admin', 'Cuentas', response.error);
        }
      },
      (error) => {
        console.error('Error en la llamada HTTP:', error);
        //this.sharedDataService.alert('Error al Actualizar Cliente', 'Porfavor contactar con el servicio tecnico' ,'Ocurrió un error al intentar eliminar al cliente.');
      }
    );
  }

  delete(cuenta: any) {
    const url = "https://phmsoft.tech/SpaceentApp/API's/ACCOUNT_API_REST.php";
    const params = {
      comando: 'Delete',
      Id: cuenta.Id,
      Id_Admin : this.sharedDataService.userData.Id,
        admin : this.sharedDataService.userData.admin
    };

    this.http.get<any>(url, { params }).subscribe(
      (response) => {
        if (response) {
          if (response.message === 'Cuenta Eliminada correctamente') {
            const index = this.Cuentas.findIndex((c) => c.Id === cuenta.Id);
            if (index !== -1) {
              this.Cuentas.splice(index, 1);
              this.sharedDataService.alert(
                'Admin',
                'Cuentas',
                response.message
              );
            } else {
              this.sharedDataService.alert(
                'Admin',
                'Cuentas',
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
  async delete_alert(cliente: any) {
    const alert = await this.alertController.create({
      header: 'Eliminar Producto',
      message: '¿Está seguro de eliminar este Producto?',
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
  cancel(cuenta: any) {
    this.editingAccount[cuenta.Id] = false;
  }

  NoValid(id: number) {
    const url = "https://phmsoft.tech/SpaceentApp/API's/ACCOUNT_API_REST.php";
    const params = {
      comando: 'NoValid',
      Id: id
    };

    this.http.get<any>(url, { params }).subscribe(
      (response) => {
        if (response) {
          if (response.message === 'Cuenta editada correctamente') {
            const index = this.Cuentas.findIndex((c) => c.Id === id);
            if (index !== -1) {
              this.Cuentas.splice(index, 1);
              this.sharedDataService.alert(
                'Admin',
                'Cuentas',
                response.message
              );
            } else {
              this.sharedDataService.alert(
                'Admin',
                'Cuentas',
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

  async NoValid_Alert(id: number) {
    const alert = await this.alertController.create({
      header: 'Cambiar el Estatus',
      message: '¿Está seguro de cambiar este producto a No Renovado?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Sí',
          handler: () => {
            this.NoValid(id);
          },
        },
      ],
    });

    await alert.present();
  }

  searchdeep() {
    if (this.searchText != '') {
      // Aquí se realizará la llamada a la API para buscar usuarios específicos
      this.paginas.splice(0, this.paginas.length);
      this.Cuentas.splice(0, this.Cuentas.length);

      const params = {
        comando: 'search',
        Objeto: this.searchText,
        Option : this.selectedOption
      };
      const url = "https://phmsoft.tech/SpaceentApp/API's/ACCOUNT_API_REST.php";
      this.http.get<any>(url, { params }).subscribe((response) => {
        this.Cuentas = response.cuentas;
        for (let i = 1; i <= response.pages; i++) {
          this.paginas.push(i);
        }
        this.searchExecuted = true; // Marcar que la búsqueda se ha ejecutado
      });
    } else {
    }
  }
  onSearchBarClear() {
    this.sharedDataService.ShowAccounts();
    this.Cuentas = this.sharedDataService.AccountList;
    this.paginas = []; // Limpiar el arreglo de páginas
    this.selectedOption = 0
    for (let i = 1; i <= this.sharedDataService.Pages; i++) {
      this.paginas.push(i);
    }
  }
  showSelectedOption() {
    // Aquí se realizará la llamada a la API para buscar usuarios específicos
    this.paginas.splice(0, this.paginas.length);
    this.Cuentas.splice(0, this.Cuentas.length);

    const params = {
      comando: 'ViewOnlyAccounts',
      Objeto: this.searchText,
      Option : this.selectedOption
    };
    const url = "https://phmsoft.tech/SpaceentApp/API's/ACCOUNT_API_REST.php";
    this.http.get<any>(url, { params }).subscribe((response) => {
      this.Cuentas = response.cuentas;
      for (let i = 1; i <= response.pages; i++) {
        this.paginas.push(i);
      }
    });
  }
  limpiarFiltro(){
    if(this.selectedOption !=0){
      this.onSearchBarClear()
      this.selectedOption=0;
      this.sharedDataService.ShowAccounts();
      this.Cuentas = this.sharedDataService.AccountList;
      this.searchText ="";
      for (let i = 1; i <= this.sharedDataService.Pages; i++) {
        this.paginas.push(i);
      }
    }else{
      this.sharedDataService.alert("Admin","Cuentas","No hay filtros que eliminar")
    }
  }
}
