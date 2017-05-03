import {Component} from '@angular/core';
import {RouteConfig, RouterOutlet, ROUTER_DIRECTIVES, RouterLink} from '@angular/router-deprecated';

import {ListarMarcacionesComponent} from './components/listar-marcaciones.component';
// import {CrearCajaComponent} from './components/crear-caja.component';
// import {EditarCajaComponent} from './components/editar-caja.component';

//import {ListarTalonariosComponent} from './components/talonarios/components/listar-talonarios.component';
//import {MedioPagosComponent} from './components/medios-pagos/components/medios-pago.component';

@Component({
    directives: [RouterOutlet, ROUTER_DIRECTIVES],
    template: '<router-outlet></router-outlet>'
})

@RouteConfig([
    { path: '/listar', name: 'ListarMarcacionesComponent', component: ListarMarcacionesComponent, useAsDefault: true }
    // { path: '/crear', name: 'CrearCajaComponent', component: CrearCajaComponent },
    // { path: '/:caja_id/editar', name: 'EditarCajaComponent', component: EditarCajaComponent },
    //
    // // Talonarios
    // { path: '/:caja_id/talonarios', name: 'ListarTalonariosComponent', component: ListarTalonariosComponent },
    // //Medios de Pago
    // { path: '/:caja_id/medios-pagos', name: 'MedioPagosComponent', component: MedioPagosComponent }
])

export class MarcacionesComponent { }