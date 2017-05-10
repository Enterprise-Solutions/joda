import 'core-js';
import 'reflect-metadata';
import 'zone.js/dist/zone';

import {Component, OnInit} from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';

// Importar los Modulos del Sistema (incluido MENU)
import {MenuComponent} from './menu/components/menu.component';

import {MarcComponent} from './tes/tes.component';

import {AuthService} from './auth/services/auth.service';
import { MODAL_DIRECTIVES } from './utils/ng2-bs3-modal/ng2-bs3-modal';
import {MiPerfilComponent} from "./menu/components/mi-perfil.component";

@Component({
    directives: [MenuComponent, ROUTER_DIRECTIVES, MODAL_DIRECTIVES],
    providers: [AuthService],
    selector: 'voyager',
    template: require('./voyager.template.html')
})

@RouteConfig([
    { path: '/marcaciones/...', name: 'MarcComponent', component: MarcComponent }
  ])

export class VoyagerComponent implements OnInit {
    public appName = 'Voyager';
    public appAuthor = 'Enterprise Solutions';

    public username:string;
    public perfil:string;
    public organigrama:string;

    constructor(private _authService:AuthService) {
    }

    ngOnInit() {


                    this.username = 'Diosnel Velázquez';
                    this.perfil = 'ADMIN';

                    this.organigrama = 'Anglo';

    }
}