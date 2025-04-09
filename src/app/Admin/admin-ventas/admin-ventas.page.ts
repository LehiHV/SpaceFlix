import { Component, OnInit, Inject, LOCALE_ID  } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-ventas',
  templateUrl: './admin-ventas.page.html',
  styleUrls: ['./admin-ventas.page.scss'],
})
export class AdminVentasPage implements OnInit {
  constructor(
    private datePipe: DatePipe,
    @Inject(LOCALE_ID) private locale: string // Inyecta el LOCALE_ID
  ) {}

  ngOnInit() {}

  getFormattedDate(): string {
    let formattedDate = this.datePipe.transform(new Date(), 'EEEE d, MMMM, y', this.locale) || 'Fecha no disponible';
    return formattedDate
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  }
