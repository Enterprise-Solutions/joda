import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {AuthService} from '../../../auth/services/auth.service';

import {NotificationComponent} from '../../../utils/notification/components/notification.component';
import {Notification} from '../../../utils/notification/interfaces/notification.interface';
import {Marcacion} from "../interfaces/marcacion.interface";
import {MarcacionesService} from "../services/marcaciones.service";

@Component({
    providers: [MarcacionesService],
    directives: [NotificationComponent, ROUTER_DIRECTIVES],
    template: require('./templates/listar-marcaciones.template.html'),
    styles: [`
        .table > tbody > tr > td {
            vertical-align: middle;
        }
    `]
})

export class ListarMarcacionesComponent implements OnInit {
    public org_organigrama_id: number;
    public loadingData: boolean;

    public marcaciones: Marcacion[];
    //public sucursales: Sucursal[];

    public numResults: number;

    // Componente Notificacion
    public verNotificacion: boolean;
    public notificacion: Notification;

    closeNotification(event: any) {
        this.verNotificacion = false;
    }

    // Default Params
    public search = {
        'nombre': undefined
    };

    public pagination = {'pagina': 0, 'cantidad': 10};
    //public order = {'sort': 'fecha_asiento', 'dir': 'asc'};
    public paginaActual: number;
    public totalDePaginas: number;

    public headers = [{
        'descrip': 'Nombre',
        'columna': 'nombre',
        'ordenable': false
    }];

    constructor(
        private _router: Router,
        private _authService: AuthService,
        private _marcacionesService: MarcacionesService) { }

    ngOnInit() {
        this.notificacion = new Notification();
        this.getUsuarios();

    }

    getUsuarios() {
        this._marcacionesService.getUsuarios()
            .subscribe(
                response => {
                    this.marcaciones = response;
                },
                err => console.log('ERROR: ' + err),
                () => console.log('GET Sucursales Complete')
            );
    }

    // gotoCrearBanco() {
    //     this._router.navigate(['CrearCajaComponent']);
    // }
    //
    // gotoEditarCaja(caja_id) {
    //     this._router.navigate(['EditarCajaComponent', {caja_id: caja_id}]);
    // }

}
