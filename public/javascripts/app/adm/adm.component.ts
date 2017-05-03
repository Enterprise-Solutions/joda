import {Component, OnInit} from '@angular/core';
import {RouteConfig, RouterLink, RouterOutlet, ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import {MenuService} from '../menu/services/menu.service';
import {CasoUso} from '../menu/interface/caso-uso.interface';

import {AdmHomeComponent} from './adm-home.component';
import {UsuariosComponent} from './usuarios/usuarios.component';
import {RolesComponent} from "./roles/roles.component";

@Component({
    template: require('./templates/adm.template.html'),
    providers: [MenuService],
    directives: [RouterOutlet, RouterLink, ROUTER_DIRECTIVES],
})

@RouteConfig([
    { path: '/', name: 'AdmHomeComponent', component: AdmHomeComponent, useAsDefault: true },
    { path: '/usuarios/...', name: 'UsuariosComponent', component: UsuariosComponent },
    { path: '/roles/...', name: 'RolesComponent', component: RolesComponent },
])

export class AdmComponent implements OnInit {
    public cusHabilitados = [];
    public selectedCu: CasoUso;

    constructor(
        private _menuService: MenuService) {}

    ngOnInit() {
        this.selectedCu = new CasoUso();
        this._menuService.getModules()
            .subscribe(
                response => {
                    var modules = response.rows;
                    for (var module of modules) {
                        if (module.codigo == 'adm') {
                            this.cusHabilitados = module.cus;
                            break;
                        }
                    }
                },
                err => console.log("ERROR: " + err),
                () => {}
            );
    }

    selectCu(cu: CasoUso) {
        this.selectedCu = cu;
    }
}
