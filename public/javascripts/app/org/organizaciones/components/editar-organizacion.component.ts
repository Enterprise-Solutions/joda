import {Component, OnInit} from '@angular/core';
import {RouteParams, Router} from '@angular/router-deprecated';

import {OrganizacionService} from '../services/organizacion.service';
import {Organizacion} from '../interfaces/organizacion.interface';

import {Notification} from "../../../utils/notification/interfaces/notification.interface";
import {NotificationComponent} from "../../../utils/notification/components/notification.component";

@Component({
    providers: [OrganizacionService],
    directives: [NotificationComponent],
    template: require('./templates/editar-organizacion.template.html')
})

export class EditarOrganizacionComponent implements OnInit {
    public organizacion: Organizacion;

    // Tabs
    public tabs: Array<any> = [
        {id: 1, title: 'Datos Generales',  active: true},
        {id: 2, title: 'Documentos',  active: false},
        {id: 3, title: 'Direcciones',  active: false},
        {id: 4, title: 'Contactos',  active: false}
    ];

    gotoTab(tab: any) {
        switch (tab.id) {
            case 1:
                this._router.navigate(['EditarOrganizacionComponent', {id: this.organizacion.id}]);
                break;
            case 2:
                this._router.navigate(['DocumentosOrganizacionComponent', {id: this.organizacion.id}]);
                break;
            case 3:
                this._router.navigate(['DireccionesOrganizacionComponent', {id: this.organizacion.id}]);
                break;
            case 4:
                this._router.navigate(['ContactosOrganizacionComponent', {id: this.organizacion.id}]);
                break;
            default: break;
        }
    }

    // Componente Notificacion
    public verNotificacion: boolean;
    public notificacion: Notification;

    closeNotification(event: any) {
        this.verNotificacion = false;
    }

    constructor(
        private _router: Router,
        private _routeParams: RouteParams,
        private _organizacionService: OrganizacionService) { }

    ngOnInit() {
        this.notificacion = new Notification();
        let id = this._routeParams.get('id');

        this._organizacionService.getOrganizacion(id)
            .subscribe(
                response => {
                    this.organizacion = response;
                },
                err => console.log("ERROR: " + err),
                () =>  console.log("GET Organizacion Complete")
            );
    }

    onSubmit() {
        var jsonData: string;
        jsonData = JSON.stringify(this.organizacion);
        this.editarOrganizacion(jsonData);
    }

    editarOrganizacion(jsonData: string) {
        this._organizacionService.editarOrganizacion(this.organizacion.id, jsonData)
            .subscribe(
                response => {
                    this.verNotificacion = true;
                    this.notificacion.status =  'success';
                    this.notificacion.message = 'Organizacion editada exitosamente!';

                    setTimeout(() => { this.listarOrganizaciones(); }, 500);
                },
                err => {
                    console.log("ERROR: " + err);

                    this.verNotificacion = true;
                    this.notificacion.status = 'error';
                    this.notificacion.message =  err._body;
                },
                () =>  console.log("PUT Organizacion Complete")
            );
    }

    listarOrganizaciones() {
        this._router.navigate(['ListarOrganizacionComponent']);
    }
}