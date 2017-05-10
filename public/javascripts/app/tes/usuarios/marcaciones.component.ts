import {Component} from '@angular/core';
import {RouteConfig, RouterOutlet, ROUTER_DIRECTIVES, RouterLink} from '@angular/router-deprecated';

import {ListarMarcacionesComponent} from './components/listar-marcaciones.component';
import {CrearUsuarioComponent} from './components/crear_nuevousuario.component';
import {HorasLaburadasComponent} from './components/horas_trabajadas.component';
@Component({
    directives: [RouterOutlet, ROUTER_DIRECTIVES],
    template: '<router-outlet></router-outlet>'
})

@RouteConfig([
    { path: '/listar', name: 'ListarMarcacionesComponent', component: ListarMarcacionesComponent,useAsDefault: true},
    { path : '/crear', name: 'CrearUsuarioComponent', component: CrearUsuarioComponent},
    { path  : '/horastrabajadas', name: 'HorasLaburadasComponent', component: HorasLaburadasComponent}
    
])

export class MarcacionesComponent { }