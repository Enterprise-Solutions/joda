import {Component, OnInit} from '@angular/core';

import {Organigrama} from '../interfaces/organigrama.interface';
import {OrganigramaService} from '../services/organigrama.service';
import {ArbolOrganigramaComponent} from './arbol-organigrama.component';

import {NotificationComponent} from "../../../utils/notification/components/notification.component";
import {Notification} from "../../../utils/notification/interfaces/notification.interface";

@Component({
    providers: [OrganigramaService],
    directives: [ArbolOrganigramaComponent, NotificationComponent],
    template: require('./templates/visualizar-organigrama.template.html'),
    styleUrls: ['assets/stylesheets/app/organigramas/arbol.css']
})

export class VisualizarOrganigramaComponent implements OnInit {
    public organigramas;
    public organigramaSeleccionadoId;

    public organigrama: Organigrama;

    public verNotificacion: boolean;
    public notificacion: Notification;
    public loadingData: boolean;

    closeNotification(event: any) {
        this.verNotificacion = false;
    }

    constructor(
        private _organigramaService: OrganigramaService) { }

    ngOnInit() {
        this.notificacion = new Notification();
        this.getOrganigramas();
    }

    getOrganigramas() {
        this._organigramaService.getOrganigramas()
            .subscribe(
                respuesta => {
                    this.organigramas = respuesta;
                    // ANGLO Seleccionado por defecto
                    this.organigramaSeleccionadoId = this.organigramas[0].id;
                    this.getOrganigrama();
                },
                err => console.log('ERROR: ' + err),
                () => console.log("Listar Organigrama Complete")
            );
    }

    getOrganigrama() {
        this._organigramaService.getOrganigramaDeParte(this.organigramaSeleccionadoId)
            .subscribe(
                respuesta => {
                    this.organigrama = respuesta;
                    this.organigrama.expandido = true;
                    this.organigrama.tipoCaret = 'fa fa-caret-down fa-fw';
                },
                err => console.log("ERROR: " + err),
                () => console.log("Obtener Organigrama Complete")
            );
    }

    eliminarNodo(parte: any) {
        // No se puede eliminar el NODO raiz
        this.verNotificacion = true;
                    this.notificacion.status = 'error';
                    this.notificacion.message = "No se puede eliminar el nodo raiz";
                    setTimeout(() => {
                       //this.closeNotification();
                    }, 1200);
    }

    onChange(newValue) {
        //console.log("Cambiar estado a " + newValue);
        //console.log(newValue);
        this.organigramaSeleccionadoId = newValue;
        this.getOrganigrama();
    }

    /*toggle() {
        this.organigrama.expandido = !this.organigrama.expandido;
        this.setTipoCaret();
    }

    setTipoCaret() {
        if (this.organigrama.expandido) {
            this.organigrama.tipoCaret = 'fa fa-caret-down fa-fw';
        } else {
            this.organigrama.tipoCaret = 'fa fa-caret-right fa-fw';
        }
    }*/
}