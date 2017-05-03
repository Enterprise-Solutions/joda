import {Component, OnInit} from '@angular/core';
import {Router, RouteParams} from '@angular/router-deprecated';

import {AuthService} from '../../../auth/services/auth.service';
import {TiposDocumentosService} from '../services/tipos-documentos.service';

import {TipoDocumento} from '../interfaces/tipo-documento.interface';

import {NotificationComponent} from "../../../utils/notification/components/notification.component";
import {Notification} from "../../../utils/notification/interfaces/notification.interface";

@Component({
    directives: [NotificationComponent],
    providers: [TiposDocumentosService],
    template: require('./templates/editar-tipo-documento.template.html')
})

export class EditarTipoDocumentoComponent implements OnInit {
    public org_organigrama_id: number;
    public tipo_documento_id: number;

    public tipoDocumento: TipoDocumento;

    // Componente Notificacion
    public verNotificacion: boolean;
    public notificacion: Notification;

    closeNotification(event: any) {
        this.verNotificacion = false;
    }

    constructor(
        private _router: Router,
        private _routeParams: RouteParams,
        private _authService: AuthService,
        private _tiposDocumentoService: TiposDocumentosService) { }

    ngOnInit() {
        this.notificacion = new Notification();
        this.tipo_documento_id = +this._routeParams.get('tipo_id');

        this._authService.getLoggerUsername()
            .subscribe(
                response => {
                    this.org_organigrama_id = response.org_organigrama_id;
                    this.getTipoDocumento();
                }
            );
    }

    getTipoDocumento() {
        this._tiposDocumentoService.getTipoDocumento(this.tipo_documento_id)
            .subscribe(
                response => {
                    this.tipoDocumento = response;
                },
                err => console.log("ERROR: " + err),
                () => console.log("GET Tipo Documento Complete")
            );
    }

    onSubmit() {
        let jsonData: string;

        jsonData = JSON.stringify(this.tipoDocumento);
        this.editarTipoDocumento(jsonData);
    }

    editarTipoDocumento(jsonData: string) {
        this._tiposDocumentoService.editarTipoDocumento(this.tipo_documento_id, jsonData)
            .subscribe(
                response => {
                    this.verNotificacion = true;
                    this.notificacion.status ='success';
                    this.notificacion.message = 'Tipo de Documento editado exitosamente!';

                    setTimeout(() => {
                        this._router.navigate(['ListarTiposDocumentosComponent']);
                    }, 500);
                },
                err => {
                    console.log("ERROR: " + err);

                    this.verNotificacion = true;
                    this.notificacion.status= 'error';
                    this.notificacion.message = err._body;
                },
                () => console.log("POST Tipo Documento Complete")
            );
    }

    gotoListarTiposDocumento() {
        this._router.navigate(['ListarTiposDocumentosComponent']);
    }
}