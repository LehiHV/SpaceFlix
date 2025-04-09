import { Component, OnInit } from '@angular/core';
import {Category} from "../editar-servicio/editar-servicio.model";
import {HttpClient} from "@angular/common/http";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-categoria-servicio',
  templateUrl: './categoria-servicio.page.html',
  styleUrls: ['./categoria-servicio.page.scss'],
})
export class CategoriaServicioPage implements OnInit {

  API_URL: string = "https://phmsoft.tech/SpaceentApp/API's/CATEGORIA_SERVICIO_SUPER_API_REST.php";
  categories: Category[] = [];
  categoryName: string = "";
  constructor(
    public http : HttpClient,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.getCategories();
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

  createCategory(){
    if(this.categoryName === "") return;
    let params = {action: "create"}
    this.http.post<any>(this.API_URL, {"Nombre": this.categoryName }, {params}).subscribe(
      (response) => {
        if (response) {
          this.categories.push(response.data);
        } else {
          console.error('Respuesta inválida del servidor:', response);
        }
      },
      (error) => {
        console.error('Error en la llamada HTTP:', error);
      }
    );
  }

  async updateCategory(categoryId: any) {
    await this.showUpdateCategoryPrompt(categoryId);
  }

  deleteCategory(categoryId: number){
    let params = {action: "destroy", id: categoryId}
    this.http.delete<any>(this.API_URL, {params}).subscribe(
      (response) => {
        if (response) {
          this.getCategories();
        } else {
          console.error('Respuesta inválida del servidor:', response);
        }
      },
      (error) => {
        console.error('Error en la llamada HTTP:', error);
      }
    );
  }


  async showUpdateCategoryPrompt(category: any) {
    const alert = await this.alertController.create({
      header: 'Nueva Categoría',
      inputs: [
        {
          name: 'newCategoryName',
          type: 'text',
          placeholder: category.Nombre,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Actualizar',
          handler: (data) => {
            let params = {action: "update", id: category.Id}
            this.http.put<any>(this.API_URL, {"Nombre": data.newCategoryName} ,{params}).subscribe(
              (response) => {
                if (response) {
                  this.getCategories();
                } else {
                  console.error('Respuesta inválida del servidor:', response);
                }
              },
              (error) => {
                console.error('Error en la llamada HTTP:', error);
              }
            );
          },
        },
      ],
    });

    await alert.present();
  }

}
