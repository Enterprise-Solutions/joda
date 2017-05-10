import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {AuthService} from '../../../auth/services/auth.service';

import {NotificationComponent} from '../../../utils/notification/components/notification.component';
import {Notification} from '../../../utils/notification/interfaces/notification.interface';
import {horasTrabajadas} from "../interfaces/usuarios.interface";
import {UserService} from "../services/usuarios.service";

@Component({
    providers: [UserService],
    directives: [NotificationComponent, ROUTER_DIRECTIVES],
    template: require('./templates/horastrabajadas.template.html'),
    styles: [`
        .table > tbody > tr > td {
            vertical-align: middle;
        }
    `]
})

export class HorasLaburadasComponent /*implements OnInit*/ { // no implementa OnInit porque debe esperar
  //el boton de submit data...
    //public greeting : string = "example@gmail.com";
    public email: string;
    public fecha: string;
    public labourtime:horasTrabajadas[];

    //@Input()  usuarios: Usuario;
    constructor(
        private _userMarcaciones: UserService) { }
  
  /*ngOnInit(){
    this.user = new Usuario()
  }*/
    tiempolaburado() {
      this._userMarcaciones.gettimeworked(this.email, this.fecha)
            .subscribe(
                response => {
                  this.labourtime = response
                  console.log(JSON.stringify(response))
                },
                err => console.log('ERROR: ' + err),
                () => console.log('Display Horas trabajas en la fecha')
            );
    }
    show(a :string){
      console.log(a);
    }
  
}