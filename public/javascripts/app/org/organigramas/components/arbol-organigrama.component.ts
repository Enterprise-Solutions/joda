import {Component, OnInit, EventEmitter} from '@angular/core';
import {Router, ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import {Organigrama} from './../interfaces/organigrama.interface';
import {TiposOrganigrama} from './../interfaces/tipos-organigrama.interface';
import {OrganigramaService} from './../services/organigrama.service';

import {NotificationComponent} from "../../../utils/notification/components/notification.component";
import {Notification} from "../../../utils/notification/interfaces/notification.interface";

@Component({
    providers: [OrganigramaService],
    directives: [ROUTER_DIRECTIVES, ArbolOrganigramaComponent,NotificationComponent],
    inputs: ['organigrama', 'padreId'],
    outputs: ['agregame', 'guardame', 'eliminame', 'cancelame'],
    selector: 'arbol-organigrama',
    template: require('./templates/arbol-organigrama.template.html'),
    styleUrls: ['assets/stylesheets/app/organigramas/arbol.css']
})

export class ArbolOrganigramaComponent implements OnInit {
    public organigrama: Organigrama;
    public nuevaParte: Organigrama;
    public padreId;

    public tiposOrganigrama: TiposOrganigrama[];
    public tipoSelected: string;

    public subPartesDisponibles;
    public subParteSelected: string;

    public agregame = new EventEmitter();
    public guardame = new EventEmitter();
    public cancelame = new EventEmitter();
    public eliminame = new EventEmitter();

    // Componente Notificacion
    public verNotificacion: boolean;
    public notificacion: Notification;
    public loadingData: boolean;

    closeNotification(event: any) {
        this.verNotificacion = false;
    }

    constructor(
        private _router: Router,
        private _organigramaService: OrganigramaService) { }

    ngOnInit() {
        this.organigrama.expandido = true;
        this.notificacion = new Notification();

        if (!this.organigrama.org_organigrama_parte_id && !isNaN(parseInt(this.padreId))) {
            this.tipoSelected = undefined;
            this.subParteSelected = undefined;

            this.getTiposSubParte();
            this.getSubPartesDisponibles();
        }

        for (var i=0; i<this.organigrama.partes.length; i++) {
            this.organigrama.partes[i].expandido = true;
            this.organigrama.partes[i].tipoCaret = 'fa fa-caret-down fa-fw';
        }
    }

    toggle() {
        this.organigrama.expandido = !this.organigrama.expandido;
        this.setTipoCaret();
    }

    setTipoCaret() {
        if (this.organigrama.expandido) {
            this.organigrama.tipoCaret = 'fa fa-caret-down fa-fw';
        } else {
            this.organigrama.tipoCaret = 'fa fa-caret-right fa-fw';
        }
    }

    getSubPartesDisponibles() {
        this._organigramaService.getSubPartesDisponibles(this.organigrama.org_organigrama_id, this.padreId)
            .subscribe(
                subPartesDisponibles => this.subPartesDisponibles = subPartesDisponibles,
                err => console.log("ERROR: " + err),
                () => console.log("GET SubPartes Complete")
            );
    }

    getTiposSubParte() {
        this._organigramaService.getTiposDeSubParte(this.padreId, this.organigrama.org_organigrama_id)
            .subscribe(
                tipos => this.tiposOrganigrama = tipos,
                err => console.log("ERROR: " + err),
                () => console.log("GET Tipos Complete")
            );
    }

    agregarNodo() {
        this.organigrama.expandido = true;
        this.setTipoCaret();

        this.nuevaParte = new Organigrama();
        this.nuevaParte.org_organigrama_id = this.organigrama.org_organigrama_id;
        this.nuevaParte.expandido = false;
        this.nuevaParte.tipoCaret = 'fa fa-caret-right fa-fw';
        this.nuevaParte.es_editable = true;

        this.organigrama.partes.push(this.nuevaParte);
    }

    editarNodo() {
        console.log(this.organigrama.id);
        this._router.navigate(['EditarOrganigramaComponent', { org_id: +this.organigrama.org_organigrama_id, id: +this.organigrama.id }]);
    }

    guardarNodo(parte: any) {
        var data = {
            nombre: parte.nombre,
            tipo: parte.tipo,
            descripcion: parte.descripcion
        };

        var jsonData = JSON.stringify(data);

        this._organigramaService.agregarParte(this.organigrama.id, this.organigrama.org_organigrama_id, jsonData)
            .subscribe(
                response => {
                    this.verNotificacion = true;
                    this.notificacion.status =  'success';
                    this.notificacion.message = 'Dependencia agregada con éxito';
                    setTimeout(() => {
                    }, 1200);

                    this.nuevaParte = response;
                    this.nuevaParte.org_organigrama_id = this.organigrama.org_organigrama_id;
                    this.nuevaParte.es_editable = false;
                    this.nuevaParte.expandido = false;
                    this.nuevaParte.tipoCaret = 'fa fa-caret-right fa-fw';
                    this.nuevaParte.partes = [];

                    this.organigrama.partes.pop();
                    this.organigrama.partes.push(this.nuevaParte);
                },
                err => {
                    console.log("ERROR: " + err);
                    this.verNotificacion = true;
                    this.notificacion.status = 'error';
                    this.notificacion.message =  err._body;
                },
                () => console.log("Parte Agregada al Organigrama")
            );
    }

    agregarSubParte(id: number) {
        var data = { id: id };
        var jsonData = JSON.stringify(data);

        this._organigramaService.agregarSubParte(this.organigrama.id, this.organigrama.org_organigrama_id, jsonData)
            .subscribe(
                response => {
                    this.verNotificacion = true;
                    this.notificacion.status =  'success';
                    this.notificacion.message = 'Dependencia agregada con éxito';
                    setTimeout(() => {
                    }, 1200);
                    this.nuevaParte = response;
                    this.nuevaParte.org_organigrama_id = this.organigrama.org_organigrama_id;
                    this.nuevaParte.es_editable = false;
                    this.nuevaParte.expandido = false;
                    this.nuevaParte.tipoCaret = 'fa fa-caret-right fa-fw';
                    this.nuevaParte.partes = [];

                    this.organigrama.partes.pop();
                    this.organigrama.partes.push(this.nuevaParte);
                },
                err =>{
                    this.verNotificacion = true;
                    this.notificacion.status = 'error';
                    this.notificacion.message =  err._body;
                    console.log("ERROR: " + err);
                },
                () => console.log("SubParte Agregada al Organigrama")
            );
    }

    cancelarNodo(parte: any) {
        let index = this.organigrama.partes.indexOf(parte);
        this.organigrama.partes.splice(index, 1);
    }

    eliminarNodo(parte: any) {
        let index = this.organigrama.partes.indexOf(parte);
        this._organigramaService.eliminarParte(parte.id, parte.org_organigrama_id)
            .subscribe(
                response => {
                    this.verNotificacion = true;
                    this.notificacion.status =  'success';
                    this.notificacion.message = 'Dependencia eliminada con éxito';
                    setTimeout(() => {
                    }, 1200);
                    var respuesta = response;
                    this.organigrama.partes.splice(index, 1);
                },
                err =>{
                    this.verNotificacion = true;
                    this.notificacion.status = 'error';
                    this.notificacion.message =  err._body;
                    setTimeout(() => {
                       //this.closeNotification();
                    }, 1200);
                    // console.log("ERROR: " +  JSON.stringify(err));
                    // console.log(err);
                    // console.log(err.message);
                    // console.log(err._body);
                },
                () => console.log("Parte Eliminada de Organigrama")
            );
    }

    agregarme() {
        var id = parseInt(this.subParteSelected);
        this.agregame.next(id);
    }

    guardarme() {
        this.organigrama.tipo = this.tipoSelected;
        this.guardame.next(this.organigrama);
    }

    cancelarme() {
        this.cancelame.next(this.organigrama);
    }

    eliminarme() {
        this.eliminame.next(this.organigrama);
    }
}