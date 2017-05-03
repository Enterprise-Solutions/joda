import {Component, OnInit} from '@angular/core';
import {RouteParams, Router} from '@angular/router-deprecated';

import {ContactosComponent} from '../../../../contactos/components/contacto.component';
import {OrganizacionService} from '../../../services/organizacion.service';

import {Organizacion} from '../../../interfaces/organizacion.interface';

@Component({
    template: require('./templates/contactos-organizacion.template.html'),
    directives: [ContactosComponent],
    providers: [OrganizacionService]
})

export class ContactosOrganizacionComponent implements OnInit {
    public organizacion_id: number;
    public organizacion: Organizacion;

    // Tabs
    public tabs: Array<any> = [
        {id: 1, title: 'Datos Generales',  active: false},
        {id: 2, title: 'Documentos',  active: false},
        {id: 3, title: 'Direcciones',  active: false},
        {id: 4, title: 'Contactos',  active: true}
    ];

    gotoTab(tab: any) {
        switch (tab.id) {
            case 1:
                this._router.navigate(['EditarOrganizacionComponent', {id: this.organizacion_id}]);
                break;
            case 2:
                this._router.navigate(['DocumentosOrganizacionComponent', {id: this.organizacion_id}]);
                break;
            case 3:
                this._router.navigate(['DireccionesOrganizacionComponent', {id: this.organizacion_id}]);
                break;
            case 4:
                this._router.navigate(['ContactosOrganizacionComponent', {id: this.organizacion_id}]);
                break;
            default: break;
        }
    }

    constructor(
        private _router: Router,
        private _routeParams: RouteParams,
        private _organizacionesService: OrganizacionService) { }

    ngOnInit() {
        this.organizacion_id = +this._routeParams.get('id');
        this.getOrganizacion();
    }

    getOrganizacion() {
        this._organizacionesService.getOrganizacion(this.organizacion_id)
            .subscribe(
                response => {
                    this.organizacion = response;
                },
                err => console.log("ERROR: " + err),
                () => console.log("GET Persona Complete")
            );
    }
}