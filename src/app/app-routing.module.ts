import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./Clients/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./Menus/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./Menus/welcome/welcome.module').then(m => m.WelcomePageModule)
  },
  {
    path: 'regsitro',
    loadChildren: () => import('./Menus/regsitro/regsitro.module').then(m => m.RegsitroPageModule)
  },
  {

    path: 'reportes',
    loadChildren: () => import('./Clients/reportes/reportes.module').then(m => m.ReportesPageModule)
  },
  {
    path: 'movimientos',
    loadChildren: () => import('./Clients/movimientos/movimientos.module').then(m => m.MovimientosPageModule)
  },
  {
    path: 'ayuda',
    loadChildren: () => import('./Clients/ayuda/ayuda.module').then(m => m.AyudaPageModule)
  },
  {
    path: 'card-menu',
    loadChildren: () => import('../components/card-menu/card-menu.component').then(m => m.CardMenuComponent)
  },
  {
    path: 'home-admin',
    loadChildren: () => import('./Admin/home-admin/home-admin.module').then( m => m.HomeAdminPageModule)
  },
  {
    path: 'perfil-usuario',
    loadChildren: () => import('./Clients/perfil-usuario/perfil-usuario.module').then( m => m.PerfilUsuarioPageModule)
  },
  {
    path: 'admin-ventas',
    loadChildren: () => import('./Admin/admin-ventas/admin-ventas.module').then( m => m.AdminVentasPageModule)
  },
  {
    path: 'admin-recargas',
    loadChildren: () => import('./Admin/admin-recargas/admin-recargas.module').then( m => m.AdminRecargasPageModule)
  },
  {
    path: 'admin-usuarios',
    loadChildren: () => import('./Admin/admin-usuarios/admin-usuarios.module').then( m => m.AdminUsuariosPageModule)
  },
  {
    path: 'servicios',
    loadChildren: () => import('./Clients/servicios/servicios.module').then( m => m.ServiciosPageModule)
  },
  {
    path: 'admin-reportes',
    loadChildren: () => import('./Admin/admin-reportes/admin-reportes.module').then( m => m.AdminReportesPageModule)
  },
  {
    path: 'admin-servicios',
    loadChildren: () => import('./Admin/admin-servicios/admin-servicios.module').then( m => m.AdminServiciosPageModule)
  },
  {
    path: 'adminprofit',
    loadChildren: () => import('./Admin/adminprofit/adminprofit.module').then( m => m.AdminprofitPageModule)
  },
  {
    path: 'admin-subida-excel',
    loadChildren: () => import('./Admin/admin-subida-excel/admin-subida-excel.module').then( m => m.AdminSubidaExcelPageModule)
  },
  {
    path: 'reportes-ver',
    loadChildren: () => import('./Clients/reportes-ver/reportes-ver.module').then( m => m.ReportesVerPageModule)
  },
  {
    path: 'reportes-ver-info',
    loadChildren: () => import('./Clients/reportes-ver-info/reportes-ver-info.module').then( m => m.ReportesVerInfoPageModule)
  },
  {
    path: 'vista-reportes-usuario',
    loadChildren: () => import('./Clients/vista-reportes-usuario/vista-reportes-usuario.module').then( m => m.VistaReportesUsuarioPageModule)
  },
  {
    path: 'reportes-admin',
    loadChildren: () => import('./Admin/reportes-admin/reportes-admin.module').then( m => m.ReportesAdminPageModule)
  },
  {
    path: 'servicios-admin',
    loadChildren: () => import('./Admin/servicios-admin/servicios-admin.module').then( m => m.ServiciosAdminPageModule)
  },
  {
    path: 'editar-servicio',
    loadChildren: () => import('./Admin/editar-servicio/editar-servicio.module').then( m => m.EditarServicioPageModule)
  },
  {
    path: 'renovar',
    loadChildren: () => import('./Clients/renovar/renovar.module').then( m => m.RenovarPageModule)
  },
  {
    path: 'ver-movimiento',
    loadChildren: () => import('./Clients/ver-movimiento/ver-movimiento.module').then( m => m.VerMovimientoPageModule)
  },
  {
    path: 'cuentas',
    loadChildren: () => import('./Admin/cuentas/cuentas.module').then( m => m.CuentasPageModule)
  },
  {
    path: 'politica-privacidad',
    loadChildren: () => import('./Menus/politica-privacidad/politica-privacidad.module').then( m => m.PoliticaPrivacidadPageModule)
  },
  {
    path: 'sub-admin',
    loadChildren: () => import('./Admin/sub-admin/sub-admin.module').then( m => m.SubAdminPageModule)
  },
  {
    path: 'sub-admin-movimientos',
    loadChildren: () => import('./Admin/sub-admin-movimientos/sub-admin-movimientos.module').then( m => m.SubAdminMovimientosPageModule)
  },
  {
    path: 'detalle-movimientos-subadmin',
    loadChildren: () => import('./Admin/detalle-movimientos-subadmin/detalle-movimientos-subadmin.module').then( m => m.DetalleMovimientosSubadminPageModule)
  },
  {
    path: 'admin-cuentas-bot',
    loadChildren: () => import('./Admin/admin-cuentas-bot/admin-cuentas-bot.module').then( m => m.AdminCuentasBotPageModule)
  },
  {
    path: 'tickets',
    loadChildren: () => import('./Admin/tickets/tickets.module').then( m => m.TicketsPageModule)
  },
  {
    path: 'categoria-servicio',
    loadChildren: () => import('./Admin/categoria-servicio/categoria-servicio.module').then( m => m.CategoriaServicioPageModule)
  },
  {
    path: 'comprar-creditos',
    loadChildren: () => import('./Clients/comprar-creditos/comprar-creditos.module').then( m => m.ComprarCreditosPageModule)
  },
  {
    path: 'pago-aprobado',
    loadChildren: () => import('./Clients/pago-aprobado/pago-aprobado.module').then( m => m.PagoAprobadoPageModule)
  },
  {
    path: 'error-pago',
    loadChildren: () => import('./Clients/error-pago/error-pago.module').then( m => m.ErrorPagoPageModule)
  },
  {
    path: 'pago-pendiente',
    loadChildren: () => import('./Clients/pago-pendiente/pago-pendiente.module').then( m => m.PagoPendientePageModule)
  },
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
