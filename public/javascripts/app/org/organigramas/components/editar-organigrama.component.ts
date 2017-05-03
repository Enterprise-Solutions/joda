import {Component, OnInit} from '@angular/core';
import {RouteParams, Router} from '@angular/router-deprecated';

import {OrganigramaService} from '../services/organigrama.service';

import {Organigrama} from '../interfaces/organigrama.interface';
import {TiposOrganigrama} from '../interfaces/tipos-organigrama.interface';

import {NotificationComponent} from "../../../utils/notification/components/notification.component";
import {Notification} from "../../../utils/notification/interfaces/notification.interface";

@Component({
    providers: [OrganigramaService],
    directives: [NotificationComponent],
    template: require('./templates/editar-organigrama.template.html')
})

export class EditarOrganigramaComponent implements OnInit{
    public organigrama: Organigrama;
    public tiposOrganigrama: TiposOrganigrama[];
    public idOrganigrama: number;
    public idParte: number;

    public tipoSelected: string;

    public verNotificacion: boolean;
    public notificacion: Notification;
    public loadingData: boolean;

    closeNotification(event: any) {
        this.verNotificacion = false;
    }

    constructor(
        private _router: Router,
        private _routeParams: RouteParams,
        private _organigramaService: OrganigramaService) { }

    ngOnInit() {
        this.notificacion = new Notification();
        this.idOrganigrama = +this._routeParams.get('org_id');
        this.idParte = +this._routeParams.get('id');

        this.getParteOrganigrama(this.idOrganigrama, this.idParte);
    }

    getParteOrganigrama(org_organigrama_id, id) {
        this.loadingData = true;
        this._organigramaService.getParte(org_organigrama_id, id)
            .subscribe(
                organigrama => {
                    this.getTiposDeParte(this.idOrganigrama, this.idParte);
                    this.organigrama = organigrama;
                    this.tipoSelected = this.organigrama.tipo;
                },
                err => console.log("ERROR: " + err),
                () =>  console.log("GET Organigrama Complete")
            );
    }

    getTiposDeParte(org_organigrama_id, id) {
        this._organigramaService.getTiposDeParte(org_organigrama_id, id)
            .subscribe(
                tipos => { 
                    this.loadingData = false;
                    this.tiposOrganigrama = tipos; 
                },
                err => console.log("ERROR: " + err),
                () =>  console.log("GET Tipos Org Complete")
            );
    }

    editarOrganigrama() {
        var data = {
            nombre: this.organigrama.nombre,
            tipo: this.tipoSelected,
            descripcion: this.organigrama.descripcion
        };

        var jsonData = JSON.stringify(data);

        this._organigramaService.editarParte(this.organigrama.id, this.organigrama.org_organigrama_id, jsonData)
            .subscribe(
                organigrama => {
                    console.log(organigrama);
                    this.verNotificacion = true;
                    this.notificacion.status =  'success';
                    this.notificacion.message = 'Organigrama editado con éxito';
                    this.loadingData = true;
                    setTimeout(() => {
                         this.loadingData = false;
                        this._router.navigate(['VisualizarOrganigramaComponent']);
                    }, 800);
                    //this._router.navigate(['VisualizarOrganigramaComponent']);
                },
                err => {
                    console.log("ERROR: " + err)
                    this.verNotificacion = true;
                    this.notificacion.status = 'error';
                    this.notificacion.message =  err._body;
                },
                () =>  console.log("PUT Organigrama Complete")
            );
    }

    listarOrganigrama() {
        this._router.navigate(['VisualizarOrganigramaComponent']);
    }
}