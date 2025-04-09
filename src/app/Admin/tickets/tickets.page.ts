import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoadingController} from "@ionic/angular";

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.scss'],
})
export class TicketsPage implements OnInit {

  startDate: string | undefined;
  endDate: string | undefined;
  search: string | undefined;

  filterParams: any = {
    startDate: undefined,
    endDate: undefined,
    all: undefined
  };

  showStartDatePicker: boolean = false;
  showEndDatePicker: boolean = false;

  API_URL: string = "https://phmsoft.tech/SpaceentApp/API's/TICKET_SUPER_API_REST.php";
  private _currentPage: number = 1;
  private _perPage: number = 20;
  totalPages: Array<any> = [];
  tickets: Array<any> = [];

  constructor(
    public http: HttpClient,
  public loadingController: LoadingController
  ) { }

  ngOnInit() {}

  async ionViewWillEnter() {
    await this.showTicketsLoading()
    this.getTickets(this.currentPage, this.perPage)
  }

  async showTicketsLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando tickets...',
    });
    await loading.present();
    setTimeout(async ()=>{
      await loading.dismiss();
    }, 500)
  }

  async searchTickets() {
    if(!this._isValidFilter()) {
      return;
    }

    await this.showTicketsLoading()

    this.filterParams = {
      "all": this.search,
      "startDate": this.startDate,
      "endDate": this.endDate
    }
    this.getTickets(this.currentPage, this.perPage, this.filterParams)

  }

  onSelectStartDate(event: any) {
    if (event.detail.value === undefined) return;
    this.startDate = event.detail.value.split("T")[0];
    this.showStartDatePicker = false;
  }

  onSelectEndDate(event: any) {
    if (event.detail.value === undefined) return;
    this.endDate = event.detail.value.split("T")[0];
    this.showEndDatePicker = false;
  }

  cleanDatePickers(){
    this.startDate = undefined;
    this.endDate = undefined;
    this.filterParams.startDate = undefined;
    this.filterParams.endDate = undefined;
  }

  getTickets(page: number, perPage: number, search: any = {}) {
    let params: any = {
      action: 'index',
      page: page,
      perPage: perPage
    };

    if(search.all){
      params["all"] = search.all
    }

    if(search.startDate && search.endDate){
      params["startDate"] = search.startDate;
      params["endDate"] = search.endDate;
    }
    this.http.get<any>(this.API_URL, { params }).subscribe(
      (response) => {
        if (response) {
          this.tickets = response.data;
          this.totalPages = Array(response.totalPages);
        } else {
          console.error('Respuesta inválida del servidor:', response);
        }
      },
      (error) => {
        console.error('Error en la llamada HTTP:', error);
      }
    );
  }

  getPage(event: Event){
    const target = event.target as HTMLElement;

    if (target.tagName === 'SPAN') {
      const number = target.getAttribute('page-number');
      if (number) {
        this.currentPage = parseInt(number);
      }
    }
  }

  get currentPage(): number {
    return this._currentPage;
  }

  get perPage(): number {
    return this._perPage;
  }

  set currentPage(value: number) {

    if (this.currentPage === value) {
      return;
    }

    this._currentPage = value;
    this.getTickets(this.currentPage, this.perPage, this.filterParams);
  }

  _isValidFilter(): boolean {
    if(this.startDate !== undefined && this.endDate !== undefined) {
      if(((new Date(this.startDate).getTime()) >= new Date(this.endDate).getTime())) {
        return false
      }
    }
    return true;
  }
}
