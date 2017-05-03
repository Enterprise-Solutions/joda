import {Component, OnInit} from '@angular/core';
import {RouteParams, Router} from '@angular/router-deprecated';

import {DocumentosComponent} from '../../../../documentos/components/documentos.component';
import {PersonaService} from '../../../services/persona.service';

import {Persona} from '../../../interfaces/persona.interface';

@Component({
    template: require('./templates/documentos-persona.template.html'),
    directives: [DocumentosComponent],
    providers: [PersonaService]
})

export class DocumentosPersonaComponent implements OnInit {
    public persona_id: number;
    public persona: Persona;

    // Tabs
    public tabs: Array<any> = [
        {id: 1, title: 'Datos Generales',  active: false},
        {id: 2, title: 'Documentos',  active: true},
        {id: 3, title: 'Direcciones',  active: false},
        {id: 4, title: 'Contactos',  active: false}
    ];

    gotoTab(tab: any) {
        switch (tab.id) {
            case 1:
                this._router.navigate(['EditarPersonaComponent', {id: this.persona_id}]);
                break;
            case 2:
                this._router.navigate(['DocumentosPersonaComponent', {id: this.persona_id}]);
                break;
            case 3:
                this._router.navigate(['DireccionesPersonaComponent', {id: this.persona_id}]);
                break;
            case 4:
                this._router.navigate(['ContactosPersonaComponent', {id: this.persona_id}]);
                break;
            default: break;
        }
    }

    constructor(
        private _router: Router,
        private _routeParams: RouteParams,
        private _personasService: PersonaService) { }

    ngOnInit() {
        this.persona_id = +this._routeParams.get('id');
        this.getPersona();
    }

    getPersona() {
        this._personasService.getPersona(this.persona_id)
            .subscribe(
                response => {
                    this.persona = response;
                },
                err => console.log("ERROR: " + err),
                () => console.log("GET Persona Complete")
            );
    }
}