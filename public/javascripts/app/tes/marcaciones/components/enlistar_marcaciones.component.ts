import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {AuthService} from '../../../auth/services/auth.service';

import {NotificationComponent} from '../../../utils/notification/components/notification.component';
import {Notification} from '../../../utils/notification/interfaces/notification.interface';
import {MarcacionL} from "../interfaces/marcaciones.interface";
import {MarcacionService} from "../services/marcaciones.service";

@Component({
    providers: [MarcacionService],
    directives: [NotificationComponent, ROUTER_DIRECTIVES],
    template: require('./templates/enlistar-marcaciones.template.html'),
    styles: [`
        .table > tbody > tr > td {
            vertical-align: middle;
        }
    `]
})

export class ListarMarcComponent implements OnInit {
    public org_organigrama_id: number;
    public loadingData: boolean;

    public marcaciones: MarcacionL[];

    public headers = [{
        'descrip': 'Nombre',
        'columna': 'nombre',
        'ordenable': false
    }];

    constructor(
        private _router: Router,
        private _authService: AuthService,
        private _marcacionesService: MarcacionService) { }

    ngOnInit() {
        this.getMarcaciones();
    }

    getMarcaciones() {
        this._marcacionesService.getMarcas()
            .subscribe(
                response => {
                    this.marcaciones = response 
                  console.log(JSON.stringify(response))
                },
                err => console.log('ERROR: ' + err),
                () => console.log('GET Sucursales Complete')
            );
    }
  
    eliminarMarcacion(email:string){
    
  }

}
