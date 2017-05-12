import {Component, OnInit, Input} from '@angular/core';
import {Router, RouterLink, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {AuthService} from '../../../auth/services/auth.service';

import {NotificationComponent} from '../../../utils/notification/components/notification.component';
import {Notification} from '../../../utils/notification/interfaces/notification.interface';
import {Marcacion} from "../interfaces/marcaciones.interface";
import {MarcacionService} from "../services/marcaciones.service";

@Component({
    providers: [MarcacionService],
    directives: [NotificationComponent, ROUTER_DIRECTIVES],
    template: require('./templates/nueva_marcacion.template.html'),
    styles: [`
        .table > tbody > tr > td {
            vertical-align: middle;
        }
    `]
})

export class CrearMarcacionComponent /*implements OnInit*/ { 
    public mark = new Marcacion();
  
    //@Input()  usuarios: Usuario;
    constructor(
        private _userMarcaciones: MarcacionService) { }
  
  /*ngOnInit(){
    this.user = new Usuario()
  }*/
    sendDataDialings() {
        this._userMarcaciones.sendDataMarcacion(this.mark)
            .subscribe(
                response => {
                  console.log(JSON.stringify(response))
                },
                err => console.log('ERROR: ' + err),
                () => console.log('Crear marcacion')
            );
    }
}