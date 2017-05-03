import {Component} from '@angular/core';
import {Router, RouterLink, ROUTER_DIRECTIVES, RouteParams} from '@angular/router-deprecated';
import {OnInit} from '@angular/core';
import {Organigrama} from "../../../org/organigramas/interfaces/organigrama.interface";
import {OrganigramaService} from "../../../org/organigramas/services/organigrama.service";
import {Perfil} from "../interfaces/perfil.interface";
import {UsuariosService} from "../services/usuarios.service";
import {RolesUsuarioComponent} from "./roles-usuario.component";
import {Usuario} from "../interfaces/usuario.interface";

import {NotificationComponent} from "../../../utils/notification/components/notification.component";
import {Notification} from "../../../utils/notification/interfaces/notification.interface";


@Component({
    template: require('./templates/editar-perfil-usuario.template.html'),
    directives: [ROUTER_DIRECTIVES, RolesUsuarioComponent,NotificationComponent],
    providers: [OrganigramaService, UsuariosService],
})

export class EditarPerfilUsuarioComponent  implements OnInit{
    public submitted = false;
    public perfil: Perfil;
    public idPersona: number;
    public idPerfil: number;
    public empresas: Organigrama [];
    public nombrePerfil: string;
    public perfilPorDefecto: boolean;
    public editTable: boolean;
    public es_principal: boolean;
    public usuario: Usuario;

    // Componente Notificacion
    public verNotificacion: boolean;
    public notificacion: Notification;

    closeNotification(event: any) {
        this.verNotificacion = false;
    }

    // Tabs
    public tabs: Array<any> = [
        {id: 1, title: 'Datos Principales',  active: false},
        {id: 2, title: 'Roles',  active: true},
        {id: 3, title: 'Área de Gestión',  active: false}
    ];

    gotoTab(tab: any) {
        switch (tab.id) {
            case 1:
                this._router.navigate(['EditarPrincipalPerfilComponent', {id: this.idPersona, idPerfil: this.idPerfil}])
                break;
            case 2:
                this._router.navigate(['EditarPerfilUsuarioComponent', {id: this.idPersona, idPerfil: this.idPerfil}])
                break;
            case 3:
                this._router.navigate(['EditarAreaUsuarioComponent', {id: this.idPersona, idPerfil: this.idPerfil}]);
                break;
            default: break;
        }
    }

    constructor(
        private _router: Router,
        private _routeParams: RouteParams,
        private _organigramaService: OrganigramaService,
        private _usuarioService: UsuariosService) { }


    // Inicializa el Formulario y las Interfaces
    ngOnInit() {
        this.idPersona = Number(this._routeParams.get('id'));
        this.idPerfil = Number(this._routeParams.get('idPerfil'));

        this.notificacion = new Notification();

        //console.log("Id del usuario: " + this.idPersona + " y ID de Perfil: "+ this.idPerfil);

        this.perfil = new Perfil();
        this.nombrePerfil = "";
        this.perfilPorDefecto = false;
        this.editTable = false;

        //1. Obtener nombre del perfil y el organigrama (Empresa) a partir del ID perfil
        this.getUsuario();
        this.getPerfil();
        this.getEmpresas();
    }

    getUsuario(){
        this._usuarioService.getUsuario(this.idPersona)
            .subscribe(
                usuario => {
                    this.usuario = usuario;
                },
                err => console.log("ERROR: " + err),
                () =>  {

                }
            );
    }

    getPerfil() {
        this._usuarioService.getPerfilUsuario(this.idPersona, this.idPerfil)
            .subscribe(
                perfil => {
                    this.perfil = perfil;
                    this.es_principal = this.perfil.es_principal;

                    //console.log("Perfil: " + JSON.stringify(perfil));
                },
                err => console.log("GET ERROR: " + err),
                () => {}
            );
    }

    getEmpresas() {
        this._organigramaService.getOrganigramas()
            .subscribe(
                empresas => {
                    this.empresas = empresas;

                    //console.log("Empresas: " + JSON.stringify(empresas))
                },
                err => console.log("GET '/org/usuarios' => ERROR: " + err),
                () => {}
            );
    }

    //Ya que el servicio no nos trae el nombre entonces hacemos una busqueda para ver cual es el nombre
    //entre todas las empresas
    getNombreEmpresa() {
        for (var i=0; i<this.empresas.length; i++) {
            //console.log("id: " + this.empresas[i].id + ".... Buscando: " + this.perfil.org_organigrama_id)
            if(this.empresas[i].id == this.perfil.org_organigrama_id){
                this.perfil.organigrama = this.empresas[i].nombre;
                //console.log("Nombre es: " + this.perfil.organigrama);
            }
        }
    }


    // Boton Guardar -- Tiene que ir al Editar
    onSubmit() {
        let jsonData: string;

        this.submitted = true;

        jsonData = JSON.stringify(this.perfil);
        this.editarPerfilUsuario(jsonData);
    }

    onEdit() {
        this.editTable = !this.editTable;
    }

    editarPerfilUsuario(jsonData: string){

        this._usuarioService.editarPerfilUsuario(this.idPersona, this.perfil.id, jsonData)
            .subscribe(
                perfilActualizado => {
                    //console.log("Nuevo Perfil: " + JSON.stringify(perfilActualizado));

                    //this.mostrarMensaje("Perfil Actualizado exitosamente", true, false);

                    this.editTable = !this.editTable;
                    this.perfil = perfilActualizado;
                    this.getNombreEmpresa();


                },
                err => {
                    var msg = JSON.parse(err._body);
                    //this.mensajeAlerta = "Ha ocurrido un error al actualizar el perfil";
                    //this.mostrarMensajeError = true;

                    //this.mostrarMensaje("Error: " + msg, false, true);
                },
                () => {}
            );

    }

    volver() { 
        this._router.navigate(['EditarPerfilesUsuarioComponent', {id: this.idPersona}])
    }
    
    volverPrincipal() { 
        this._router.navigate(['EditarPrincipalPerfilComponent', 
                {id: this.idPersona, idPerfil: this.idPerfil}])
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