import {Component, Input, OnInit, ViewChild} from '@angular/core';

import {DireccionesService} from '../services/direcciones.service';

import {Direccion} from '../interfaces/direccion.interface';

import {ModalResult, MODAL_DIRECTIVES} from '../../../utils/ng2-bs3-modal/ng2-bs3-modal';
import {ModalComponent} from "../../../utils/ng2-bs3-modal/components/modal";
import {NotificationComponent} from "../../../utils/notification/components/notification.component";
import {Notification} from "../../../utils/notification/interfaces/notification.interface";

@Component({
    selector: 'direcciones',
    directives: [MODAL_DIRECTIVES, NotificationComponent],
    providers: [DireccionesService],
    template: require('./templates/direcciones.template.html'),
    styles: [`.table th { text-align: center; }`]
})

export class DireccionesComponent implements OnInit {
    @Input() orgParteId: number;

    public editandoDireccion: boolean;
    public utilizandoFormulario: boolean;

    public direcciones: Direccion[];
    public cntDirecciones: number;
    public nuevaDireccion: Direccion;

    public headers = [{
        'descrip': 'Direccion',
        'columna': 'direccion',
        'ordenable': false
    },{
        'descrip': 'Numero',
        'columna': 'numero',
        'ordenable': false
    },{
        'descrip': 'Es Principal',
        'columna': 'es_principal',
        'ordenable': false
    }];

    // Componente Notificacion
    public verNotificacion: boolean;
    public notificacion: Notification;

    closeNotification(event: any) {
        this.verNotificacion = false;
    }

    // Modal
    public animationsEnabled: boolean = true;

    @ViewChild('modal')
    public modal: ModalComponent;

    onClose(result: ModalResult) {
        this.editandoDireccion = false;
        this.utilizandoFormulario = false;
        this.getDireccionesParte();
    }

    constructor(
        private _direccionService: DireccionesService) { }

    ngOnInit() {
        this.notificacion = new Notification();
        this.nuevaDireccion = new Direccion();
        this.getDireccionesParte();
    }

    getDireccionesParte() {
        this._direccionService.getDirecciones(this.orgParteId)
            .subscribe(
                response => {
                    this.direcciones = response;
                    this.cntDirecciones = this.direcciones.length;
                },
                err => console.log("ERROR: " + err),
                () => console.log("GET Direcciones Complete")
            );
    }

    cerrarFormulario() {
        this.modal.close();
    }

    agregarDireccion() {
        this.utilizandoFormulario = true;
        this.nuevaDireccion = new Direccion();
        this.nuevaDireccion.es_principal = false;
        this.modal.open();
    }

    getDireccion(direccion: Direccion) {
        this.editandoDireccion = true;
        this.utilizandoFormulario = true;
        this.nuevaDireccion = direccion;
        this.modal.open();
    }

    onSubmit() {
        let jsonData: string;

        jsonData = JSON.stringify(this.nuevaDireccion);

        if (this.editandoDireccion) {
            this.editarDireccion(jsonData);
        } else {
            this.crearDireccion(jsonData);
        }
    }

    crearDireccion(jsonData: string) {
        this._direccionService.crearDireccion(this.orgParteId, jsonData)
            .subscribe(
                response => {
                    this.verNotificacion = true;
                    this.notificacion.status = 'success';
                    this.notificacion.message = 'Direccion creada exitosamente!';

                    this.modal.close();
                },
                err => {
                    console.log("ERROR: " + err);

                    this.verNotificacion = true;
                    this.notificacion.status = 'error';
                    this.notificacion.message = err._body;
                },
                () => console.log("POST Direccion Complete")
            );
    }

    editarDireccion(jsonData: string) {
        this._direccionService.editarDirecciones(this.orgParteId, this.nuevaDireccion.id, jsonData)
            .subscribe(
                response => {
                    this.verNotificacion = true;
                    this.notificacion.status = 'success';
                    this.notificacion.message = 'Direccion editada exitosamente!';

                    this.modal.close();
                },
                err => {
                    console.log("ERROR: " + err);

                    this.verNotificacion = true;
                    this.notificacion.status = 'error';
                    this.notificacion.message = err._body;
                },
                () => console.log("PUT Direccion Complete")
            );
    }

    eliminarDireccion(direccion: Direccion) {
        let dialog = confirm("Esta seguro? Esta accion no se puede deshacer.");

        if (dialog) {
            this._direccionService.borrarDireccion(this.orgParteId, direccion.id)
                .subscribe(
                    response => {
                        this.verNotificacion = true;
                        this.notificacion.status = 'success';
                        this.notificacion.message = 'Direccion borrada exitosamente!';

                        this.getDireccionesParte();
                    },
                    err => {
                        console.log("ERROR: " + err);

                        this.verNotificacion = true;
                        this.notificacion.status = 'error';
                        this.notificacion.message = err._body;
                    },
                    () => console.log("DELETE Direccion Complete")
                );
        }
    }
}