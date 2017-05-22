import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {AuthService} from '../../../auth/services/auth.service';

import {NotificationComponent} from '../../../utils/notification/components/notification.component';
import {NuevoLugar} from "../interfaces/lugares.interface";
import {LugarService} from "../services/lugares.service";

@Component({
    providers: [LugarService],
    directives: [NotificationComponent, ROUTER_DIRECTIVES],
    template: require('./templates/nuevo_lugar.template.html'),
    styles: [`
        .table > tbody > tr > td {
            vertical-align: middle;
        }
    `]
})

export class NuevoLugarComponent{

    public place = new NuevoLugar();

    constructor(
        private _placesService: LugarService) { }


    getdataNewPlace() {
        this._placesService.sendDataLugar(this.place)
            .subscribe(
                response => {
                    console.log(JSON.stringify(response))
                },
                err => console.log('ERROR: ' + err),
                () => console.log('Crear lugar')
            );
    }

}

/**
 * Created by joaqui on 22/05/17.
 */
