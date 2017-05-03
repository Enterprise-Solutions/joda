import {Component, Input, Output, EventEmitter, OnChanges, OnInit} from '@angular/core';
import {Router} from '@angular/router-deprecated';

import {Organizacion} from '../interfaces/organizacion.interface';
import {Documento} from '../../documentos/interfaces/documento.interface';
import {Direccion} from '../../direcciones/interfaces/direccion.interface';
import {DocumentoTipo} from '../../documentos/interfaces/documento-tipo.interface';

import {OrganizacionService} from '../services/organizacion.service';

import {Notification} from "../../../utils/notification/interfaces/notification.interface";
import {NotificationComponent} from "../../../utils/notification/components/notification.component";

@Component({
    selector: 'organizacion-form',
    providers: [OrganizacionService],
    directives: [NotificationComponent],
    template: require('./templates/crear-organizacion-form.template.html')
})

export class CrearOrganizacionFormComponent implements OnInit, OnChanges {
    @Input() fromModal: boolean;
    @Input() data: string = "";
    @Output() organizacionCreada = new EventEmitter();

    public organizacion: Organizacion;
    public dir: Direccion;
    public tipoDocumentos: DocumentoTipo[];
    public tipoDocumentoSeleccionado: DocumentoTipo;

    // Componente Notificacion
    public verNotificacion: boolean;
    public notificacion: Notification;

    closeNotification(event: any) {
        this.verNotificacion = false;
    }

    constructor(
        private _router: Router,
        private _organizacionService: OrganizacionService) { }

    // Inicializa el Formulario y las Interfaces
    ngOnInit() {
        this.notificacion = new Notification();
        this.getTipoDocumentos();
    }

    ngOnChanges() {
        this.organizacion = new Organizacion();
        this.organizacion.doc = new Documento();

        if (!isNaN(parseInt(this.data.at(0)))) {
            this.organizacion.doc.documento = this.data;
        } else {
            this.organizacion.nombre = this.data;
        }

        this.dir = new Direccion();
        this.dir.es_principal = false;
    }

    // Obtiene los tipos de Documento para SELECT
    getTipoDocumentos() {
        this._organizacionService.getTipoDocumentosOrganizaciones()
            .subscribe(
                response => this.tipoDocumentos = response,
                err => console.log("ERROR: " + err),
                () => {}
            );
    }

    onCancel() {
        if (!this.fromModal) {
            this.listarOrganizacion();
        } else {
            this.organizacionCreada.emit(null);
        }
    }

    // Boton Cancelar -- Vuelve al Listado
    listarOrganizacion() {
        this._router.navigate(['ListarOrganizacionComponent']);
    }

    // Boton Guardar -- Tiene que ir al Editar
    onSubmit() {
        let jsonData:string;

        this.organizacion.doc.org_documento_tipo_id = +this.tipoDocumentoSeleccionado.id;
        this.organizacion.doc.tipo = this.tipoDocumentoSeleccionado.nombre;

        if (this.dir.es_principal) {
            this.organizacion.dir = this.dir;
        }

        if (!this.fromModal) {
            jsonData = JSON.stringify(this.organizacion);
            this.crearOrganizacion(jsonData);
        } else {
            this.organizacionCreada.emit(this.organizacion);
        }
    }

    // LLamada a servicioss
    crearOrganizacion(jsonData: string) {
        this._organizacionService.crearOrganizacion(jsonData)
            .subscribe(
                response => {
                    this.verNotificacion = true;
                    this.notificacion.status =  'success';
                    this.notificacion.message = 'Organizacion creada exitosamente!';

                    setTimeout(() => {
                        this._router.navigate(['EditarOrganizacionComponent', {id: response.id}])
                    }, 500);
                },
                err => {
                    console.log("ERROR: " + err);

                    this.verNotificacion = true;
                    this.notificacion.status = 'error';
                    this.notificacion.message =  err._body;
                },
                () => {}
            );
    }
}