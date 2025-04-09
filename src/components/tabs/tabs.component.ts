import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importa Router de Angular
import { SharedDataService } from 'src/app/shared-data.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {

  constructor(
    private router: Router,
    public sharedDataServices : SharedDataService) { } // Inyecta el Router aquí

  ngOnInit() {}

  irUsuario() {
    this.router.navigate(['/perfil-usuario']); // Utiliza el router para navegar
  }

  irHome() {
    this.router.navigate(['/home']); // Utiliza el router para navegar
  }
  WhatsAppMessage(){
    const url = `https://api.whatsapp.com/send?phone=526381561969&text`;

    // Abrir la URL en una nueva pestaña o ventana
    window.open(url);
  }
}
