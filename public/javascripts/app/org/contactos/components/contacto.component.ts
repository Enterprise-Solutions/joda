import {Component, Input, OnInit, ViewChild} from '@angular/core';

import {ContactoService} from '../services/contacto.service';

import {Contacto} from '../interfaces/contacto.interface';
import {ContactoTipo} from '../interfaces/contacto-tipo.interface';

import {ModalResult, MODAL_DIRECTIVES} from '../../../utils/ng2-bs3-modal/ng2-bs3-modal';
import {ModalComponent} from "../../../utils/ng2-bs3-modal/components/modal";
import {NotificationComponent} from "../../../utils/notification/components/notification.component";
import {Notification} from "../../../utils/notification/interfaces/notification.interface";

@Component({
    selector: 'contactos',
    directives: [MODAL_DIRECTIVES, NotificationComponent],
    providers: [ContactoService],
    template: require('./templates/contactos.template.html'),
    styles: [`.table th { text-align: center; }`]
})

export class ContactosComponent implements OnInit {
    @Input() orgParteId: number;

    public editandoContacto: boolean;
    public utilizandoFormulario: boolean;

    public contactos: Contacto[];
    public cntContactos: number;
    public tiposContacto: ContactoTipo[];
    public nuevoContacto: Contacto;

    public headers = [{
        'descrip': 'Tipo',
        'columna': 'org_contacto_tipo_id',
        'ordenable': false
    },{
        'descrip': 'Contacto',
        'columna': 'contacto',
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
        this.editandoContacto = false;
        this.utilizandoFormulario = false;
        this.getContactosParte();
    }

    constructor(
        private _contactoService: ContactoService) { }

    ngOnInit() {
        this.notificacion = new Notification();
        this.nuevoContacto = new Contacto();
        this.getContactosParte();
    }

    getContactosParte() {
        this._contactoService.getContactosParte(this.orgParteId)
            .subscribe(
                response => {
                    this.contactos = response.rows;
                    this.cntContactos = response.total;
                },
                err => console.log("ERROR: " + err),
                () => console.log("GET Contactos Complete")
            );
    }

    getTiposContacto(contacto: Contacto = null) {
        this._contactoService.getTiposContacto()
            .subscribe(
                response => {
                    if (contacto == null) {
                        this.nuevoContacto = new Contacto();
                    } else {
                        this.nuevoContacto = contacto;
                    }

                    this.tiposContacto = response.rows;
                    this.utilizandoFormulario = true;
                    this.modal.open();
                },
                err => console.log("ERROR: " + err),
                () => console.log("GET Tipos Contacto Complete")
            );
    }

    cerrarFormulario() {
        this.modal.close();
    }

    agregarContacto() {
        this.getTiposContacto();
    }

    getContacto(contacto: Contacto) {
        this.editandoContacto = true;
        this.getTiposContacto(contacto);
    }

    onSubmit() {
        let jsonData: string;

        jsonData = JSON.stringify(this.nuevoContacto);

        if (this.editandoContacto) {
            this.editarContacto(jsonData);
        } else {
            this.crearContacto(jsonData);
        }
    }

    crearContacto(jsonData: string) {
        this._contactoService.crearContacto(this.orgParteId, jsonData)
            .subscribe(
                response => {
                    this.verNotificacion = true;
                    this.notificacion.status = 'success';
                    this.notificacion.message = 'Contacto creado exitosamente!';

                    this.modal.close();
                },
                err => {
                    console.log("ERROR: " + err);

                    this.verNotificacion = true;
                    this.notificacion.status = 'error';
                    this.notificacion.message = err._body;
                },
                () => console.log("POST Contacto Complete")
            );
    }

    editarContacto(jsonData: string) {
        this._contactoService.editarContacto(this.orgParteId, this.nuevoContacto.id, jsonData)
            .subscribe(
                response => {
                    this.verNotificacion = true;
                    this.notificacion.status = 'success';
                    this.notificacion.message = 'Contacto editado exitosamente!';

                    this.modal.close();
                },
                err => {
                    console.log("ERROR: " + err);

                    this.verNotificacion = true;
                    this.notificacion.status = 'error';
                    this.notificacion.message = err._body;
                },
                () => console.log("PUT Contacto Complete")
            );
    }

    eliminarContacto(contacto: Contacto) {
        let dialog = confirm("Esta seguro? Esta accion no se puede deshacer.");

        if (dialog) {
            this._contactoService.borrarContacto(this.orgParteId, contacto.id)
                .subscribe(
                    response => {
                        this.verNotificacion = true;
                        this.notificacion.status = 'success';
                        this.notificacion.message = 'Contacto borrado exitosamente!';

                        this.getContactosParte();
                    },
                    err => {
                        console.log("ERROR: " + err);

                        this.verNotificacion = true;
                        this.notificacion.status = 'error';
                        this.notificacion.message = err._body;
                    },
                    () => console.log("DELETE Contacto Complete")
                );
        }
    }
}