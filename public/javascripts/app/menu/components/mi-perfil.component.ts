import {Component, Input} from '@angular/core';
import {RouteParams, Router, RouterLink, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {OnInit, OnChanges} from '@angular/core';
import {NgForm}    from '@angular/common';

import {UsuariosService} from "../../adm/usuarios/services/usuarios.service";
import {Usuario} from "../../adm/usuarios/interfaces/usuario.interface";
import {Perfil} from "../../adm/usuarios/interfaces/perfil.interface";
import {AuthService} from "../../auth/services/auth.service";
import {NotificationComponent} from "../../utils/notification/components/notification.component";
import {Notification} from "../../utils/notification/interfaces/notification.interface";

@Component({
    directives: [ROUTER_DIRECTIVES, NotificationComponent],
    selector: 'awesome-component',
    providers: [UsuariosService],
    template: require('./templates/mi-perfil.template.html')
})

export class MiPerfilComponent implements OnInit {
    public usuario: Usuario;
    public editarUsuario: boolean;
    public editarPassword: boolean;
    public perfiles: Perfil[];
    public idUsuario: number;
    public cantPerfiles:number;

    //public mensajeAlerta;
    //public mostrarMensajeExito: boolean;
    //public mostrarMensajeError: boolean;

    public password: string;
    public new_password: string;
    public confirmacion: string;

    // Componente Notificacion
    public verNotificacion: boolean;
    public notificacion: Notification;

    constructor(
        private _router: Router,
        private _routeParams: RouteParams,
        private _authService: AuthService,
        private _usuarioService: UsuariosService
    ) { }

    closeNotification(event: any) {
        this.verNotificacion = false;
    }

    ngOnInit() {
        this.notificacion = new Notification();

        this.editarUsuario = false;
        this.editarPassword = false;
        //this.mostrarMensajeExito = false;
        //this.mostrarMensajeError = false;

        this.password = "";
        this.new_password = "";
        this.confirmacion = "";

        this.cantPerfiles = 0;

        //Obtenemos info del usuario logueado
        //this.getLoggedUser();

        //Obtenemos los perfiles del usuario logueado
        //this.getPerfiles();
    }

    //onChange file listener
    changeListener($event): void {
        this.postFile($event.target);
    }

    //send post file to server
    postFile(inputValue: any): void {

        var formData = new FormData();
        formData.append("name", "picture");
        formData.append("file",  inputValue.files[0]);

        this.subirFotoPerfil(formData)
    }

    getLoggedUser() {
        this._authService.getLoggerUsername()
            .subscribe(
                usuario => {
                    this.usuario = usuario;
                    this.usuario.cambiar_pwd = false;
                },
                err => console.log("ERROR: " + err),
                () => {}
            );
    }

    getPerfiles() {
        this._usuarioService.getPerfiles()
            .subscribe(
                perfiles => {
                    this.perfiles = perfiles.rows;
                    this.cantPerfiles = perfiles.total;
                },
                err => console.log("ERROR: " + err),
                () => {}
            );
    }

    cambiarPerfilPrincipal(id:number) {
        this._usuarioService.cambiarPerfilPrincipal(id)
            .subscribe(
                resultado => {
                    //var mensaje = resultado._body;
                    //var mensaje = "Cambio de perfil exitoso!"

                    this.getLoggedUser();
                    this.getPerfiles();
                    //this.mostrarMensaje(mensaje, true, false);
                    this.verNotificacion = true;
                    this.notificacion.status ='success';
                    this.notificacion.message = 'Cambio de perfil exitoso!';

                },
                err => {
                    var mensajeError = err._body;

                    //console.log("ERROR: " + err)
                    //this.mostrarMensaje(mensajeError, false, true);
                    this.verNotificacion = true;
                    this.notificacion.status ='error';
                    this.notificacion.message = err._body;
                },
                () => {}
            );
    }

    cambiarPassword() {
        //var jsonData: string;

        var jsonData = {
            "password" : this.password,
            "new_password" : this.new_password,
            "confirmacion" : this.confirmacion
        };

        var enviar: string = JSON.stringify(jsonData);

        //console.log("Json a enviar: " + enviar);
        var respuesta: string;

        this._usuarioService.cambiarPassword(enviar)
            .subscribe(
                respuesta => {
                    //this.mostrarMensaje("Contraseña guardada con exito", true, false);
                    this.password = "";
                    this.new_password = "";
                    this.confirmacion = "";

                    //console.log("Respuesta: " + JSON.stringify(respuesta));

                    this.verNotificacion = true;
                    this.notificacion.status ='success';
                    this.notificacion.message = 'Contraseña guardada con exito';
                },
                err => {
                    //console.log("ERROR: " + err + " en JSON: " + JSON.stringify(err));
                    //this.mostrarMensaje("" + err._body, false, true);

                    this.verNotificacion = true;
                    this.notificacion.status ='error';
                    this.notificacion.message = err._body;
                },
                () => {}
            );
    }

    editarContrasena() {
        this.editarPassword = true;
    }

    editar() {
        this.editarUsuario = true;
    }

    descargarFoto(){
        this._usuarioService.descargarFotoPerfil()
            .subscribe(
                respuesta => {
                    console.log("Respuesta al subir foto: " + respuesta);
                    //this.imagenPerfil = respuesta;
                },
                err => {
                    console.log("ERROR: " + err + " en JSON: " + JSON.stringify(err));

                    this.verNotificacion = true;
                    this.notificacion.status ='error';
                    this.notificacion.message = err._body;
                },
                () => {}
            );
    }



    subirFotoPerfil(formData: FormData){

        this._usuarioService.subirFotoPerfil(formData)
            .subscribe(
                respuesta => {
                    console.log("Respuesta al subir foto: " + respuesta);
                },
                err => {
                    console.log("ERROR: " + err + " en JSON: " + JSON.stringify(err));

                    this.verNotificacion = true;
                    this.notificacion.status ='error';
                    this.notificacion.message = err._body;
                },
                () => {}
            );
    }

    //mostrarMensaje(mensaje: String, exito: boolean, error: boolean){
    //
    //    this.mostrarMensajeExito = exito;
    //    this.mostrarMensajeError = error;
    //
    //    if (exito) {
    //        this.mensajeAlerta = mensaje;
    //
    //        setTimeout(() => {
    //            this.mostrarMensajeExito = !exito;
    //        }, 3000);
    //    } else {
    //        this.mensajeAlerta = mensaje;
    //
    //        setTimeout(() => {
    //            this.mostrarMensajeError = !error;
    //        }, 4000);
    //
    //    }
    //}
}