import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import {AuthService} from '../../../auth/services/auth.service';
import {TiposDocumentosService} from '../services/tipos-documentos.service';

import {TipoDocumento} from '../interfaces/tipo-documento.interface';

import {NotificationComponent} from "../../../utils/notification/components/notification.component";
import {Notification} from "../../../utils/notification/interfaces/notification.interface";

@Component({
    directives: [ROUTER_DIRECTIVES, NotificationComponent],
    providers: [TiposDocumentosService],
    template: require('./templates/listar-tipos-documentos.template.html'),
    styles: [`.table th { text-align: center; }`]
})

export class ListarTiposDocumentosComponent implements OnInit {
    public org_organigrama_id: number;

    public tiposDocumento: TipoDocumento[];

    public headers = [{
        'descrip': 'Nombre',
        'columna': 'nombre',
        'ordenable': true
    }];

    // Default Params
    public search = {'nombre': undefined};
    public pagination = {'pagina': 0, 'cantidad': 20};
    public order = {'sort': 'nombre', 'dir': 'asc'};

    public totalDePaginas = 0;
    public paginaActual = 1;
    public numResults: number;

    // Componente Notificacion
    public verNotificacion:boolean;
    public notificacion:Notification;

    closeNotification(event:any) {
        this.verNotificacion = false;
    }

    constructor(
        private _router:Router,
        private _authService: AuthService,
        private _tiposDocumentosService:TiposDocumentosService) { }

    ngOnInit() {
        this.notificacion = new Notification();

        this._authService.getLoggerUsername()
            .subscribe(
                response => {
                    this.org_organigrama_id = response.org_organigrama_id;
                    this.getTiposDocumento()
                },
                err => console.log("ERROR: " + err),
                () => console.log("AUTH Complete")
            );
    }

    getTiposDocumento() {
        this._tiposDocumentosService.getTiposDocumentos(this.search, this.pagination, this.order)
            .subscribe(
                response => {
                    this.tiposDocumento = response.rows;
                    this.numResults = response.total;

                    this.paginaActual = this.pagination.pagina + 1;
                    this.totalDePaginas = Math.ceil(this.numResults / this.pagination.cantidad);
                },
                err => console.log("ERROR: " + err),
                () => console.log("GET Tipos Documento Complete")
            );
    }

    setDefaultParams() {
        this.search = {'nombre': undefined};
    }

    gotoCrearTipoDocumento() {
        this._router.navigate(['CrearTipoDocumentoComponent']);
    }

    changePage(newValue) {
        if (newValue <= 0) {
            this.paginaActual = 1;
            this.pagination.pagina = 0;
        } else if (newValue > this.totalDePaginas) {
            this.paginaActual = this.totalDePaginas;
            this.pagination.pagina = this.paginaActual - 1;
        } else {
            this.paginaActual = newValue;
            this.pagination.pagina = newValue - 1;
        }
        this.getTiposDocumento();
    }

    prevPage() {
        this.pagination.pagina -= 1;
        this.paginaActual -= 1;
        this.getTiposDocumento();
    }

    nextPage() {
        this.pagination.pagina += 1;
        this.paginaActual += 1;
        this.getTiposDocumento();
    }

    filtrar() {
        this.getTiposDocumento();
    }

    limpiar() {
        this.setDefaultParams();
        this.getTiposDocumento();
    }

    ordenar(head) {
        if (head.ordenable) {
            if (this.order.sort == head.columna) {
                this.order.dir = this.order.dir == 'asc' ? 'desc' : 'asc';
                this.getTiposDocumento();
            } else {
                this.order.sort = head.columna;
                this.order.dir = 'asc';
                this.getTiposDocumento();
            }
        }
    }

    onDelete(id) {
        let dialog = confirm("Esta seguro? Esta accion no se puede deshacer.");

        if (dialog) {
            this._tiposDocumentosService.borrarTipoDocumento(id)
                .subscribe(
                    response => {
                        this.verNotificacion = true;
                        this.notificacion.status = 'success';
                        this.notificacion.message = 'Tipo de Documento borrado exitosamente!';

                        this.getTiposDocumento();
                    },
                    err => {
                        console.log("error: " + err);

                        this.verNotificacion = true;
                        this.notificacion.status = 'error';
                        this.notificacion.message = err._body;
                    },
                    () => console.log("DELETE Tipo Documento Complete")
                );
        }
    }
}