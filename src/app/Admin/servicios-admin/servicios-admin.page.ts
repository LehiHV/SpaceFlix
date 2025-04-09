import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/app/shared-data.service';
import { HttpClient } from '@angular/common/http';
import {Category} from "../editar-servicio/editar-servicio.model";

@Component({
  selector: 'app-servicios-admin',
  templateUrl: './servicios-admin.page.html',
  styleUrls: ['./servicios-admin.page.scss'],
})
export class ServiciosAdminPage implements OnInit {

  constructor(
    public sharedDataServices: SharedDataService,
    public http: HttpClient,
  ) { }

  public Nombre: string = '';
  public Descripcion: string = '';
  public Terminos: string = '';
  public EsPremio: string = "";
  public Costo: number = 0;
  public Precio: number = 0;
  public Precio_VIP : number = 0;
  public Foto: any; // Puede ser una cadena URL o cualquier tipo de dato que represente la imagen.
  public previs : any;
  API_URL: string = "https://phmsoft.tech/SpaceentApp/API's/CATEGORIA_SERVICIO_SUPER_API_REST.php";
  categories: Category[] = [];
  public categoryId: number = 0;
  ngOnInit() {
    this.getCategories()
  }
  onFileSelected(event: any) {
    this.Foto = event.target.files[0];
    this.previs = URL.createObjectURL(this.Foto);
  }
  Agregar() {
    if (this.Nombre && this.Descripcion && this.Costo && this.Precio) {


      const url = "https://phmsoft.tech/SpaceentApp/API's/PRODUCTS2_API_REST.php";
      const formData = new FormData();
      formData.append('Nombre', this.Nombre);
      formData.append('Descripcion', this.Descripcion);
      formData.append('Terminos', this.Terminos);
      formData.append('Costo', this.Costo.toString());
      formData.append('Precio', this.Precio.toString());
      formData.append('Precio_VIP', this.Precio_VIP.toString());
      formData.append('Foto', this.Foto);
      formData.append('Id_Admin',this.sharedDataServices.userData.Id);
      formData.append('admin',this.sharedDataServices.userData.admin);
      if(this.categoryId !== 0){
        formData.append('Categoria_Servicio_Id', this.categoryId.toString());
      }
      this.http.post<any>(url, formData).subscribe(
        (response) => {
          if (response.message === 'Servicio agregado correctamente') {
            this.sharedDataServices.alert("Registro Servicio", "Registro Exitoso", response.message);
          } else {
            console.log(response)
            this.sharedDataServices.alert("Registro Servicio", "Error al Registrar", response.message);
          }
        },
        (error) => {
          console.error('Error en la llamada HTTP:', error);
          this.sharedDataServices.alert('Registro', "Datos Erroneos", error);
        }
      );
    } else {
      this.sharedDataServices.alert('Registro Servicio', "Por favor de completar los datos", 'Por favor, complete todos los campos.');
    }
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
