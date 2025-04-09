import {Component, OnInit} from '@angular/core';
import {
  AndroidAnimation,
  AndroidViewStyle,
  DefaultiOSSystemBrowserOptions,
  InAppBrowser
} from '@capacitor/inappbrowser';
import {SharedDataService} from "../../shared-data.service";
import {HttpClient} from "@angular/common/http";
import {Capacitor} from "@capacitor/core";
import {LoadingController} from "@ionic/angular";

@Component({
  selector: 'app-comprar-creditos',
  templateUrl: './comprar-creditos.page.html',
  styleUrls: ['./comprar-creditos.page.scss'],
})
export class ComprarCreditosPage implements OnInit {

  productQuantity: number = 10;
  API_URL: string = "https://phmsoft.tech/SpaceentApp/API's/SHOP_ITEMS_SUPER_API_REST.php";
  MP_API_URL: string = "https://createorder-pxty2w666q-uc.a.run.app/";
  loader: any;
  fechaInicio: string = '';
  fechaFin: string = '';
  recargas: any[] = [];
  busquedaRealizada: boolean = false;
  constructor(
    private sharedDataService: SharedDataService,
    private http: HttpClient,
    public loadingController: LoadingController,
  ) { }

  ngOnInit() {

    // Obtener la fecha actual
    const hoy = new Date();
    
    // Formatear la fecha al formato YYYY-MM-DD que requiere el input type="date"
    this.fechaInicio = this.formatDate(hoy);
    this.fechaFin = this.formatDate(hoy);
  }

    // Función auxiliar para formatear la fecha
    formatDate(date: Date): string {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  

  async sendOrder(){
    if(!this._isValidOrder()){
      alert("Compra mínima de $10")
      return;
    }
    const newOrder = {
      "userData": {
        "Id": this.sharedDataService.userData.Id,
        "Nombre": this.sharedDataService.userData.Nombre_Cliente,
      },
      "items": [{
        "id": "1",
        "unit_price": 1,
        "quantity": 1,
        "title": `Comprar ${this.productQuantity} Créditos`,
        "commissionFee": 0,
        "realQuantity": this.productQuantity,
      }]
    }
    //@ts-ignore
    let params = {
      action: "show",
      name: "Créditos"
    }
    const response = await this.http.get<any>(this.API_URL, { params }).toPromise();
    newOrder.items[0].id = response.data[0].Id;

    const fee = this.getCommissionFee(this.productQuantity);
    const newTotal = this.productQuantity + fee;

    if(this._userAcceptsFeeModal(fee)){
      this.loader = await this.loadingController.create({
        message: 'Redirigiendo a pago...',
      });
      await this.loader.present();
      setTimeout(()=>{}, 3000)
      newOrder.items[0].unit_price = newTotal;
      newOrder.items[0].commissionFee = fee;
      const init_point = (await this.http.post<any>(this.MP_API_URL, newOrder).toPromise()).data;
      await this._redirectPaymentOrder(init_point);
    }else{
      console.log("Rejected")
    }
  }

  _isValidOrder(){
    return this.productQuantity >= 10
  }

  _userAcceptsFeeModal(fees: number){
    return window.confirm(`Se cobrarán $${fees} MXN de comisión. ¿Proceder con el pago?`)
  }

  getMPFee(value: number){
    return (Math.round(((value*0.035) + ((value*0.035) * 0.16) + 4.65 + 0.02) * 100) / 100);
  }

  getCommissionFee(total: number){
    // Este ajute la verdad fue pura suerte haberme dado cuenta.
    // El objetivo es calcular las comisiones de MP 3 veces sobre el valor.
    // Lo que se logra con esto es calcular la cantidad de comision para que al momento de cobrarse MP,
    // el resultado sea el valor ingresado neto
    let totalWFees = total + this.getMPFee(total);
    totalWFees = total + this.getMPFee(totalWFees);
    return this.getMPFee(totalWFees);
  }

  // soptions: {
    //   showURL: false,
    //   showToolbar: false,
    //   clearCache: true,
    //   clearSessionCache: true,
    //   mediaPlaybackRequiresUserAction: true,
    //   closeButtonText: "Regresar a la APP",
    //   showNavigationButtons: false,
    //   leftToRight: true,
    //   toolbarPosition: ToolbarPosition.TOP,
    //   customWebViewUserAgent: null,
    //   android: DefaultAndroidWebViewOptions,
    //   iOS: DefaultiOSWebViewOptions
    // }

async _redirectPaymentOrder(url: string){
    if(Capacitor.isNativePlatform()){
        await InAppBrowser.openInSystemBrowser(
          {
            url: url,
            options: {
              android: {
                showTitle: false,
                hideToolbarOnScroll: true,
                viewStyle: AndroidViewStyle.FULL_SCREEN,
                startAnimation: AndroidAnimation.SLIDE_OUT_RIGHT,
                exitAnimation: AndroidAnimation.FADE_OUT,
                bottomSheetOptions: {
                  height: 0,
                  isFixed: true
                }
              },
              iOS: DefaultiOSSystemBrowserOptions
            }
          }
        )
      await InAppBrowser.addListener('browserClosed', async () => {
        await this.sharedDataService.navCtrl.navigateBack("/home")
      });
    } else {
      const newWindow = window.open(url, '_blank');
      if(newWindow) {
        newWindow.focus();
      }
    }
  await this.loader.dismiss();
  }
  
  async getRecargas() {
    this.busquedaRealizada = true;
    if (!this.fechaInicio || !this.fechaFin) {
      alert('Por favor seleccione ambas fechas');
      return;
    }

    this.loader = await this.loadingController.create({
      message: 'Cargando recargas...',
    });
    await this.loader.present();

    try {
      const params = {
        comando: 'GetRecargasUser',
        Id_Usuario: this.sharedDataService.userData.Id,
        fecha_inicio: this.fechaInicio,
        fecha_fin: this.fechaFin
      };

      const response = await this.http.get<any>(
        "https://phmsoft.tech/SpaceentApp/API's/RECARGAS_GET_API_USER.php",
        { params }
      ).toPromise();

      if (response && response.data) {
        this.recargas = response.data;
      } else {
        this.recargas = [];
      }
    } catch (error) {
      console.error('Error al obtener recargas:', error);
      alert('Error al obtener el historial de recargas');
      this.recargas = [];
    } finally {
      await this.loader.dismiss();
    }
  }

}

