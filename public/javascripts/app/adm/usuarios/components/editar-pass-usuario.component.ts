import {Component, Input} from '@angular/core';
import {RouteParams, Router, RouterLink, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {OnInit, OnChanges} from '@angular/core';
import {NgForm}    from '@angular/common';
import {Usuario}    from './../interfaces/usuario.interface';
import {UsuariosService} from '../services/usuarios.service';
import {ListarUsuariosComponent} from './listar-usuarios.component';
import {Perfil} from "../interfaces/perfil.interface";
import {CrearPerfilUsuarioComponent} from './crear-perfil-usuario.component';
import {EditarPerfilUsuarioComponent} from './editar-perfil-usuario.component';
import {Estado} from "../interfaces/estado.interface";
import {NotificationComponent} from "../../../utils/notification/components/notification.component";
import {Notification} from "../../../utils/notification/interfaces/notification.interface";

@Component({
    directives: [ROUTER_DIRECTIVES,NotificationComponent],
    selector: 'awesome-component',
    providers: [UsuariosService],
    template: require('./templates/editar-pass-usuario.template.html')
})

export class EditarPasswordUsuarioComponent implements OnInit/*, OnChanges */{
    public usuario: Usuario;
    public estados: Estado[];
    public editarUsuario: boolean;
    public perfiles: Perfil[];
    public idUsuario: number;
    public cantPerfiles:number;
    public estadoSelected: string;

    // Componente Notificacion
    public verNotificacion: boolean;
    public notificacion: Notification;

    closeNotification(event: any) {
        this.verNotificacion = false;
    }

    // Tabs
    public tabs: Array<any> = [
        {id: 1, title: 'Principal',  active: false},
        {id: 2, title: 'Contraseña',  active: true},
        {id: 3, title: 'Perfiles',  active: false}
    ];

    gotoTab(tab: any) {
        switch (tab.id) {
            case 1:
                this._router.navigate(['EditarPrincipalUsuarioComponent', {id: this.idUsuario}])
                break;
            case 2:
                this._router.navigate(['EditarPasswordUsuarioComponent', {id: this.idUsuario}]);
                break;
            case 3:
                this._router.navigate(['EditarPerfilesUsuarioComponent', {id: this.idUsuario}]);
                break;
            default: break;
        }
    }

    constructor(
        private _router: Router,
        private _routeParams: RouteParams,
        private _usuarioService: UsuariosService
        ) { }

    ngOnInit() {
        this.idUsuario = Number(this._routeParams.get('id'));
        this.editarUsuario = true;
        this.notificacion = new Notification();

        this.cantPerfiles = 0;
        this.usuario = new Usuario();



        this._usuarioService.getUsuario(this.idUsuario)
            .subscribe(
                usuario => {
                    this.usuario = usuario;
                    this.usuario.cambiar_pwd = false;
                    this.estadoSelected = this.usuario.estado;

                    //console.log("Usuario obtenido:" + JSON.stringify(this.usuario));
                    //console.log("Estado selected: " + this.estadoSelected);
                },
                err => console.log("ERROR: " + err),
                () =>  {

                }
            );

        //this.getEstados();
        //this.getPerfilesUsuario();
    }

    //Obtiene los estados para el SELECT
    getEstados() {
        this._usuarioService.getEstados()
            .subscribe(
                estados => {
                    //console.log("Estados: " + JSON.stringify(estados));
                    this.estados = estados.rows;
                },
                err => { console.log("ERROR: " + err._body); },
                () => {}
            );
    }

    getPerfilesUsuario() {
        this._usuarioService.getPerfilesUsuario(this.idUsuario)
            .subscribe(
                perfiles => {
                    this.perfiles = perfiles.rows;
                    this.cantPerfiles = this.perfiles.length;

                    //console.log("Perfil de usuario: " + JSON.stringify(this.perfiles));
                },
                err => console.log("ERROR: " + err),
                () =>  {}
            );
    }

    onSubmit() {
        var jsonData: string;

        if(!this.usuario.cambiar_pwd){
            this.usuario.password = "";
            this.usuario.confirmar_pass = "";
        }

        this.usuario.estado = this.estadoSelected;

        jsonData = JSON.stringify(this.usuario);

        console.log("Json a enviar: " + jsonData);
        var respuesta: string;

        this._usuarioService.editarUsuario(this.usuario.id, jsonData)
            .subscribe(
                respuesta => {
                    respuesta = respuesta;
                    //this.mostrarMensaje("Usuario guardado con exito", true, false);
                    this.verNotificacion = true;
                    this.notificacion.status =  'success';
                    this.notificacion.message = 'Contraseña modificada con éxito';
                    setTimeout(() => {
                    }, 4000);
                    this.editarUsuario = false;
                },
                err => {
                    console.log("ERROR: " + err + " en JSON: " + JSON.stringify(err));
                    this.verNotificacion = true;
                    this.notificacion.status = 'error';
                    this.notificacion.message =  err._body;
                },
                () => {}
            );
    }

    listarUsuarios() {
        this._router.navigate(['ListarUsuariosComponent']);
    }

    editar() {
        this.editarUsuario = true;
    }

    agregarPerfil() {
        console.log("Agregar perfil");

        this._router.navigate(['CrearPerfilUsuarioComponent', {id: this.usuario.id}]);
    }

    // borrarPerfil(idPerfil) {
    //     let dialog = confirm("Esta seguro? Esta accion no se puede deshacer.");

    //     if (dialog) {
    //         this._usuarioService.borrarPerfilUsuario(this.idUsuario, idPerfil)
    //             .subscribe(
    //                 response => {
    //                     this.getPerfilesUsuario();
    //                     this.mostrarMensaje("Perfil borrado con exito", true, false);
    //                 },
    //                 err =>  {
    //                     this.verNotificacion = true;
    //                     this.notificacion.status = 'error';
    //                     this.notificacion.message =  err._body;
    //                 },
    //                 () => {}
    //             );
    //     }
    // }

    onChange(newValue) {
        console.log("Cambiar estado a " + newValue);
        this.estadoSelected = newValue;
    }

    // mostrarMensaje(mensaje: String, exito: boolean, error: boolean){

    //     this.mostrarMensajeExito = exito;
    //     this.mostrarMensajeError = error;

    //     if (exito) {
    //         this.mensajeAlerta = mensaje;

    //         setTimeout(() => {
    //             this.mostrarMensajeExito = !exito;
    //         }, 3000);
    //     } else {
    //         this.mensajeAlerta = mensaje;

    //         setTimeout(() => {
    //             this.mostrarMensajeError = !error;
    //         }, 4000);

    //     }
    // }
}