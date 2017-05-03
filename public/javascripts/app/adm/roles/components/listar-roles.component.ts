import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import {AuthService} from '../../../auth/services/auth.service';
import {RolService} from "../services/rol.service";

import {Rol} from "../interfaces/rol.interface";

import {Notification} from '../../../utils/notification/interfaces/notification.interface';
import {NotificationComponent} from '../../../utils/notification/components/notification.component';

@Component({
    directives: [ROUTER_DIRECTIVES, NotificationComponent],
    providers: [RolService],
    template: require('./templates/listar-roles.template.html'),
    styles: [`.table th { text-align: center; }`]
})

export class ListarRolesComponent implements OnInit {
    public org_organigrama_id: number;

    // Componente Notificacion
    public verNotificacion: boolean;
    public notificacion: Notification;

    closeNotification(event: any) {
        this.verNotificacion = false;
    }

    public headers = [{
        'descrip': 'Nombre',
        'columna': 'nombre',
        'ordenable': true
    },{
        'descrip': 'Descripcion',
        'columna': 'descripcion',
        'ordenable': true
    }];

    public roles: Rol[];
    public numResults: number;
    public totalDePaginas = 0;
    public paginaActual = 1;

    // Default Params
    public search = {'nombre': undefined};
    public pagination = {'pagina': 0, 'cantidad': 20};
    public order = {'sort': 'nombre', 'dir': 'asc'};

    constructor(
        private _router: Router,
        private _authService: AuthService,
        private _rolService: RolService) {}

    ngOnInit() {
        this.notificacion = new Notification();

        this._authService.getLoggerUsername()
            .subscribe(
                usuario => {
                    this.org_organigrama_id = usuario.org_organigrama_id;
                    this.getRoles();
                },
                err => console.log("ERROR: " + err),
                () => {}
            );
    }

    getRoles() {
        this._rolService.getRoles(this.search, this.pagination, this.order)
            .subscribe(
                roles => {
                    this.roles = roles.rows;
                    this.numResults = roles.total;
                    this.paginaActual = this.pagination.pagina+1;
                    this.totalDePaginas = Math.ceil(this.numResults / this.pagination.cantidad);
                },
                err => console.log("ERROR: " + err),
                () => {}
            );
    }

    setDefaultParams() {
        this.search = {'nombre': undefined};
    }

    changePage(newValue) {
        if (newValue <= 0){
            this.paginaActual = 1;
            this.pagination.pagina = 0;
        } else if(newValue > this.totalDePaginas){
            this.paginaActual = this.totalDePaginas;
            this.pagination.pagina = this.paginaActual-1;
        }else{
            this.paginaActual = newValue;
            this.pagination.pagina = newValue-1;
        }
            this.getRoles();
    }

    prevPage() {
        this.pagination.pagina -= 1;
        this.paginaActual -= 1;
        this.getRoles();
    }

    nextPage() {
        this.pagination.pagina += 1;
        this.paginaActual += 1;
        this.getRoles();
    }

    filtrar() {
        this.getRoles();
    }

    limpiar() {
        this.setDefaultParams();
        this.getRoles();
    }

    nuevoRol() {
        this._router.navigate(['CrearRolComponent']);
    }

    borrarRol(id) {
        let dialog = confirm("¿Esta seguro? Esta accion no se puede deshacer.");

        if (dialog) {
            this._rolService.borrarRol(id)
                .subscribe(
                    response => {
                        this.verNotificacion = true;
                        this.notificacion.status = 'success';
                        this.notificacion.message = 'Rol borrado exitosamente!';

                        setTimeout(() => {
                            this.getRoles();
                        }, 500);
                    },
                    err => {
                        console.log("ERROR: " + err);

                        this.verNotificacion = true;
                        this.notificacion.status = 'error';
                        this.notificacion.message = err._body;
                    },
                    () => {}
                );
        }
    }

    ordenar(head) {
        if (head.ordenable) {
            if (this.order.sort == head.columna) {
                this.order.dir = this.order.dir == 'asc' ? 'desc' : 'asc';
                this.getRoles();
            } else {
                this.order.sort = head.columna;
                this.order.dir = 'asc';
                this.getRoles();
            }
        }
    }
}