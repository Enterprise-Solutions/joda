import {Component, OnInit} from '@angular/core';
import {RouteParams, Router} from '@angular/router-deprecated';

import {PersonaService} from '../services/persona.service';
import {Persona}    from '../interfaces/persona.interface';

import {Notification} from "../../../utils/notification/interfaces/notification.interface";
import {NotificationComponent} from "../../../utils/notification/components/notification.component";
import {MyDatePicker} from "../../../my-date-picker/my-date-picker.component";

@Component({
    providers: [PersonaService],
    directives: [MyDatePicker, NotificationComponent],
    template: require('./templates/editar-persona.template.html')
})

export class EditarPersonaComponent implements OnInit {
    public persona: Persona;
    public fechaNacimiento: string = "";

    private myDatePickerOptions = {
        todayBtnTxt: 'Hoy',
        dateFormat: 'dd/mm/yyyy',
        firstDayOfWeek: 'mo',
        sunHighlight: true,
        height: '35px',
        width: '360px',
        inline: false
    };

    // Tabs
    public tabs: Array<any> = [
        {id: 1, title: 'Datos Generales',  active: true},
        {id: 2, title: 'Documentos',  active: false},
        {id: 3, title: 'Direcciones',  active: false},
        {id: 4, title: 'Contactos',  active: false}
    ];

    gotoTab(tab: any) {
        switch (tab.id) {
            case 1:
                this._router.navigate(['EditarPersonaComponent', {id: this.persona.id}]);
                break;
            case 2:
                this._router.navigate(['DocumentosPersonaComponent', {id: this.persona.id}]);
                break;
            case 3:
                this._router.navigate(['DireccionesPersonaComponent', {id: this.persona.id}]);
                break;
            case 4:
                this._router.navigate(['ContactosPersonaComponent', {id: this.persona.id}]);
                break;
            default: break;
        }
    }

    // Componente Notificacion
    public verNotificacion: boolean;
    public notificacion: Notification;

    closeNotification(event: any) {
        this.verNotificacion = false;
    }

    constructor(
        private _router: Router,
        private _routeParams: RouteParams,
        private _personaService: PersonaService) { }

    ngOnInit() {
        this.notificacion = new Notification();
        let id = this._routeParams.get('id');

        this._personaService.getPersona(id)
            .subscribe(
                response => {
                    this.persona = response;
                    if (!this.persona.fecha_de_nacimiento) {
                        this.persona.fecha_de_nacimiento = '';
                    }

                    if (this.persona.fecha_de_nacimiento != undefined) {
                        this.fechaNacimiento = this.persona.fecha_de_nacimiento;
                    }
                },
                err => console.log("ERROR: " + err),
                () =>  console.log("GET Persona Complete")
            );
    }

    onSubmit() {
        var jsonData: string;
        jsonData = JSON.stringify(this.persona);
        this.editarPersona(jsonData);
    }

    editarPersona(jsonData: string) {
        this._personaService.editarPersona(this.persona.id, jsonData)
            .subscribe(
                response => {
                    this.verNotificacion = true;
                    this.notificacion.status =  'success';
                    this.notificacion.message = 'Persona editada exitosamente!';

                    setTimeout(() => { this.listarPersonas(); }, 500);
                },
                err => {
                    console.log("ERROR: " + err);

                    this.verNotificacion = true;
                    this.notificacion.status = 'error';
                    this.notificacion.message =  err._body;
                },
                () =>  console.log("PUT Persona Complete")
            );
    }

    listarPersonas() {
        this._router.navigate(['ListarPersonaComponent']);
    }

    preZero(val:string):string {
        // Prepend zero if smaller than 10
        return parseInt(val) < 10 ? '0' + val : val;
    }

    onDateChanged(event) {
        this.persona.fecha_de_nacimiento =  this.preZero(event.date.day) + "/" + this.preZero(event.date.month) + "/" + event.date.year;
    }
}