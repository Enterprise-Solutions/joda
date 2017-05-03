import {Component} from '@angular/core';
import {Router, RouterLink, ROUTER_DIRECTIVES, RouteParams} from '@angular/router-deprecated';
import {OnInit} from '@angular/core';
import {Organigrama} from "../../../org/organigramas/interfaces/organigrama.interface";
import {OrganigramaService} from "../../../org/organigramas/services/organigrama.service";
import {Perfil} from "../interfaces/perfil.interface";
import {Area} from "../interfaces/area.interface";
import {PartesDisponibles} from "../interfaces/partes.interface";
import {UsuariosService} from "../services/usuarios.service";
import {RolesUsuarioComponent} from "./roles-usuario.component";
import {Usuario} from "../interfaces/usuario.interface";

import {NotificationComponent} from "../../../utils/notification/components/notification.component";
import {Notification} from "../../../utils/notification/interfaces/notification.interface";

@Component({
    template: require('./templates/editar-area-usuario.template.html'),
    directives: [ROUTER_DIRECTIVES, RolesUsuarioComponent,NotificationComponent],
    providers: [OrganigramaService, UsuariosService],
})

export class EditarAreaUsuarioComponent  implements OnInit{
    public submitted = false;
    public perfil: Perfil;
    public areas: Area[];
    public parteSeleccionada: PartesDisponibles;
    public partes: PartesDisponibles[];
    public idPersona: number;
    public idPerfil: number;
    public empresas: Organigrama [];
    public nombrePerfil: string;
    public perfilPorDefecto: boolean;
    public editTable: boolean;
    public es_principal: boolean;
    public usuario: Usuario;
    public cantAreas:number;
    public cantPartes:number;
    public auxNuevoId:number;
    public auxNewArea: Area;
    public agregando: boolean;

    // Componente Notificacion
    public verNotificacion: boolean;
    public notificacion: Notification;

    closeNotification(event: any) {
        this.verNotificacion = false;
    }

    // Tabs
    public tabs: Array<any> = [
        {id: 1, title: 'Datos Principales',  active: false},
        {id: 2, title: 'Roles',  active: false},
        {id: 3, title: 'Área de Gestión',  active: true}
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
        //this.getEmpresas();
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
                    this.getAreas();
                    this.getPartesDisponibles();

                    //console.log("Perfil: " + JSON.stringify(perfil));
                },
                err => console.log("GET ERROR: " + err),
                () => {}
            );
    }

    getAreas() {
        this._usuarioService.getPerfilAreas(this.idPersona, this.idPerfil, this.perfil.org_organigrama_id)
            .subscribe(
                area => {
                    this.areas = area.rows;
                    this.cantAreas = this.areas.length;

                    //console.log("Areas: " + JSON.stringify(area));
                },
                err => console.log("GET ERROR: " + err),
                () => {}
            );
    }

    getPartesDisponibles() {
        this._usuarioService.getPartesDisponibles(this.idPersona, this.idPerfil, this.perfil.org_organigrama_id)
            .subscribe(
                partes => {
                    this.partes = partes.rows;
                    this.cantPartes = this.partes.length;

                    //console.log("Partes: " + JSON.stringify(partes));
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

    agregarFila() {
        this.agregando = true;
        this.auxNewArea = new Area();
        this.auxNewArea.parte_tipo = '';
        this.auxNewArea.parte = this.partes[0].nombre;
        this.auxNewArea.id = 0;

        this.areas.push(this.auxNewArea);
        this.cantAreas = this.cantAreas + 1;
    }

    borrarFila() {
        this.agregando = false;
        this.parteSeleccionada = null;
        this.areas.pop();
        this.cantAreas = this.cantAreas - 1;
    }

    borrarArea(idPerfil, idParte) {
        var array = [];
        array.push(idParte);
        var jsonData = {
            "adm_usuario_perfil_id" : +idPerfil,
            "adm_usuario_perfil_organigrama_parte_id" : array
        };

        let dialog = confirm("Esta seguro? Esta accion no se puede deshacer.");

        if (dialog) {
            this._usuarioService.borrarAreaUsuario(this.idPersona, this.idPerfil, 
                                                    this.perfil.org_organigrama_id, JSON.stringify(jsonData))
                .subscribe(
                    response => {
                        this.getAreas();
                        this.verNotificacion = true;
                        this.notificacion.status =  'success';
                        this.notificacion.message = 'Área borrada con éxito';
                        setTimeout(() => {
                        }, 3000);
                    },
                    err =>  {
                        console.log("ERROR: " + err + " en JSON: " + JSON.stringify(err));
                        this.verNotificacion = true;
                        this.notificacion.status = 'error';
                        this.notificacion.message =  err._body;
                    },
                    () => {}
                );
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
                    this.verNotificacion = true;
                    this.notificacion.status =  'success';
                    this.notificacion.message = 'Perfil Actualizado con éxito';
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
                },
                () => {}
            );

    }

    volver() { this._router.navigate(['EditarPerfilesUsuarioComponent', {id: this.idPersona}])}

    volverPrincipal() { 
        this._router.navigate(['EditarPrincipalPerfilComponent', 
                {id: this.idPersona, idPerfil: this.idPerfil}])
    }

    onChangeCombo(nuevo: PartesDisponibles) {
        this.areas[this.cantAreas-1].parte = nuevo.nombre;
        this.areas[this.cantAreas-1].parte_tipo = nuevo.org_organigrama_parte_tipo_id;
        this.auxNuevoId = nuevo.id;
        //this.tieneTimbrado = tipo.con_timbrado;
    }

    crearArea () {
        if (this.auxNuevoId){
            var array = [];
            array.push(this.auxNuevoId);
            var jsonData = {
                "adm_usuario_perfil_id" : this.perfil.id,
                "org_organigrama_parte_id" : array
            };

            this._usuarioService.crearAreaUsuario(this.idPersona, this.idPerfil, 
                                                    this.perfil.org_organigrama_id, JSON.stringify(jsonData))
            .subscribe(
                response => {
                    this.getAreas();
                    this.agregando = false;
                    this.parteSeleccionada = null;
                    this.verNotificacion = true;
                    this.notificacion.status =  'success';
                    this.notificacion.message = 'Área creada con éxito';
                    setTimeout(() => {
                    }, 3000);
                },
                err =>  {
                    console.log("ERROR: " + err + " en JSON: " + JSON.stringify(err));
                    this.verNotificacion = true;
                    this.notificacion.status = 'error';
                    this.notificacion.message =  err._body;
                },
                () => {}
            );
        }
    }
}