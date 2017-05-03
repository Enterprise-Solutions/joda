import {Component, Input, OnInit, ViewChild} from '@angular/core';

import {DocumentosService} from '../services/documentos.service';

import {Documento} from '../interfaces/documento.interface';
import {DocumentoTipo} from '../interfaces/documento-tipo.interface';

import {ModalResult, MODAL_DIRECTIVES} from '../../../utils/ng2-bs3-modal/ng2-bs3-modal';
import {ModalComponent} from "../../../utils/ng2-bs3-modal/components/modal";
import {NotificationComponent} from "../../../utils/notification/components/notification.component";
import {Notification} from "../../../utils/notification/interfaces/notification.interface";

@Component({
    selector: 'documentos',
    directives: [MODAL_DIRECTIVES, NotificationComponent],
    providers: [DocumentosService],
    template: require('./templates/documentos.template.html'),
    styles: [`.table th { text-align: center; }`]
})

export class DocumentosComponent implements OnInit {
    @Input() orgParteId: number;

    public editandoDocumento: boolean;
    public utilizandoFormulario: boolean;

    public documentos: Documento[];
    public tiposDocumento: DocumentoTipo[];
    public nuevoDocumento: Documento;

    public headers = [{
        'descrip': 'Tipo',
        'columna': 'tipo',
        'ordenable': false
    },{
        'descrip': 'Documento',
        'columna': 'documento',
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
        this.editandoDocumento = false;
        this.utilizandoFormulario = false;
        this.getDocumentosParte();

    }

    constructor(
        private _documentoService: DocumentosService) { }

    ngOnInit() {
        this.notificacion = new Notification();
        this.nuevoDocumento = new Documento();
        this.getDocumentosParte();
	}

    getDocumentosParte() {
        this._documentoService.getDocumentosParte(this.orgParteId)
            .subscribe(
                response => {
                    this.documentos = response;
                },
                err => console.log("ERROR: " + err),
                () => console.log("GET Documentos Complete")
            );
    }

    getTiposDocumento(documento: Documento = null) {
        this._documentoService.getTipoDocumentoPorParte(this.orgParteId)
            .subscribe(
                response => {
                    if (documento == null) {
                        this.nuevoDocumento = new Documento();
                        this.nuevoDocumento.es_principal = false;
                    } else {
                        this.nuevoDocumento = documento;
                    }

                    this.tiposDocumento = response;
                    this.utilizandoFormulario = true;
                    this.modal.open();
                },
                err => console.log("ERROR: " + err),
                () => console.log("GET Tipos Documento Complete")
            );
    }

    cerrarFormulario() {
        this.modal.close();
    }

    agregarDocumento() {
        this.getTiposDocumento();
    }

    getDocumento(documento: Documento) {
        this.editandoDocumento = true;
        this.getTiposDocumento(documento);
    }

    onSubmit() {
        let jsonData: string;

        this.nuevoDocumento.org_documento_tipo_id = +this.nuevoDocumento.org_documento_tipo_id;
        jsonData = JSON.stringify(this.nuevoDocumento);

        if (this.editandoDocumento) {
            this.editarDocumento(jsonData);
        } else {
            this.crearDocumento(jsonData);
        }
    }

    crearDocumento(jsonData: string) {
        this._documentoService.crearDocumento(this.orgParteId, jsonData)
            .subscribe(
                response => {
                    this.verNotificacion = true;
                    this.notificacion.status = 'success';
                    this.notificacion.message = 'Documento creado exitosamente!';

                    this.modal.close();
                },
                err => {
                    console.log("ERROR: " + err);

                    this.verNotificacion = true;
                    this.notificacion.status = 'error';
                    this.notificacion.message = err._body;
                },
                () => console.log("POST Documento Complete")
            );
    }

    editarDocumento(jsonData: string) {
        this._documentoService.editarDocumento(this.orgParteId, this.nuevoDocumento.id, jsonData)
            .subscribe(
                response => {
                    this.verNotificacion = true;
                    this.notificacion.status = 'success';
                    this.notificacion.message = 'Documento editado exitosamente!';

                    this.modal.close();
                },
                err => {
                    console.log("ERROR: " + err);

                    this.verNotificacion = true;
                    this.notificacion.status = 'error';
                    this.notificacion.message = err._body;
                },
                () => console.log("PUT Documento Complete")
            );
    }

    eliminarDocumento(documento: Documento) {
        let dialog = confirm("Esta seguro? Esta accion no se puede deshacer.");

        if (dialog) {
            this._documentoService.borrarDocumento(this.orgParteId, documento.id)
                .subscribe(
                    response => {
                        this.verNotificacion = true;
                        this.notificacion.status = 'success';
                        this.notificacion.message = 'Documento borrado exitosamente!';

                        this.getDocumentosParte();
                    },
                    err => {
                        console.log("ERROR: " + err);

                        this.verNotificacion = true;
                        this.notificacion.status = 'error';
                        this.notificacion.message = err._body;
                    },
                    () => console.log("DELETE Documento Complete")
                );
        }
    }
}