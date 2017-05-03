import {Component, OnInit} from '@angular/core';
import {RouteParams, Router, RouterLink, ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import {Rol} from "../interfaces/rol.interface";
import {RolService} from "../services/rol.service";

import {OperacionesRolComponent} from "./operaciones-rol.component";
import {NotificationComponent} from "../../../utils/notification/components/notification.component";
import {Notification} from "../../../utils/notification/interfaces/notification.interface";

@Component({
    directives: [ROUTER_DIRECTIVES, OperacionesRolComponent, NotificationComponent],
    providers: [RolService],
    template: require('./templates/editar-rol.template.html'),
    styles: [`.table th { text-align: center; }`]
})

export class EditarRolComponent implements OnInit {
    public rol: Rol;
    public idRol: number;
    public editarRol: boolean;

    // Componente Notificacion
    public verNotificacion: boolean;
    public notificacion: Notification;

    constructor(
        private _router: Router,
        private _routeParams: RouteParams,
        private _rolService: RolService) { }

    closeNotification(event: any) {
        this.verNotificacion = false;
    }

    // Inicializa el Formulario y las Interfaces
    ngOnInit() {
        this.idRol = Number(this._routeParams.get('idRol'));
        this.notificacion = new Notification();
        this.rol = new Rol();

        this.editarRol = true;
        //this.mostrarMensajeExito = false;
        //this.mostrarMensajeError = false;

        this._rolService.getRol(this.idRol)
            .subscribe(
                rol => {
                    this.rol = rol;
                },
                err => console.log("ERROR: " + err),
                () =>  {}
            );
    }

    // Boton Cancelar -- Vuelve al Listado
    listarRoles() { this._router.navigate(['ListarRolesComponent']); }

    // Boton Guardar -- Tiene que ir al Editar
    onSubmit() {
        var jsonData: string;


        jsonData = JSON.stringify(this.rol);

        //console.log("Json a enviar: " + jsonData);
        var respuesta: string;

        this._rolService.editarRol(this.idRol, jsonData)
            .subscribe(
                respuesta => {
                    respuesta = respuesta;
                    //this.mostrarMensaje("Rol editado con exito", true, false);

                    this.verNotificacion = true;
                    this.notificacion.status ='success';
                    this.notificacion.message = 'Rol editado con exito';

                    //console.log("Respuesta: " + JSON.stringify(respuesta));
                },
                err => {
                    console.log("ERROR: " + err + " en JSON: " + JSON.stringify(err));
                    //this.mostrarMensaje("Error al editar rol", false, true);

                    this.verNotificacion = true;
                    this.notificacion.status ='error';
                    this.notificacion.message = err._body;
                },
                () => {}
            );
    }

    editar() {
        this.editarRol = true;
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
