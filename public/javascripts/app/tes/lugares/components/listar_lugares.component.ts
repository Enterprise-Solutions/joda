import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {AuthService} from '../../../auth/services/auth.service';

import {NotificationComponent} from '../../../utils/notification/components/notification.component';
import {Notification} from '../../../utils/notification/interfaces/notification.interface';
import {LugarL} from "../interfaces/lugares.interface";
import {LugarService} from "../services/lugares.service";

@Component({
    providers: [LugarService],
    directives: [NotificationComponent, ROUTER_DIRECTIVES],
    template: require('./templates/listar-lugares.template.html'),
    styles: [`
        .table > tbody > tr > td {
            vertical-align: middle;
        }
    `]
})

export class ListarLugaresComponent implements OnInit {
    public org_organigrama_id: number;
    public loadingData: boolean;

    public lugares: LugarL[];
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
        private _placesService: LugarService) { }

    ngOnInit() {
        this.notificacion = new Notification();
        this.getLugares();

    }

    getLugares() {
        this._placesService.getLugares()
            .subscribe(
                response => {
                    this.lugares = response 
                  console.log(JSON.stringify(response))
                },
                err => console.log('ERROR: ' + err),
                () => console.log('GET Lugares Complete')
            );
    }
  
   eliminarLugares(nombre: string){
     console.log('Nombre del lugar: '+ nombre);
       this._placesService.deleteLugar(nombre)
         .subscribe(
               result => console.log(result),
               error => console.log('ERROR:' + error)
       );
     location.reload();
   }
}
