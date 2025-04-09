import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { registerLocaleData, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { SharedModule } from './shared/shared.module';
import localeEs from '@angular/common/locales/es';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage-angular';
import { RecaptchaModule } from 'ng-recaptcha';

registerLocaleData(localeEs);

@NgModule({

  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    RecaptchaModule,
    IonicStorageModule.forRoot()
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-MX' }, // Proveedor para el locale español
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },// Proveedor para la estrategia de reutilización de rutas
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    SocialSharing
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
