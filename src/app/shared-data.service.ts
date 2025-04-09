import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ModalController, NavController } from '@ionic/angular';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { Observable, share, tap } from 'rxjs';
import {ActivatedRoute, Route, Router} from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {UserData} from "./shared-data.model";
import { Storage } from '@ionic/storage-angular';6

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  userData: UserData | any;
  ProductList: any;
  ClientList : any;
  SubAdminList : any;
  Pages: any;
  TicketList : any;
  FechaHoy: Date | null = null; // Definido como Date
  AccountList : any;
  ReportList : any;
  ReportAdminList : any;
  ObjFound : any;
  Profits : any;
  Cashback: number = 0;
  FlyerList: any;
  codigoPais: any;
  totalPages: any;
  Item: any = null;
  categoriesThreshold: any;
  constructor(
    private http: HttpClient,
    public alertController: AlertController,
    private socialsharing: SocialSharing,
    public navCtrl: NavController,
    private sanitizer: DomSanitizer,
    private storage: Storage,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    // This method must be called in constructor
    // if you don't want to apply manually in every page
    this.ValidateSession()
  }

  async alert(header: string,subHeader:string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
  ShareViaWhatsApp(telefono : string, mensaje : string){
    this.socialsharing.shareViaWhatsAppToReceiver(telefono,mensaje,'','')
    .then(response =>{
      console.log(response)
    }).catch(error=>{
      console.log(error)
    });
  }
  ShowClientAccounts(id:number){
    const url = "https://phmsoft.tech/SpaceentApp/API's/ACCOUNT_API_REST.php"
    const params ={
      comando: "View",
      Id: id
    }

    if(id!=null){
      this.http.get<any>(url,{params}).subscribe(
        (response)=>{
          console.log(response)
          if(response.message === "No se encontraron cuentas asociadas con algún ticket"){
            console.log("None")
            return this.TicketList = null
          }else{
            return this.TicketList = response
          }
        },(error)=>{
          this.alert("Reportes","Tickets","No existen Ticket de tu compra realizada")
        }
      )
    }else{
      this.alert("Problemas de datos","Reinicia la Aplicacion","Si esto no funciona comunicate con servicio tecnico");
    }
  }
  ShowClientAccountsRenew(id:number){
    const url = "https://phmsoft.tech/SpaceentApp/API's/TICKET_API_REST.php"
    const params ={
      comando: "ViewRenew",
      Id: id
    }

    if(id!=null){
      this.http.get<any>(url,{params}).subscribe(
        (response)=>{
          if(response.message === "No se encontraron cuentas asociadas con algún ticket"){
            return this.TicketList = null
          }else{
            return this.TicketList = response
          }
        },(error)=>{
          this.alert("Reportes","Tickets","No existen Ticket de tu compra realizada")
        }
      )
    }else{
      this.alert("Problemas de datos","Reinicia la Aplicacion","Si esto no funciona comunicate con servicio tecnico");
    }
  }
  ShowAccounts(){
    const url = "https://phmsoft.tech/SpaceentApp/API's/ACCOUNT_API_REST.php"
    const params ={
      comando: "ViewOnlyAccounts",
      Option : 0
    }
    this.http.get<any>(url,{params}).subscribe(
      (response)=>{
        if(response.message === "No se encontraron cuentas"){
          this.AccountList = null
        }else{
          this.AccountList = response.cuentas
          this.Pages = response.pages
        }
      },(error)=>{
      }
    )
  }
  ShowProducts(){
      // Realizar la llamada HTTP
      const url = "https://phmsoft.tech/SpaceentApp/API's/PRODUCTS_API_REST.php";
      const params = {
        comando: 'View',
        User: this.userData.VIP
      };

      this.http.get<any>(url, { params }).subscribe(
        (response) => {
          // Verificar la respuesta del servidor
          if (response) {
            if (response.message === "No se encontraron productos"){
              this.ProductList = null
            }else{
              this.ProductList = response;
              this.categoriesThreshold = Object.entries(
                this.productsOrganizer(
                  this.productsCategorizer(
                    this.ProductList)
                )
              );
            }
          }
        }
      );
  }
  ShowClients(): Observable<any> {
    const url = "https://phmsoft.tech/SpaceentApp/API's/USERS_API_REST.php";
    const params = {
      comando: 'View'
    };
    return this.http.get<any>(url, { params }).pipe(
      tap(response => {
        this.ClientList = response.usuarios;
        this.Pages = response.pages;
      })
    );
  }
  async ShowSubAdmins(){
    const url = "https://phmsoft.tech/SpaceentApp/API's/ADMIN_REST_API.php"
    const params ={
      comando: 'View Sub Admins'
    }
    this.http.get<any>(url, { params }).subscribe(
      (response) =>{
        this.SubAdminList = response
      }
    );
  }
  ShowReports() {
    const url = "https://phmsoft.tech/SpaceentApp/API's/REPORTS_API_REST.php";
    const params = {
      comando: 'View',
      Id: this.userData.Id
    };

    this.http.get<any>(url, { params }).subscribe(
      (response) => {
        if (response.message === "No se encontró ningún usuario con el ID proporcionado") {
          this.ReportList = null
        } else {
          this.ReportList = response
        }
      },
      (error) => {
        // Aquí maneja cualquier error de la solicitud HTTP
      }
    );
  }
  ShowReportsAdmin(page: number = 1): Observable<any> {
    const url = "https://phmsoft.tech/SpaceentApp/API's/REPORTS_API_REST.php";
    const params = {
      comando: 'ViewAdminPagination', // Cambiar al nuevo case
      Page: page.toString() // Enviar el número de página actual como cadena
    };

    // Retornar el observable para permitir que otro código se suscriba a él
    return this.http.get<any>(url, { params }).pipe(
      tap(response => {
        this.ReportAdminList = response.reportes;
        this.Pages = response.pages;
      })
    );
  }


  async ShowProfits(FechaActual : string , FechaMaxima : string){
    const url = "https://phmsoft.tech/SpaceentApp/API's/TICKET_API_REST.php"
    const params ={
      comando: 'Profits',
      FechaActual : FechaActual,
      FechaMaxima : FechaMaxima
    }
    this.http.get<any>(url, { params }).subscribe(
      (response)=>{
        if(response){
          this.Profits = response
        }else{
          this.Profits = null
        }
      }
    );
  }
  ShowFlyers() {
    const url = "https://phmsoft.tech/SpaceentApp/API's/PRODUCTS_API_REST.php";
    const params = {
      comando: 'ViewFlyers'
    };

    return this.http.get<any>(url, { params });
  }
  navegar(Page : string){
    this.navCtrl.navigateForward(Page);
  }
  navegarConDatos(ruta: string, item: any) {
    this.Item = item; // Almacenas el reporte seleccionado
    this.router.navigateByUrl(ruta); // Navegas a la página de detalles
  }
  filter(list: any[], text: string): any[] {
    if (!text) {
      return list;
    }

    return list.filter((obj: { Usuario: string }) => {
      // Puedes ajustar esta lógica de búsqueda según tus necesidades
      return obj.Usuario.toLowerCase().includes(text.toLowerCase());
    })

  }
  filterMovs(list: any[], text: string): any[] {
    if (!text) {
      return list;
    }

    return list.filter((obj: { Seccion: string }) => {
      // Puedes ajustar esta lógica de búsqueda según tus necesidades
      return obj.Seccion.toLowerCase().includes(text.toLowerCase());
    })

  }
  filterService(entries:any, text:any) {
    if(!text) return entries;
    return entries
    // @ts-ignore
      .map(([category, items]) => [
        category,
        items.filter((item: any) => item.Nombre.includes(text)),
      ])// @ts-ignore
      .filter(([, filteredItems]) => filteredItems.length > 0);
  }
  filterEmail(list: any[], text: string): any[] {
    if (!text) {
      return list.filter(obj => obj && obj.Correo); // Verifica si obj y obj.Correo existen
    }

    return list.filter((obj: { Correo: string }) => {
      // Verifica si obj y obj.Correo existen y realiza la búsqueda
      return obj && obj.Correo && obj.Correo.toLowerCase().includes(text.toLowerCase());
    });
  }
  filterEmailAccount(list: any[], text: string, filterValid: boolean, filterInvalid: boolean): any[] {
    let filteredList = list.filter((obj: { Correo: string }) => {
      return !text || (obj && obj.Correo && obj.Correo.toLowerCase().includes(text.toLowerCase()));
    });

    if (filterValid && !filterInvalid) {
      filteredList = filteredList.filter(obj => obj.Valido == 1);
    } else if (!filterValid && filterInvalid) {
      filteredList = filteredList.filter(obj => obj.Valido == 0);
    }

    return filteredList;
  }
  filterEmail2(list: any[], text: string): any[] {
    if (!text) {
      return list;
    }

    return list.filter((obj: { Correo: string, Tipo: string }) => {
      // Verifica si obj y obj.Correo existen y realiza la búsqueda
      return obj && obj.Correo && obj.Correo.toLowerCase().includes(text.toLowerCase()) || obj && obj.Tipo && obj.Tipo.toLowerCase().includes(text.toLowerCase());
    });
  }
  cargarLadas() {
    const url = "https://restcountries.com/v2/all";

    this.http.get<any[]>(url).subscribe(
      (response) => {
        // Iterar sobre la respuesta y construir codigoPais
        this.codigoPais = response.map((pais) => {
          const nombre = pais.name;
          const callingCodes = pais.callingCodes;
          if (callingCodes && callingCodes.length > 0) {
            return { nombre: nombre, codigoLada: callingCodes[0] };
          } else {
            return null;
          }
        });
      },
      (error) => {
        console.error('Error al cargar ladas:', error);
      }
    );

  }
  cargarCashback(){
    const url = "https://phmsoft.tech/SpaceentApp/API's/PRODUCTS_API_REST.php"
    const params ={
      comando: "Cashback",
    }
    this.http.get<any>(url,{params}).subscribe(
      (response)=>{
        if(response){
          this.Cashback = response
        }else{
          this.Cashback = 0
        }
      },(error)=>{
        this.alert("Reportes","Tickets","No existen Ticket de tu compra realizada")
      }
    )
  }

  ShowFechaHoy() {
    const url = "https://phmsoft.tech/SpaceentApp/API's/ADMIN_REST_API.php";
    const params = {
        comando: "ViewFechaHoy",
    };

    this.http.get<any>(url, { params }).subscribe({
        next: (response) => {
            if (response.status === "success" && response.data?.[0]?.Fecha_Hoy) {
                const fechaDB = response.data[0].Fecha_Hoy;
                this.FechaHoy = fechaDB;
            } else {
                this.FechaHoy = null;
                console.log('No se recibió fecha válida de la DB');
            }
        },
        error: (error) => {
            console.error('Error al obtener la fecha:', error);
            this.alert("Error", "Admin", "No se pudo encontrar la fecha actual");
            this.FechaHoy = null;
        }
    });
}
  /**
   * Validates the user's session and redirects if it is invalid.
   *
   * This method retrieves the user data from storage and checks if the session is valid.
   * If the session is invalid or no user data is found, it redirects the user to the
   * `/welcome` page. If the session is valid, it updates the local `userData` property
   * of SharedDataService for persistence.
   *
   * @returns {Promise<void>} A promise that resolves when the session validation
   * process completes.
   */
  async ValidateSession(): Promise<void> {
    let userData: UserData | undefined = await this._getUserDataStorage();

    const url = window.location.hash;
    const lastPart = url.split('/').pop();
    console.log(lastPart)
    // @ts-ignore
    if (!userData || !this.isValidUserData(userData)) {
      if(lastPart !== "pago-aprobado" && lastPart !== "pago-pendiente" && lastPart !== "error-pago") {
        this.navegar("/welcome");
      }
    }else{
      this.userData = userData;
    }
  }

  /**
   * Retrieves the stored user data asynchronously.
   *
   * This method initializes the storage if it hasn't been created yet and
   * then retrieves the `userData` object from storage.
   *
   * @returns {Promise<UserData | undefined>} A promise that resolves to the
   * `UserData` object if found in storage, or `undefined` if not available.
   */
  async _getUserDataStorage(): Promise<UserData | undefined> {
    await this.storage.create();
    return await this.storage.get('userData');
  }

  /**
   * Checks if the user data is still valid based on the session expiration date.
   *
   * This method compares the current date and time with the expiration date
   * of the user's session. If the current date is earlier than the expiration date,
   * the session is considered valid.
   *
   * @param {UserData} userData - The user data object containing session information,
   * including the expiration date (`expiresAt`).
   * @returns {boolean} `true` if the session is still valid (i.e., the current date is before
   * the expiration date); otherwise, `false`.
   */
  async isValidUserData(userData: UserData): Promise<boolean> {
    if (!((new Date()) < userData.expiresAt)){
      await this.storage.create();
      await this.storage.remove('userData')
      return false;
    }
    return true;
  }

  /**
   * Categorizes a list of products by their service category name.
   *
   * This method organizes the input products into a structure where each key
   * represents a service category, and its value is an array of products belonging
   * to that category. If a product does not have a category (`Categoria_Servicio_Nombre` is `null`),
   * it is grouped under the `"Varios"` key. If a new category is encountered, it initializes
   * a new array for that category.
   *
   * @param {any[]} products - An array of product objects. Each object should have a
   *   `Categoria_Servicio_Nombre` property indicating its category.
   * @returns {object} - An object where keys are category names and values are arrays of products.
   *   Products with a `null` category are grouped under the `"Varios"` key.
   *
   * @example
   * const products = [
   *   { id: 1, Categoria_Servicio_Nombre: "Electronics", name: "Phone" },
   *   { id: 2, Categoria_Servicio_Nombre: null, name: "Notebook" },
   *   { id: 3, Categoria_Servicio_Nombre: "Electronics", name: "Tablet" },
   *   { id: 4, Categoria_Servicio_Nombre: "Books", name: "Novel" }
   * ];
   *
   * const categorized = productsCategorizer(products);
   * console.log(categorized);
   * // Output:
   * // {
   * //   Electronics: [
   * //     { id: 1, Categoria_Servicio_Nombre: "Electronics", Nombre: "Phone" },
   * //     { id: 3, Categoria_Servicio_Nombre: "Electronics", Nombre: "Tablet" }
   * //   ],
   * //   Books: [
   * //     { id: 4, Categoria_Servicio_Nombre: "Books", Nombre: "Novel" }
   * //   ],
   * //   Varios: [
   * //     { id: 2, Categoria_Servicio_Nombre: null, Nombre: "Notebook" }
   * //   ]
   * // }
   */
  productsCategorizer(products: any[]): any {
    const threshold = {};
    products.forEach(product => {
      if (product.Categoria_Servicio_Nombre === null){
        // @ts-ignore
        if(threshold["General"] === undefined){
          // @ts-ignore
          threshold["General"] = [];
        }
        // @ts-ignore
        threshold["General"].push(product)
        // @ts-ignore
      }else if (threshold[product.Categoria_Servicio_Nombre] === undefined){
        // @ts-ignore
        threshold[product.Categoria_Servicio_Nombre] = [product]
      } else {
        // @ts-ignore
        threshold[product.Categoria_Servicio_Nombre].push(product)
      }
    })
    return threshold;
  }

  productsOrganizer(categoriesThreshold: any){
    for (const category in categoriesThreshold) {
      categoriesThreshold[category].sort((a: any, b: any) => {
        if (a.Categoria_Orden === null) return 1;
        if (b.Categoria_Orden === null) return -1;
        return a.Categoria_Orden - b.Categoria_Orden
      });
    }
    return categoriesThreshold;
  }

}

