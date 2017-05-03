import {Component} from '@angular/core';
import {Router, RouteConfig, RouterOutlet} from '@angular/router-deprecated';

// Funcionalidades
import {ListarOrganigramaComponent} from './components/listar-organigrama.component';
import {VisualizarOrganigramaComponent} from './components/visualizar-organigrama.component';
import {EditarOrganigramaComponent} from './components/editar-organigrama.component';

@Component({
    directives: [RouterOutlet],
    template: '<router-outlet></router-outlet>'
})

@RouteConfig([
    { path: '/listar', name: 'ListarOrganigramaComponent', component: ListarOrganigramaComponent },
    { path: '/visualizar', name: 'VisualizarOrganigramaComponent', component: VisualizarOrganigramaComponent, useAsDefault: true },
    { path: ':org_id/editar/:id', name: 'EditarOrganigramaComponent', component: EditarOrganigramaComponent }
])

export class OrganigramasComponent {
    constructor(private _router: Router) { }

}