import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/app/shared-data.service';
import {Category} from "./editar-servicio.model";

@Component({
  selector: 'app-editar-servicio',
  templateUrl: './editar-servicio.page.html',
  styleUrls: ['./editar-servicio.page.scss'],
})
export class EditarServicioPage implements OnInit {

    API_URL: string = "https://phmsoft.tech/SpaceentApp/API's/CATEGORIA_SERVICIO_SUPER_API_REST.php";
    categories: Category[] = [];
    originalServiceCateogry: number | null = null;
    originalServiceOrder: number | null = null;
    isPriceService: boolean = false; 

    constructor(
      public sharedDataServices : SharedDataService,
      public http : HttpClient
    ) { }
    Servicio :any;
    previs : any;
    Foto: any;
    ngOnInit() {
      this.Servicio = this.sharedDataServices.Item; // Accedes al reporte seleccionado
      this.originalServiceCateogry = this.Servicio.Categoria_Servicio_Id;
      this.originalServiceOrder = this.Servicio.Categoria_Orden;
        // Asegurar que EsPremio sea un número
        if (typeof this.Servicio.EsPremio === 'string') {
          this.Servicio.EsPremio = parseInt(this.Servicio.EsPremio, 10);
        }
      
        this.isPriceService = this.Servicio.EsPremio === 1;
        
        console.log('Estado inicial del toggle (isPriceService):', this.isPriceService);
      if (!this.Servicio) {
        // Manejar el caso de que no haya datos, posiblemente redirigiendo de vuelta
        console.error('No hay reporte seleccionado');
      }

      this.getCategories()

       // Forzar la actualización del toggle después de que el componente se haya inicializado completamente
       setTimeout(() => {
        this.isPriceService = this.Servicio.EsPremio === 1;
        this.onToggleChange();
      }, 100);
    }

    onToggleChange() {
      this.Servicio.EsPremio = this.isPriceService ? 1 : 0;
    }

    onFileSelected(event: any) {
      if (event.target.files && event.target.files[0]) {
        this.Foto = event.target.files[0];

        // Crea una URL temporal para el archivo seleccionado
        this.previs = URL.createObjectURL(this.Foto);
      }
    }

    Cambiar() {
      const url = "https://phmsoft.tech/SpaceentApp/API's/PRODUCTS3_API_REST.php";
      //const url = "http://localhost:8080/SERVICIO_PRODUCTO_SUPER_API_REST_UPDATE.php?pass=POPO"
      const formData: FormData = new FormData();
      formData.append('Id', this.Servicio.Id);
      formData.append('Nombre', this.Servicio.Nombre);
      formData.append('Descripcion', this.Servicio.Descripcion);
      formData.append('Terminos', this.Servicio.Terminos);
      formData.append('Costo', this.Servicio.Costo);
      formData.append('Precio', this.Servicio.Precio);
      formData.append('Precio_VIP', this.Servicio.Precio_VIP);
      formData.append('Tipo', this.Servicio.Tipo);
      formData.append('Tipo_de_Cuenta', this.Servicio.Tipo_de_Cuenta);
      formData.append('Id_Admin',this.sharedDataServices.userData.Id);
      formData.append('admin',this.sharedDataServices.userData.Admin);
      formData.append('Categoria_Servicio_Id', this.Servicio.Categoria_Servicio_Id);
      formData.append('EsPremio', this.Servicio.EsPremio);
      

      if(this.originalServiceOrder !== this.Servicio.Categoria_Orden){
        formData.append('Categoria_Orden', this.Servicio.Categoria_Orden);
      }
      if(this.Foto != null){
        formData.append('Foto', this.Foto);
      }else {
        formData.append('Foto', this.Servicio.Foto);
      }
      console.log(formData);
      this.http.post<any>(url, formData).subscribe(
        (response) => {
          if (response.message === 'Servicio actualizado correctamente') {
            this.sharedDataServices.alert("Actualizacion Servicio", "Actualizacion Exitosa", response.message);
            this.sharedDataServices.navegar("/admin-servicios")
          } else {
            this.sharedDataServices.alert("Actualizacion Servicio", "Error al Actualizar", response.message);
          }
        },
        (error) => {
          console.error('Error en la llamada HTTP:', error);
          this.sharedDataServices.alert('Registro', "Datos Erroneos", error);
        }
      );
    }

    getCategories(){
      let params: any = {
        action: 'index'
      };

      this.http.get<any>(this.API_URL, { params }).subscribe(
        (response) => {
          if (response) {
            this.categories = response.data;
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
