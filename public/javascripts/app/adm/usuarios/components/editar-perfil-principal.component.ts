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
    template: require('./templates/editar-perfil-principal.template.html'),
    directives: [ROUTER_DIRECTIVES, RolesUsuarioComponent,NotificationComponent],
    providers: [OrganigramaService, UsuariosService],
})

export class EditarPrincipalPerfilComponent  implements OnInit{
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
    public nombreBackup: string;
    public organigramaBackup: string;
    public organigramaIdBackup: number;
    public principalCheckBackup: boolean;

    // Componente Notificacion
    public verNotificacion: boolean;
    public notificacion: Notification;

    closeNotification(event: any) {
        this.verNotificacion = false;
    }

    // Tabs
    public tabs: Array<any> = [
        {id: 1, title: 'Datos Principales',  active: true},
        {id: 2, title: 'Roles',  active: false},
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
        this.perfil.org_organigrama_id = +this.perfil.org_organigrama_id;
        let jsonData: string;

        this.submitted = true;

        jsonData = JSON.stringify(this.perfil);
        this.editarPerfilUsuario(jsonData);
    }

    onEdit() {
        this.editTable = true;
        this.nombreBackup = this.perfil.nombre;
        this.organigramaBackup = this.perfil.organigrama;
        this.organigramaIdBackup = this.perfil.org_organigrama_id;
        this.principalCheckBackup = this.perfil.es_principal;
    }

    cancelar() {
        this.editTable = false;
        this.perfil.nombre = this.nombreBackup;
        this.perfil.organigrama = this.organigramaBackup;
        this.perfil.org_organigrama_id= +this.organigramaIdBackup;
        this.perfil.es_principal = this.principalCheckBackup;
    }

    editarPerfilUsuario(jsonData: string){

        this._usuarioService.editarPerfilUsuario(this.idPersona, this.perfil.id, jsonData)
            .subscribe(
                perfilActualizado => {
                    //console.log("Nuevo Perfil: " + JSON.stringify(perfilActualizado));

                    this.verNotificacion = true;
                    this.notificacion.status =  'success';
                    this.notificacion.message = 'Perfil actualizado con éxito';
                    setTimeout(() => {
                    }, 3000);

                    this.editTable = !this.editTable;
                    this.perfil = perfilActualizado;
                    this.getNombreEmpresa();
                },
                err => {
                    console.log("ERROR: " + err + " en JSON: " + JSON.stringify(err));
                    this.verNotificacion = true;
                    this.notificacion.status = 'error';
                    this.notificacion.message =  err._body;
                    this.cancelar();
                },
                () => {
                }
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