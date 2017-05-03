import {Component, ViewChild, ViewChildren, OnInit} from '@angular/core';
import { MODAL_DIRECTIVES, ModalResult } from '../../../utils/ng2-bs3-modal/ng2-bs3-modal';
import {RolDisponible} from "../interfaces/rol-disponible.interface";
import {ModalComponent} from "../../../utils/ng2-bs3-modal/components/modal";
import {RolUsuario} from "../interfaces/rol-usuario.interface";
import {RolUsuarioService} from "../services/rol-usuario.service";

import {NotificationComponent} from "../../../utils/notification/components/notification.component";
import {Notification} from "../../../utils/notification/interfaces/notification.interface";

@Component({
    inputs: ['usuarioId', 'perfilId'],
    selector: 'roles',
    providers: [RolUsuarioService],
    template: require('./templates/roles.template.html'),
    styles: [`.table th { text-align: center; }`],
    directives: [MODAL_DIRECTIVES,NotificationComponent]
})

export class RolesUsuarioComponent implements OnInit {
    public usuarioId: number;
    public perfilId: number;
    public roles: RolUsuario [];
    public cantidadRoles: number;

    // Componente Notificacion
    public verNotificacion: boolean;
    public notificacion: Notification;

    closeNotification(event: any) {
        this.verNotificacion = false;
    }

    //Relacionado al modal de ejemplo
    public rolesDisponibles: RolDisponible[];
    public cantRolesDisponibles: number;
    public rolSelected: RolDisponible;
    public selected: RolDisponible;
    public idRolesSeleccionados: number[];
    public animationsEnabled: boolean = true;

    @ViewChild('modal')
    public modal: ModalComponent

    onClose(result: ModalResult) {
        var jsonData;

        if (result === ModalResult.Close) {
            //this.selected = this.rolSelected;
            for(var i = 0; i<this.rolesDisponibles.length; i++){
                if(this.rolesDisponibles[i].seleccionado){
                    this.idRolesSeleccionados.push(this.rolesDisponibles[i].id);
                }
            }

            if(this.idRolesSeleccionados.length > 0) {
                var id = this.perfilId;

                jsonData = {
                    "adm_usuario_perfil_id" : id,
                    "adm_rol_id" : JSON.parse(JSON.stringify(this.idRolesSeleccionados))
                };

                //console.log("JSON a enviar: " + JSON.stringify(jsonData));
                this.asociarRolesAPerfil(JSON.stringify(jsonData));

            }

            this.idRolesSeleccionados = [];
        }
    }

    //Fin de ejemplo de modal

    constructor(private _rolService: RolUsuarioService) { }

    ngOnInit() {
        //this.mostrarMensajeExito = false;
        //this.mostrarMensajeError = false;
        this.idRolesSeleccionados = [];
        this.cantRolesDisponibles = 0;
        this.notificacion = new Notification();

        //console.log("Id usuario: " + this.usuarioId + " - Id Perfil: " + this.perfilId);

        //1.    Primero verificamos si el usuario tiene roles
        this.getPerfilRoles();
        //1.1   Si tiene roles se listan sus roles
        //1.2   Si no tiene se muestra un aviso indicando que no tiene roles - Did it!
        //1.3   Crear un boton para añadir roles - Did it!
        //1.4   Mostrar los roles disponibles
        this.getRolesDisponibles();

    }


    getPerfilRoles(){
        this._rolService.getPerfilRoles(this.usuarioId, this.perfilId)
            .subscribe(
                roles => {
                    this.roles = roles.rows;
                    this.cantidadRoles = roles.total;

                    //console.log("Cant roles: "+ this.cantidadRoles +". Roles del usuario: " + JSON.stringify(this.roles));
                },
                err => console.log("GET ERROR: " + err),
                () => {}
            );
    }

    getRolesDisponibles() {
        this._rolService.getRolesDisponibles(this.usuarioId, this.perfilId)
            .subscribe(
                rolesDisponibles => {
                    this.rolesDisponibles = rolesDisponibles;
                    this.cantRolesDisponibles = rolesDisponibles.length;

                    //console.log("Cant roles: "+ rolesDisponibles.length +". Roles disponibles: " + JSON.stringify(this.rolesDisponibles));
                },
                err => console.log("GET ERROR: " + JSON.stringify(err)),
                () => {}
            );
    }

    asociarRolesAPerfil(jsonData: string) {
        this._rolService.crearPerfilRoles(this.usuarioId, this.perfilId, jsonData)
            .subscribe(
                rolesUsuario => {
                    //this.roles = rolesUsuario;

                    //console.log("Cant roles: "+ rolesUsuario.length +". Roles despues de asociar a perfil: " + JSON.stringify(rolesUsuario));
                    //this.mostrarMensaje("Rol asociado con exito", true, false);
                    this.verNotificacion = true;
                    this.notificacion.status =  'success';
                    this.notificacion.message = 'Roles asociados con éxito';
                    setTimeout(() => {
                    }, 3000);
                    this.getRolesDisponibles();
                    this.getPerfilRoles()
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

    borrarRol(rolId: number) {
        let dialog = confirm("¿Esta seguro? Esta accion no se puede deshacer.");

        var jsonData = {
            "id" : [rolId]
        };

        if (dialog) {
            this._rolService.borrarPerfilRoles(this.usuarioId, this.perfilId, JSON.stringify(jsonData) )
                .subscribe(
                    response => {
                        this.getPerfilRoles();
                        //this.mostrarMensaje("Rol borrado con exito", true, false);
                        this.verNotificacion = true;
                        this.notificacion.status =  'success';
                        this.notificacion.message = 'Rol borrado con éxito';
                        setTimeout(() => {
                        }, 3000);
                    },
                    err =>  {
                        console.log("ERROR: " + err);
                        this.verNotificacion = true;
                        this.notificacion.status = 'error';
                        this.notificacion.message =  err._body;
                    },
                    () => {}
                );
        }
    }

    abrirModal() {
        this.modal.open();
        this.getRolesDisponibles();
    }
    // mostrarMensaje(mensaje: String, exito: boolean, error: boolean){

    //     this.mostrarMensajeExito = exito;
    //     this.mostrarMensajeError = error;

    //     if (exito) {
    //         this.mensajeAlerta = mensaje;

    //         setTimeout(() => {
    //             this.mostrarMensajeExito = !exito;
    //         }, 1000);
    //     } else {
    //         this.mensajeAlerta = mensaje;

    //         setTimeout(() => {
    //             this.mostrarMensajeError = !error;
    //         }, 1000);
    //     }
    // }
}