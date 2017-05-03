import {Component} from '@angular/core';
import {Router, RouteConfig, RouterOutlet} from '@angular/router-deprecated';
import {ListarRolesComponent} from "./components/listar-roles.component";
import {CrearRolComponent} from "./components/crear-rol.component";
import {EditarRolComponent} from "./components/editar-rol.component";


@Component({
    directives: [RouterOutlet],
    template: '<router-outlet></router-outlet>'
})

@RouteConfig([
    { path: '/listar', name: 'ListarRolesComponent', component: ListarRolesComponent, useAsDefault: true },
    { path: '/crear', name: 'CrearRolComponent', component: CrearRolComponent},
    { path: '/:idRol/editar', name: 'EditarRolComponent', component: EditarRolComponent },
])

export class RolesComponent {
    constructor(private _router: Router) { }
}