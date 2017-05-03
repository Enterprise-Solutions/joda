import {Component, OnInit} from '@angular/core';

import {AuthService} from "../auth/services/auth.service";
import {MarcacionesService} from "./marcaciones/services/marcaciones.service";

import {Marcacion} from './marcaciones/interfaces/marcacion.interface';

@Component({
    providers: [AuthService, MarcacionesService],
    template: require('./templates/tes-home.template.html')
})

export class TesHomeComponent implements OnInit {
    public org_organigrama_id: number;

    public loadingTarjetas: boolean;
    public tarjetas: Marcacion[];
    public cantidadTarjetas: number;

    constructor(
        private _authService:AuthService,
        private _marcacionesService: MarcacionesService) { }

    ngOnInit() {
        this.loadingTarjetas = false;

        // this._authService.getLoggerUsername()
        //     .subscribe(
        //         response => {
        //             this.org_organigrama_id = response.org_organigrama_id;
        //             this.getTarjetas();
        //         },
        //         err => console.log("ERROR: " + err),
        //         () => console.log("AUTH Complete")
        //     );
    }

    private getTarjetas() {
        this.loadingTarjetas = true;

        this._marcacionesService.getTarjetas()
            .subscribe(
                response => {
                    this.tarjetas = response.rows;
                    this.cantidadTarjetas = response.total;
                },
                err => console.log("ERROR: ", err),
                () => {
                    this.loadingTarjetas = false;
                    console.log("GET Tarjetas Complete")
                }
            );
    }
}