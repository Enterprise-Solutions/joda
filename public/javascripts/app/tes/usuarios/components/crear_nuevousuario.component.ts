import {Component, OnInit, Input} from '@angular/core';
import {Router, RouterLink, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {AuthService} from '../../../auth/services/auth.service';

import {NotificationComponent} from '../../../utils/notification/components/notification.component';
import {Notification} from '../../../utils/notification/interfaces/notification.interface';
import {Usuario} from "../interfaces/usuarios.interface";
import {UserService} from "../services/usuarios.service";

@Component({
    providers: [UserService],
    directives: [NotificationComponent, ROUTER_DIRECTIVES],
    template: require('./templates/nuevousuario.template.html'),
    styles: [`
        .table > tbody > tr > td {
            vertical-align: middle;
        }
    `]
})

export class CrearUsuarioComponent /*implements OnInit*/ { // no implementa OnInit porque debe esperar
  //el boton de submit data...
    public greeting : string = "example@gmail.com";
    public user = new Usuario();
  
    //@Input()  usuarios: Usuario;
    constructor(
        private _userService: UserService) { }
  
  /*ngOnInit(){
    this.user = new Usuario()
  }*/
    sendDatauser() {
        this._userService.sendDataUsuario(this.user)
            .subscribe(
                response => {
                  console.log(JSON.stringify(response))
                },
                err => console.log('ERROR: ' + err),
                () => console.log('Crear usuario')
            );
    }
}
