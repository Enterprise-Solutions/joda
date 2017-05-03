import {Component} from '@angular/core';
import {Router} from '@angular/router-deprecated';

import {CrearPersonaFormComponent} from './crear-persona-form.component';

@Component({
    template: require('./templates/crear-persona.template.html'),
    directives: [CrearPersonaFormComponent]
})

export class CrearPersonaComponent {
    constructor(private _router: Router) { }

    listarPersona() {
        this._router.navigate(['ListarPersonaComponent']);
    }
}