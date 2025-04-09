import { Injectable } from '@angular/core';
import { ActionPerformed, PushNotificationSchema, PushNotifications, Token } from '@capacitor/push-notifications';
import {HttpClient} from "@angular/common/http";
import {SharedDataService} from "../shared-data.service";

@Injectable({
  providedIn: 'root'
})
export class NotificationsPushService {
  private apiUrl = "https://phmsoft.tech/SpaceentApp/API's/USUARIOS_SUPER_API_REST.php"
  constructor(
    private http: HttpClient,
  public sharedDataService: SharedDataService,
  ) { }

  init(){
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        PushNotifications.register();
        this.addListeners();
      }
    });
  }

  addListeners(){
    PushNotifications.addListener('registration', (token: Token) => {
      this.saveToken(token.value);
    });

    PushNotifications.addListener('registrationError', (error: any) => {

    });

    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {

    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {

    });
  }

  saveToken(token: string) {
    const params = {
      action: "update",
      id: this.sharedDataService.userData.Id
    }
    this.http.put<any>(this.apiUrl,
      {"Token_Notificaciones": token},
      { params }).subscribe(
      (response) => {
        if (response) {
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
