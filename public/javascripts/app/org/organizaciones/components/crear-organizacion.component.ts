import {Component} from '@angular/core';
import {Router} from '@angular/router-deprecated';

import {CrearOrganizacionFormComponent} from './crear-organizacion-form.component';

@Component({
    template: require('./templates/crear-organizacion.template.html'),
    directives: [CrearOrganizacionFormComponent]
})

export class CrearOrganizacionComponent {
    constructor(private _router: Router) { }

    listarOrganizacion() {
        this._router.navigate(['ListarOrganizacionComponent']);
    }
}