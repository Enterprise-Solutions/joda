import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router-deprecated';

import {AuthService} from '../../../auth/services/auth.service';
import {TiposDocumentosService} from '../services/tipos-documentos.service';

import {TipoDocumento} from '../interfaces/tipo-documento.interface';

import {NotificationComponent} from "../../../utils/notification/components/notification.component";
import {Notification} from "../../../utils/notification/interfaces/notification.interface";

@Component({
    directives: [NotificationComponent],
    providers: [TiposDocumentosService],
    template: require('./templates/crear-tipo-documento.template.html')
})

export class CrearTipoDocumentoComponent implements OnInit {
    public org_organigrama_id: number;

    public nuevoTipoDocumento: TipoDocumento;

    // Componente Notificacion
    public verNotificacion: boolean;
    public notificacion: Notification;

    closeNotification(event: any) {
        this.verNotificacion = false;
    }

    constructor(
        private _router: Router,
        private _authService: AuthService,
        private _tiposDocumentosService: TiposDocumentosService) { }

    ngOnInit() {
        this.notificacion = new Notification();

        this._authService.getLoggerUsername()
            .subscribe(
                response => {
                    this.org_organigrama_id = response.org_organigrama_id;
                    this.nuevoTipoDocumento = new TipoDocumento();
                },
                err => console.log("ERROR: " + err),
                () => console.log("AUTH Complete")
            );
    }

    gotoListarTiposDocumento() {
        this._router.navigate(['ListarTiposDocumentosComponent']);
    }

    onSubmit() {
        let jsonData: string;

        jsonData = JSON.stringify(this.nuevoTipoDocumento);
        this.crearTipoDocumento(jsonData);
    }

    crearTipoDocumento(jsonData:string) {
        this._tiposDocumentosService.crearTipoDocumento(jsonData)
            .subscribe(
                response => {
                    this.verNotificacion = true;
                    this.notificacion.status ='success';
                    this.notificacion.message = 'Tipo de Documento creado exitosamente!';

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
}
