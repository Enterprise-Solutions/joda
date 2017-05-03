import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {AuthService} from "../auth/services/auth.service";
import {UsuariosService} from "./usuarios/services/usuarios.service";
import {RolService} from "./roles/services/rol.service";

@Component({
    providers: [AuthService, UsuariosService, RolService],
    template: require('./templates/adm-home.template.html')
})

export class AdmHomeComponent implements OnInit{
    public org_organigrama_id: number;
    public numeroUsuarios: number;
    public numeroRoles: number;

    public loadingUsuarios: boolean;
    public loadingRoles: boolean;

    constructor(
        private _authService: AuthService,
        private _usuariosService: UsuariosService,
        private _rolService: RolService) {}

    ngOnInit() {
        this.loadingUsuarios = false;
        this.loadingRoles = false;

        this._authService.getLoggerUsername()
            .subscribe(
                username => {
                    this.org_organigrama_id = username.org_organigrama_id;
                    this.getUsuarios();
                    this.getRoles();

                },
                err => console.log("ERROR: " + err),
                () => {}
            );


    }

    private getUsuarios():void {
        this.loadingUsuarios = true;

        this._usuariosService.getUsuarios()
            .subscribe(
                usuarios => {
                    this.numeroUsuarios = usuarios.total;

                },
                err => console.log("GET '/org/usuarios' => ERROR: " + err),
                () => {
                    setTimeout(() => {
                        this.loadingUsuarios = false;
                    }, 1000);


                }
            );
    }

    getRoles() {
        this.loadingRoles = true;

        this._rolService.getRoles(undefined, undefined, undefined)
            .subscribe(
                roles => {
                    this.numeroRoles = roles.total;
                },
                err => console.log("ERROR: " + err),
                () => {
                    setTimeout(() => {
                        this.loadingRoles = false;
                    }, 1000);
                }
            );
    }
}