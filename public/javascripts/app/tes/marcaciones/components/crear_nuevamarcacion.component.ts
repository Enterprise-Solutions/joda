import {Component, OnInit, Input} from '@angular/core';
import {Router, RouterLink, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {AuthService} from '../../../auth/services/auth.service';

import {NotificationComponent} from '../../../utils/notification/components/notification.component';
import {Notification} from '../../../utils/notification/interfaces/notification.interface';
import {Marcacion} from "../interfaces/marcacion.interface";
import {MarcacionesService} from "../services/marcaciones.service";

@Component({
    providers: [MarcacionesService],
    directives: [NotificationComponent, ROUTER_DIRECTIVES],
    template: require('./templates/nuevamarcacion.template.html'),
    styles: [`
        .table > tbody > tr > td {
            vertical-align: middle;
        }
    `]
})

export class CrearMarcacionComponent /*implements OnInit*/ { // no implementa OnInit porque debe esperar
  //el boton de submit data...
    //public greeting : string = "example@gmail.com";
    public mark = new Marcacion();
  
    //@Input()  usuarios: Usuario;
    constructor(
        private _userMarcaciones: MarcacionesService) { }
  
  /*ngOnInit(){
    this.user = new Usuario()
  }*/
    sendDatauser() {
        this._userMarcaciones.sendDataMarcacion(this.mark)
            .subscribe(
                response => {
                  console.log(JSON.stringify(response))
                },
                err => console.log('ERROR: ' + err),
                () => console.log('Crear usuario')
            );
    }
    show(a :string){
      console.log(a);
    }
  
}