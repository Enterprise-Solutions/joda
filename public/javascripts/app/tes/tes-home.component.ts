import {Component, OnInit} from '@angular/core';

import {AuthService} from "../auth/services/auth.service";
import {UserService} from "./usuarios/services/usuarios.service";

import {UsuarioL} from './usuarios/interfaces/usuarios.interface';

@Component({
    providers: [AuthService, UserService],
    template: require('./templates/tes-home.template.html')
})

export class TesHomeComponent implements OnInit {
    public org_organigrama_id: number;

    public loadingTarjetas: boolean;
    public tarjetas: UsuarioL[];
    public cantidadTarjetas: number;

    constructor(
        private _authService:AuthService,
        private _marcacionesService: UserService) { }

    ngOnInit() {
        this.loadingTarjetas = false;

    }

}