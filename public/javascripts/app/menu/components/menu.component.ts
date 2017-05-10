import {Component, OnInit} from '@angular/core';
import {RouteConfig, Router, RouterLink, ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import {MenuService} from '../services/menu.service';
import {UsuariosService} from "../../adm/usuarios/services/usuarios.service";

import {Perfil} from "../../adm/usuarios/interfaces/perfil.interface";
import {Modulo} from "../interface/modulo.interface";
import {MiPerfilComponent} from "./mi-perfil.component";
import {UsuariosComponent} from "../../tes/tes.component";
import {MarKComponent} from "../../tes/tes-marcaciones.component";

@Component({
	selector: 'app-menu',
    inputs: ['username', 'perfil','organigrama'],
	template: require('./templates/menu.template.html'),
	styles: ['.navbar-nav>li>.dropdown-menu { min-width: 400px; }'],
	providers: [MenuService, UsuariosService],
	directives: [RouterLink, ROUTER_DIRECTIVES]
})

// @RouteConfig([
//     { path: '/tes', name: 'TesComponent', component: TesComponent, useAsDefault: true }
// ])

export class MenuComponent implements OnInit {
	public modules: Modulo[];
	public selectedModule: Modulo;

	public perfiles : Perfil [];
    public selectedPerfil: Perfil;

    public username: string;
	public perfil: string;

	constructor(
        private _router: Router,
        private _menuService: MenuService,
        private _usuarioService: UsuariosService) { }

    ngOnInit() {
		//this.startMenuBar();
        //this.getPerfiles();

        this.selectedPerfil = new Perfil();
        this.selectedModule = new Modulo();
    }

    getPerfiles() {
		this._usuarioService.getPerfiles()
            .subscribe(
                perfiles => {
                    this.perfiles = perfiles.rows;
                },
                err => console.log("ERROR: " + err),
                () => {}
            );
    }

    startMenuBar() {
        this._menuService.getModules()
            .subscribe(
                modules => {
                    this.modules = modules.rows;
                },
                err => console.log("ERROR: " + err),
                () => {}
            );
	}

	onSelect(selectedModule) {
		this.selectedModule = selectedModule;

        switch(this.selectedModule.codigo){
            case "org":
                this._router.navigate(['OrgComponent']);
                break;
            case "adm":
                this._router.navigate(['AdmComponent']);
                break;
            case "cont":
                this._router.navigate(['ContComponent']);
                break;
            case "pro":
                this._router.navigate(['ProComponent']);
                break;
            case "prc":
                this._router.navigate(['PrcComponent']);
                break;
            case "cmp":
                this._router.navigate(['CmpComponent']);
                break;
            case "tes":
                this._router.navigate(['MarcComponent']);
                break;
            case "rrhh":
                this._router.navigate(['RrhhComponent']);
                break;
            case 'bco':
                this._router.navigate(['BcoComponent']);
                break;
            default:
                break;
        }
    }

    onPerfilSelect(selectedPerfil) {
        this.cambiarPerfilActual(selectedPerfil.id);
    }

    onMiPerfilSelect() {
        this._router.navigate(['MiPerfilComponent']);
    }

    cambiarPerfilActual(idPerfil) {
        this._usuarioService.cambiarPerfilActual(idPerfil)
            .subscribe(
                perfilActual => {
                    location.href = '/';
                },
                err => console.log("ERROR: " + err),
                () => {}
            );
    }
}