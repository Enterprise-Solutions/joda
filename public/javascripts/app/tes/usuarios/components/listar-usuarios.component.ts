import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {AuthService} from '../../../auth/services/auth.service';

import {NotificationComponent} from '../../../utils/notification/components/notification.component';
import {Notification} from '../../../utils/notification/interfaces/notification.interface';
import {UsuarioL} from "../interfaces/usuarios.interface";
import {UserService} from "../services/usuarios.service";

@Component({
    providers: [UserService],
    directives: [NotificationComponent, ROUTER_DIRECTIVES],
    template: require('./templates/listar-usuarios.template.html'),
    styles: [`
        .table > tbody > tr > td {
            vertical-align: middle;
        }
    `]
})

export class ListarMarcacionesComponent implements OnInit {
    public org_organigrama_id: number;
    public loadingData: boolean;

    public usuarios: UsuarioL[];
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
        private _usersService: UserService) { }

    ngOnInit() {
        this.notificacion = new Notification();
        this.getUsuarios();
      
      var test = this.getTest();
      console.log('test es ' + test);

    }
  
  getTest(): String {
    return "Hello world";
  }

    getUsuarios() {
        this._usersService.getUsuarios()
            .subscribe(
                response => {
                    this.usuarios = response 
                  console.log(JSON.stringify(response))
                },
                err => console.log('ERROR: ' + err),
                () => console.log('GET Sucursales Complete')
            );
    }
  
    eliminarUsuario(email: String){
      console.log('Email: '+ email);
        this._usersService.deleteUsuario(email)
          .subscribe(
                result => console.log(result),
                error => console.log('ERROR:' + error)
        );
      location.reload();
    }
}
