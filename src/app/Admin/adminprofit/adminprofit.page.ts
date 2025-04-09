import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SharedDataService } from 'src/app/shared-data.service';

@Component({
  selector: 'app-adminprofit',
  templateUrl: './adminprofit.page.html',
  styleUrls: ['./adminprofit.page.scss'],
})
export class AdminprofitPage implements OnInit {
  selectedPeriod = '1'; // Valor inicial como "1 mes"
  currentDate: string; // Variable para almacenar la fecha actual

  constructor(
    private datePipe: DatePipe,
    public sharedDataServices: SharedDataService,
    @Inject(LOCALE_ID) private locale: string // Inyecta el LOCALE_ID
  ) {
    this.currentDate = this.getFormattedDate(); // Obtiene la fecha actual al inicializar el componente
  }

  ngOnInit() {
    this.onPeriodChange();
  }

  getFormattedDate(date: Date = new Date()): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || 'Fecha no disponible';
  }

  onPeriodChange() {
    // Obtener la fecha actual
    const currentDate = this.getFormattedDate();

    // Obtener la fecha previa según el periodo seleccionado
    let previousDate: string = '';

    switch (this.selectedPeriod) {
      case "1":
        // Restar 1 mes a la fecha actual
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        previousDate = this.getFormattedDate(oneMonthAgo);
        break;
      case "2":
        // Restar 1 mes a la fecha actual
        const twoMonthAgo = new Date();
        twoMonthAgo.setMonth(twoMonthAgo.getMonth() - 2);
        previousDate = this.getFormattedDate(twoMonthAgo);
        break;
      case "3":
        // Restar 3 meses a la fecha actual
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        previousDate = this.getFormattedDate(threeMonthsAgo);
        break;
      case "4":
        // Restar 3 meses a la fecha actual
        const fourMonthsAgo = new Date();
        fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);
        previousDate = this.getFormattedDate(fourMonthsAgo);
        break;
      case "5":
        // Restar 3 meses a la fecha actual
        const fiveMonthsAgo = new Date();
        fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);
        previousDate = this.getFormattedDate(fiveMonthsAgo);
        break;
      case "6":
        // Restar 6 meses a la fecha actual
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        previousDate = this.getFormattedDate(sixMonthsAgo);
        break;
      case "12":
        // Restar 12 meses a la fecha actual
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);
        previousDate = this.getFormattedDate(twelveMonthsAgo);
        break;
      case "all":
        const allMonthsAgo = new Date();
        allMonthsAgo.setFullYear(allMonthsAgo.getFullYear() - 999);
        previousDate = this.getFormattedDate(allMonthsAgo);
        break;
      default:
        // Si el periodo no es reconocido, manejar según tu lógica (por ejemplo, asignar la fecha actual)
        previousDate = currentDate;
        break;
    }

    console.log('Fetching profits from', previousDate, 'to', currentDate);
    this.sharedDataServices.ShowProfits(currentDate, previousDate);
  }
}
