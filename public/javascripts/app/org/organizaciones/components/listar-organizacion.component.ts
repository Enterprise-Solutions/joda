import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import {OrganizacionService} from "../services/organizacion.service";

import {Organizacion} from "../interfaces/organizacion.interface";

import {NotificationComponent} from "../../../utils/notification/components/notification.component";
import {Notification} from "../../../utils/notification/interfaces/notification.interface";

@Component({
    directives: [ROUTER_DIRECTIVES, NotificationComponent],
    providers: [OrganizacionService],
    template: require('./templates/listar-organizacion.template'),
    styles: [`.table th { text-align: center; }`]
})

export class ListarOrganizacionComponent implements OnInit {
    public headers = [{
        'descrip': 'Nombre',
        'columna': 'nombre',
        'ordenable': false
    },{
        'descrip': 'Documento',
        'columna': 'documento',
        'ordenable': false
    }];

    public loadingData: boolean;

    public organizaciones: Organizacion[];
    public numResults: number;
    public totalDePaginas = 0;
    public paginaActual = 1;

    // Default Params
    public search = {'nombre': undefined};
    public pagination = {'pagina': 0, 'cantidad': 10};
    public order = {'sort': 'nombres', 'dir': 'asc'};

    // Componente Notificacion
    public verNotificacion: boolean;
    public notificacion: Notification;

    closeNotification(event: any) {
        this.verNotificacion = false;
    }

    constructor(
        private _router: Router,
        private _organizacionService: OrganizacionService) { }

    setDefaultParams() {
        this.search = {'nombre': undefined};
    }

    ngOnInit() {
        this.loadingData = false;
        this.notificacion = new Notification();
        this.getOrganizaciones();
    }

    getOrganizaciones() {
        this.loadingData = true;
        this._organizacionService.getOrganizaciones(this.search, this.pagination, this.order)
            .subscribe(
                response => {
                    this.organizaciones = response.rows;
                    this.numResults = response.total;
                    this.paginaActual = this.pagination.pagina + 1;
                    this.totalDePaginas = Math.ceil(this.numResults / this.pagination.cantidad);
                },
                err => console.log("ERROR: " + err),
                () => {
                    console.log("GET Organizaciones Complete");
                    this.loadingData = false;
                }
            );
    }

    nuevaOrganizacion() {
        this._router.navigate(['CrearOrganizacionComponent']);
    }

    borrarOrganizacion(organizacion_id: number) {
        let dialog = confirm("Esta seguro? Esta accion no se puede deshacer.");

        if (dialog) {
            this.loadingData = true;
            this._organizacionService.borrarOrganizacion(organizacion_id)
                .subscribe(
                    response => {
                        this.verNotificacion = true;
                        this.notificacion.status ='success';
                        this.notificacion.message = 'Organizacion borrada exitosamente!';

                        setTimeout(() => { this.getOrganizaciones(); }, 500);
                    },
                    err => {
                        this.getOrganizaciones();
                        this.verNotificacion = true;
                        this.notificacion.status ='error';
                        this.notificacion.message = err._body;
                    },
                    () => {
                        this.loadingData = false;
                    }
                );
        }
    }

    changePage(newValue: number) {
        if (newValue <= 0) {
            this.paginaActual = 1;
            this.pagination.pagina = 0;
        } else if(newValue > this.totalDePaginas) {
            this.paginaActual = this.totalDePaginas;
            this.pagination.pagina = this.paginaActual-1;
        } else {
            this.paginaActual = newValue;
            this.pagination.pagina = newValue-1;
        }
        this.getOrganizaciones();
    }

    prevPage() {
        this.pagination.pagina -= 1;
        this.paginaActual -= 1;
        this.getOrganizaciones();
    }

    nextPage() {
        this.pagination.pagina += 1;
        this.paginaActual += 1;
        this.getOrganizaciones();
    }

    filtrar() {
        this.getOrganizaciones();
    }

    limpiar() {
        this.setDefaultParams();
        this.getOrganizaciones();
    }

    ordenar(head) {
        if (head.ordenable) {
            if (this.order.sort == head.columna) {
                this.order.dir = this.order.dir == 'asc' ? 'desc' : 'asc';
                this.getOrganizaciones();
            } else {
                this.order.sort = head.columna;
                this.order.dir = 'asc';
                this.getOrganizaciones();
            }
        }
    }
}