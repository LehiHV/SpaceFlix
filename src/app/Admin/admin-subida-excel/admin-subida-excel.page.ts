import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { SharedDataService } from 'src/app/shared-data.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-subida-excel',
  templateUrl: './admin-subida-excel.page.html',
  styleUrls: ['./admin-subida-excel.page.scss'],
})
export class AdminSubidaExcelPage implements OnInit {
  selectedFile: File | null = null;
  archivoSeleccionado: boolean = false; // Variable para rastrear si se seleccionó un archivo
  archivoDatos: any;
  Img1: any;
  Img2: any;
  Img3: any;
  Img4: any;
  Img5: any;
  Imagen1 : any;
  Imagen2 : any;
  Imagen3 : any;
  Imagen4: any;
  Imagen5: any;
  constructor(
    public sharedDataService : SharedDataService,
    private http : HttpClient
  ) {}
  
  ngOnInit() {
    this.sharedDataService.cargarCashback();
    this.sharedDataService.ShowFlyers().subscribe(
      (response) => {
        if (response && response.length > 0) {
          this.sharedDataService.FlyerList = response; // Asegúrate de que los datos estén disponibles aquí
        } else {
          this.sharedDataService.FlyerList = null;
        }
      },
      (error) => {
        console.error('Error al obtener los flyers:', error);
        this.sharedDataService.FlyerList = null;
      }
    );
    this.sharedDataService.FlyerList = [];
  }
  //si ves esto, quiere decir que me tuve que matar la cabeza/la de chatGPT tambien, para crear este codigo
  //Daniel si lees esto, aprende un poco de mi papito <3
  fileChanged(event: any): void {
    this.selectedFile = event.target.files[0];
    
    if (this.selectedFile) {
      this.archivoSeleccionado = true;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
  
        const excelData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
  
        if (excelData.length > 1 && excelData[0].every((cell: any) => cell !== null && cell !== undefined && cell !== '')) {
          const validRows = excelData.slice(1).filter((row: any[]) => row.every((cell: any) => cell !== null && cell !== undefined && cell !== ''));
          const nonEmptyRows = validRows.filter((row: any[]) => row.some((cell: any) => cell !== '' && cell !== null && cell !== undefined));
  
          if (nonEmptyRows.length > 0) {
            this.archivoDatos = nonEmptyRows;
          } else {
            this.sharedDataService.alert("Admin","Agregar Cuentas",'Todas las filas después de la primera están vacías.');
          }
        } else {
          this.sharedDataService.alert("Admin","Agregar Cuentas",'La primera fila debe tener todos los campos llenos.');
        }
      };
  
      reader.readAsArrayBuffer(this.selectedFile);
    }
  }
  
  uploadFile() {
    if (this.archivoSeleccionado && this.selectedFile) {
      const url = "https://phmsoft.tech/SpaceentApp/API's/ACCOUNT2_API_REST.php";
      
      // Configurar los datos a enviar como FormData
      const formData = new FormData();
      formData.append('comando', 'Add');
      formData.append('data', JSON.stringify(this.archivoDatos));
      formData.append('Id_Admin', this.sharedDataService.userData.Id);
      formData.append('admin', this.sharedDataService.userData.admin);
      // Realizar la solicitud POST
      this.http.post<any>(url, formData).subscribe(
        (response) => {
          if (response.success == "Datos agregados correctamente") {
            this.sharedDataService.alert("Admin", "Agregar Cuentas Excel", response.success);
            this.selectedFile = null;
          } else {
            this.sharedDataService.alert("Admin", "Agregar Cuentas", response.error);
          }
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.log('No se ha seleccionado ningún archivo o archivo.');
    }
  }

  onFileSelected1(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Leer el archivo seleccionado como una URL de datos
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.Imagen1 = e.target.result; // Guardar la URL de datos en la variable Imagen1
        this.Img1 = file;
      };
      reader.readAsDataURL(file); // Leer el archivo como URL de datos
    }
  }
  onFileSelected2(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Leer el archivo seleccionado como una URL de datos
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.Imagen2 = e.target.result; // Guardar la URL de datos en la variable Imagen1
        this.Img2 = file;
      };
      reader.readAsDataURL(file); // Leer el archivo como URL de datos
    }
  }
  onFileSelected3(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Leer el archivo seleccionado como una URL de datos
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.Imagen3 = e.target.result; // Guardar la URL de datos en la variable Imagen1
        this.Img3 = file;
      };
      reader.readAsDataURL(file); // Leer el archivo como URL de datos
    }
  }
  onFileSelected4(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Leer el archivo seleccionado como una URL de datos
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.Imagen4 = e.target.result; // Guardar la URL de datos en la variable Imagen1
        this.Img4 = file;
      };
      reader.readAsDataURL(file); // Leer el archivo como URL de datos
    }
  }
  onFileSelected5(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Leer el archivo seleccionado como una URL de datos
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.Imagen5 = e.target.result; // Guardar la URL de datos en la variable Imagen1
        this.Img5 = file;
      };
      reader.readAsDataURL(file); // Leer el archivo como URL de datos
    }
  }
  Upload_Img1(){
    if(this.Img1 != null){
      const url = "https://phmsoft.tech/SpaceentApp/API's/PRODUCTS4_API_REST.php";
      const formData = new FormData();
      formData.append('Id', "1");
      formData.append('Img', this.Img1);
      formData.append('Id_Admin', this.sharedDataService.userData.Id);
      formData.append('admin', this.sharedDataService.userData.admin);
      this.http.post<any>(url, formData).subscribe(
        (response) => {
          if (response.message === 'Flyer actualizado correctamente') {
            this.sharedDataService.alert("Admin","Agregar Flyers", response.message);
          } else {
            this.sharedDataService.alert("Admin","Agregar Flyers", response.message);
          }
        },
        (error) => {
          console.error('Error en la llamada HTTP:', error);
          this.sharedDataService.alert("Admin","Agregar Flyer", error);
        }
      );
    }else{
      this.sharedDataService.alert("Admin","Agregar Flyer", "Porfavor Seleccione una Imagen");
    }
  }

  Upload_Img2(){
    if(this.Img2 != null){
      const url = "https://phmsoft.tech/SpaceentApp/API's/PRODUCTS4_API_REST.php";
        const formData = new FormData();
        formData.append('Id', "2");
        formData.append('Img', this.Img2);
        formData.append('Id_Admin', this.sharedDataService.userData.Id);
        formData.append('admin', this.sharedDataService.userData.admin);
        this.http.post<any>(url, formData).subscribe(
          (response) => {
            if (response.message === 'Flyer actualizado correctamente') {
              this.sharedDataService.alert("Admin","Agregar Flyers", response.message);
            } else {
              this.sharedDataService.alert("Admin","Agregar Flyers", response.message);
            }
          },
          (error) => {
            console.error('Error en la llamada HTTP:', error);
            this.sharedDataService.alert("Admin","Agregar Flyer", error);
          }
        );
    }else{
      this.sharedDataService.alert("Admin","Agregar Flyer", "Porfavor Seleccione una Imagen");
    }
  }
  Upload_Img3(){
    if(this.Img3!=null){
      const url = "https://phmsoft.tech/SpaceentApp/API's/PRODUCTS4_API_REST.php";
        const formData = new FormData();
        formData.append('Id', "3");
        formData.append('Img', this.Img3);
        formData.append('Id_Admin', this.sharedDataService.userData.Id);
        formData.append('admin', this.sharedDataService.userData.admin);
        this.http.post<any>(url, formData).subscribe(
          (response) => {
            if (response.message === 'Flyer actualizado correctamente') {
              this.sharedDataService.alert("Admin","Agregar Flyers", response.message);
            } else {
              this.sharedDataService.alert("Admin","Agregar Flyers", response.message);
            }
          },
          (error) => {
            console.error('Error en la llamada HTTP:', error);
            this.sharedDataService.alert("Admin","Agregar Flyer", error);
          }
        );
      }else{
        this.sharedDataService.alert("Admin","Agregar Flyer", "Porfavor Seleccione una Imagen");
      }
  }
  Upload_Img4(){
    if(this.Img4!=null){
      const url = "https://phmsoft.tech/SpaceentApp/API's/PRODUCTS4_API_REST.php";
        const formData = new FormData();
        formData.append('Id', "4");
        formData.append('Img', this.Img3);
        formData.append('Id_Admin', this.sharedDataService.userData.Id);
        formData.append('admin', this.sharedDataService.userData.admin);
        this.http.post<any>(url, formData).subscribe(
          (response) => {
            if (response.message === 'Flyer actualizado correctamente') {
              this.sharedDataService.alert("Admin","Agregar Flyers", response.message);
            } else {
              this.sharedDataService.alert("Admin","Agregar Flyers", response.message);
            }
          },
          (error) => {
            console.error('Error en la llamada HTTP:', error);
            this.sharedDataService.alert("Admin","Agregar Flyer", error);
          }
        );
      }else{
        this.sharedDataService.alert("Admin","Agregar Flyer", "Porfavor Seleccione una Imagen");
      }
  }
  Upload_Img5(){
    if(this.Img5!=null){
      const url = "https://phmsoft.tech/SpaceentApp/API's/PRODUCTS4_API_REST.php";
        const formData = new FormData();
        formData.append('Id', "5");
        formData.append('Img', this.Img3);
        formData.append('Id_Admin', this.sharedDataService.userData.Id);
        formData.append('admin', this.sharedDataService.userData.admin);
        this.http.post<any>(url, formData).subscribe(
          (response) => {
            if (response.message === 'Flyer actualizado correctamente') {
              this.sharedDataService.alert("Admin","Agregar Flyers", response.message);
            } else {
              this.sharedDataService.alert("Admin","Agregar Flyers", response.message);
            }
          },
          (error) => {
            console.error('Error en la llamada HTTP:', error);
            this.sharedDataService.alert("Admin","Agregar Flyer", error);
          }
        );
      }else{
        this.sharedDataService.alert("Admin","Agregar Flyer", "Porfavor Seleccione una Imagen");
      }
  }
  Delete_Img1(){
    const url = "https://phmsoft.tech/SpaceentApp/API's/PRODUCTS4_API_REST.php";
    const formData = new FormData();
    formData.append('Id', "1");
    formData.append('Img', "null");
    formData.append('Id_Admin', this.sharedDataService.userData.Id);
      formData.append('admin', this.sharedDataService.userData.admin);
    this.http.post<any>(url, formData).subscribe(
      (response) => {
        if (response.message === 'Flyer actualizado correctamente') {
          this.sharedDataService.alert("Admin","Eliminar Flyers", "Flyer Eliminado Correctamente");
          this.Img1=null
          this.Imagen1=null
        } else {
          this.sharedDataService.alert("Admin","Eliminar Flyers", "Flyer No Eliminado");
        }
      },
      (error) => {
        console.error('Error en la llamada HTTP:', error);
        this.sharedDataService.alert("Admin","Agregar Flyer", error);
      }
    );
  }
  Delete_Img2(){
    const url = "https://phmsoft.tech/SpaceentApp/API's/PRODUCTS4_API_REST.php";
    const formData = new FormData();
    formData.append('Id', "2");
    formData.append('Img', "null");
    formData.append('Id_Admin', this.sharedDataService.userData.Id);
      formData.append('admin', this.sharedDataService.userData.admin);
    this.http.post<any>(url, formData).subscribe(
      (response) => {
        if (response.message === 'Flyer actualizado correctamente') {
          this.sharedDataService.alert("Admin","Eliminar Flyers", "Flyer Eliminado Correctamente");
          this.Img2 = null
          this.Imagen2=null
        } else {
          this.sharedDataService.alert("Admin","Eliminar Flyers", "Flyer No Eliminado");
        }
      },
      (error) => {
        console.error('Error en la llamada HTTP:', error);
        this.sharedDataService.alert("Admin","Agregar Flyer", error);
      }
    );
  }
  Delete_Img3(){
    const url = "https://phmsoft.tech/SpaceentApp/API's/PRODUCTS4_API_REST.php";
    const formData = new FormData();
    formData.append('Id', "3");
    formData.append('Img', "null");
    formData.append('Id_Admin', this.sharedDataService.userData.Id);
      formData.append('admin', this.sharedDataService.userData.admin);
    this.http.post<any>(url, formData).subscribe(
      (response) => {
        if (response.message === 'Flyer actualizado correctamente') {
          this.sharedDataService.alert("Admin","Eliminar Flyers", "Flyer Eliminado Correctamente");
          this.Img3=null
          this.Imagen3=null
        } else {
          this.sharedDataService.alert("Admin","Eliminar Flyers", "Flyer No Eliminado");
        }
      },
      (error) => {
        console.error('Error en la llamada HTTP:', error);
        this.sharedDataService.alert("Admin","Agregar Flyer", error);
      }
    );
  }
  Delete_Img4(){
    const url = "https://phmsoft.tech/SpaceentApp/API's/PRODUCTS4_API_REST.php";
    const formData = new FormData();
    formData.append('Id', "4");
    formData.append('Img', "null");
    formData.append('Id_Admin', this.sharedDataService.userData.Id);
      formData.append('admin', this.sharedDataService.userData.admin);
    this.http.post<any>(url, formData).subscribe(
      (response) => {
        if (response.message === 'Flyer actualizado correctamente') {
          this.sharedDataService.alert("Admin","Eliminar Flyers", "Flyer Eliminado Correctamente");
          this.Img4=null
          this.Imagen4=null
        } else {
          this.sharedDataService.alert("Admin","Eliminar Flyers", "Flyer No Eliminado");
        }
      },
      (error) => {
        console.error('Error en la llamada HTTP:', error);
        this.sharedDataService.alert("Admin","Agregar Flyer", error);
      }
    );
  }
  Delete_Img5(){
    const url = "https://phmsoft.tech/SpaceentApp/API's/PRODUCTS4_API_REST.php";
    const formData = new FormData();
    formData.append('Id', "5");
    formData.append('Img', "null");
    formData.append('Id_Admin', this.sharedDataService.userData.Id);
      formData.append('admin', this.sharedDataService.userData.admin);
    this.http.post<any>(url, formData).subscribe(
      (response) => {
        if (response.message === 'Flyer actualizado correctamente') {
          this.sharedDataService.alert("Admin","Eliminar Flyers", "Flyer Eliminado Correctamente");
          this.Img5=null
          this.Imagen5=null
        } else {
          this.sharedDataService.alert("Admin","Eliminar Flyers", "Flyer No Eliminado");
        }
      },
      (error) => {
        console.error('Error en la llamada HTTP:', error);
        this.sharedDataService.alert("Admin","Agregar Flyer", error);
      }
    );
  }
  CambiarCashback(){
    const url = "https://phmsoft.tech/SpaceentApp/API's/PRODUCTS_API_REST.php"
    const params ={
      comando: "LoadCashback",
      NC : this.sharedDataService.Cashback,
      Id_Admin : this.sharedDataService.userData.Id,
      admin : this.sharedDataService.userData.admin
    }
    this.http.get<any>(url,{params}).subscribe(
      (response)=>{
        if(response){
          if(response.message=="Cashback actualizada correctamente"){
            this.sharedDataService.alert("Admin","Cashback",response.message)
          }
        }else{
          this.sharedDataService.alert("Admin","Cashback",response.message)
        }
      },(error)=>{
        this.sharedDataService.alert("Admin","Cashback","error al actualizar el % de Cashback")
      }
    )
  }
}
