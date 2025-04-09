import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SharedDataService } from '../../shared-data.service';
import {Capacitor} from "@capacitor/core";
import {NotificationsPushService} from "../../services/notifications-push.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  valorSegmento = 'pantallas';
  img: any[] = [];
  isLoading: boolean = false;

  constructor(
    public navCtrl: NavController,
    public sharedDataService: SharedDataService,
    private pushNotifications: NotificationsPushService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadData();
    this.initPushNotifications();
  }

  initPushNotifications() {
    if(Capacitor.isNativePlatform()){
      this.pushNotifications.init();
    }
  }

  swiperSlideChanged(e: any) {
    console.log('changed: ', e);
  }

  mostrarSegundaCard: boolean = false;

  mostrarSegundaTarjeta() {
    console.log('Mostrando segunda tarjeta...');
    this.mostrarSegundaCard = true;
  }

  loadData() {
    this.sharedDataService.ShowFlyers().subscribe(
      (response) => {
        if (response && response.length > 0) {
          this.sharedDataService.FlyerList = response;
        } else {
          this.sharedDataService.FlyerList = null;
        }
      },
      (error) => {
        console.error('Error al obtener los flyers:', error);
        this.sharedDataService.FlyerList = null;
      }
    );
  }

  async doRefresh(event: any) {
    console.log('Comenzando la actualización');
    this.isLoading = true;

    try {
      const userId = this.sharedDataService.userData.Id;

      const url = "https://phmsoft.tech/SpaceentApp/API's/GET_USER_CREDIT.php"; // Ajusta esta URL según sea necesario
      const params = new HttpParams().set('id', userId);

      const response = await this.http.get<any>(url, { params }).toPromise();
      this.isLoading = false;
      if (response) {
        this.sharedDataService.userData.Creditos = response.creditos;
      } else {
        this.sharedDataService.alert('Actualización fallida', '', 'Intentenlo de nuevo más tarde.');
      }
    } catch (error) {
      this.isLoading = false;
      console.error('Error en la actualización:', error);
      this.sharedDataService.alert('Error en la actualización', '', 'Intentenlo nuevo más tarde.');
    } finally {
      event.target.complete();
    }
  }
}
