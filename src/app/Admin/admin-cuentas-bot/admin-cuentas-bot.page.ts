import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { SharedDataService } from 'src/app/shared-data.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-cuentas-bot',
  templateUrl: './admin-cuentas-bot.page.html',
  styleUrls: ['./admin-cuentas-bot.page.scss'],
})
export class AdminCuentasBotPage implements OnInit {
  selectedFile: File | null = null;
  archivoSeleccionado: boolean = false; // Variable para rastrear si se seleccionó un archivo
  archivoDatos: any;
  excelData: any[][] = []; // Nueva variable para almacenar los datos de Excel

  constructor(
    public sharedDataService: SharedDataService,
    private http: HttpClient
  ) {}

  ngOnInit() {}

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

        const excelData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        }) as any[][];

        if (
          excelData.length > 1 &&
          excelData[0].every(
            (cell: any) => cell !== null && cell !== undefined && cell !== ''
          )
        ) {
          const validRows = excelData
            .slice(1)
            .filter((row: any[]) =>
              row.every(
                (cell: any) =>
                  cell !== null && cell !== undefined && cell !== ''
              )
            );
          const nonEmptyRows = validRows.filter((row: any[]) =>
            row.some(
              (cell: any) => cell !== '' && cell !== null && cell !== undefined
            )
          );

          if (nonEmptyRows.length > 0) {
            this.archivoDatos = nonEmptyRows;
            // Asigna los datos para visualización
            this.excelData = excelData;
          } else {
            this.sharedDataService.alert(
              'Admin',
              'Agregar Cuentas',
              'Todas las filas después de la primera están vacías.'
            );
          }
        } else {
          this.sharedDataService.alert(
            'Admin',
            'Agregar Cuentas',
            'La primera fila debe tener todos los campos llenos.'
          );
        }
      };

      reader.readAsArrayBuffer(this.selectedFile);
    }
  }
  uploadFile() {
    if (this.archivoSeleccionado && this.selectedFile) {
      const url = "https://phmsoft.tech/SpaceentApp/API's/ACCOUNT3_API_REST.php";
      
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
  
}
