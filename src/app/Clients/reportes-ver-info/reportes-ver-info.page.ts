import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../../shared-data.service';
@Component({
  selector: 'app-reportes-ver-info',
  templateUrl: './reportes-ver-info.page.html',
  styleUrls: ['./reportes-ver-info.page.scss'],
})
export class ReportesVerInfoPage implements OnInit {

  constructor(public sharedDataServices: SharedDataService) { }
  reporte: any;
  ngOnInit() {
    this.reporte = this.sharedDataServices.Item; // Accedes al reporte seleccionado
    if (!this.reporte) {
      // Manejar el caso de que no haya datos, posiblemente redirigiendo de vuelta
      console.error('No hay reporte seleccionado');
    }
  }
  close(){
    this.sharedDataServices.navegar("/vista-reportes-usuario")
  }

}
