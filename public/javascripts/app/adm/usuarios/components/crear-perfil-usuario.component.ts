import {Component} from '@angular/core';
import {Router, RouterLink, ROUTER_DIRECTIVES, RouteParams} from '@angular/router-deprecated';
import {OnInit} from '@angular/core';
import {Organigrama} from "../../../org/organigramas/interfaces/organigrama.interface";
import {OrganigramaService} from "../../../org/organigramas/services/organigrama.service";
import {Perfil} from "../interfaces/perfil.interface";
import {UsuariosService} from "../services/usuarios.service";
import {Usuario} from "../interfaces/usuario.interface";
import {NotificationComponent} from "../../../utils/notification/components/notification.component";
import {Notification} from "../../../utils/notification/interfaces/notification.interface";


@Component({
    template: require('./templates/crear-perfil-usuario.template.html'),
    directives: [ROUTER_DIRECTIVES, NotificationComponent],
    providers: [OrganigramaService, UsuariosService],
})

export class CrearPerfilUsuarioComponent  implements OnInit{
    public submitted = false;
    public perfil: Perfil;
    public idPersona: number;
    public empresas: Organigrama [];
    public empresaElegida: number;
    public nombrePerfil: string;
    public perfilPorDefecto: boolean;
    public usuario: Usuario;

    // Componente Notificacion
    public verNotificacion: boolean;
    public notificacion: Notification;

    constructor(
        private _router: Router,
        private _routeParams: RouteParams,
        private _organigramaService: OrganigramaService,
        private _usuarioService: UsuariosService) { }

    closeNotification(event: any) {
        this.verNotificacion = false;
    }


    // Inicializa el Formulario y las Interfaces
    ngOnInit() {
        this.idPersona = Number(this._routeParams.get('id'));
        this.notificacion = new Notification();

        this.perfil = new Perfil();
        this.nombrePerfil = "";
        this.perfilPorDefecto = false;

        this.getUsuario();
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

    getEmpresas() {
        this._organigramaService.getOrganigramas()
            .subscribe(
                empresas => {
                    this.empresas = empresas;

                    if (this.empresas.length) {
                        this.empresaElegida = this.empresas[0].id;
                    }

                    //console.log("Empresas: " + JSON.stringify(empresas))
                },
                err => console.log("GET '/org/usuarios' => ERROR: " + err),
                () => {}
            );
    }


    // Boton Guardar -- Tiene que ir al Editar
    onSubmit() {
        let jsonData: string;

        this.submitted = true;

        this.perfil.adm_usuario_id = Number(this.idPersona);
        this.perfil.nombre = this.nombrePerfil;
        this.perfil.org_organigrama_id = Number(this.empresaElegida);
        this.perfil.es_principal = this.perfilPorDefecto;

        jsonData = JSON.stringify(this.perfil);
        this.crearPerfilUsuario(jsonData);
    }

    // LLamada a servicioss
    crearPerfilUsuario(jsonData:string) {
        this._usuarioService.crearPerfilUsuario(this.idPersona, jsonData)
            .subscribe(
                perfilCreado => {
                    this.verNotificacion = true;
                    this.notificacion.status ='success';
                    this.notificacion.message = 'Perfil creado con exito';

                    setTimeout(() => {
                        this._router.navigate(['EditarPerfilesUsuarioComponent', {id: this.idPersona}])
                    }, 3000);

                },
                err => {
                    //this.mostrarMensaje("" + err._body, false, true);
                    this.verNotificacion = true;
                    this.notificacion.status ='error';
                    this.notificacion.message = err._body;
                },
                () => {}
            );
    }

    volver() { this._router.navigate(['EditarPerfilesUsuarioComponent', {id: this.idPersona}])}
}