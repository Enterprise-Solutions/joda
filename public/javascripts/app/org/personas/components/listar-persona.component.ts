import {Component, OnInit} from '@angular/core';
import {Router, ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import {CrearPersonaComponent} from './crear-persona.component';
import {PersonaService} from '../services/persona.service';
import {Persona} from '../interfaces/persona.interface';

import {Notification} from "../../../utils/notification/interfaces/notification.interface";
import {NotificationComponent} from "../../../utils/notification/components/notification.component";

@Component({
    directives: [ROUTER_DIRECTIVES, NotificationComponent],
    providers: [PersonaService],
    template: require('./templates/listar-persona.template.html'),
    styles: [`.table th { text-align: center; }`]
})

export class ListarPersonaComponent implements OnInit {

    public headers = [{
        'descrip': 'Nombre',
        'columna': 'nombres',
        'ordenable': true
    },{
        'descrip': 'Apellido',
        'columna': 'apellidos',
        'ordenable': true
    },{
        'descrip': 'Doc. Principal',
        'columna': 'documento',
        'ordenable': true
    },{
        'descrip': 'Fecha Nac.',
        'columna': 'fecha_de_nacimiento',
        'ordenable': false
    }];

    public loadingData: boolean;

    public personas: Persona[];
    public numResults: number;

    public totalDePaginas = 0;
    public paginaActual = 1;

    // Default Params
    public search = {'nombre': undefined, 'documento': undefined};
    public pagination = {'pagina': 0, 'cantidad': 10};
    public order = {'sort': 'nombres', 'dir': 'asc'};

    // Componente Notificacion
    public verNotificacion: boolean;
    public notificacion: Notification;

    closeNotification(event: any) {
        this.verNotificacion = false;
    }

    constructor(
        private _router: Router,
        private _personaService: PersonaService) {}

    setDefaultParams() {
        this.search = {'nombre': undefined, 'documento': undefined};
    }

    ngOnInit() {
        this.loadingData = false;
        this.notificacion = new Notification();
        this.getPersonas();
    }

    getPersonas() {
        this.loadingData = true;
        this._personaService.getPersonas(this.search, this.pagination, this.order)
            .subscribe(
                response => {
                    this.personas = response.rows;
                    this.numResults = response.total;
                    this.paginaActual = this.pagination.pagina + 1;
                    this.totalDePaginas = Math.ceil(this.numResults / this.pagination.cantidad);
                },
                err => console.log("ERROR: " + err),
                () => {
                    console.log("GET Personas Complete");
                    this.loadingData = false;
                }
            );
    }

    nuevaPersona() {
        this._router.navigate(['CrearPersonaComponent']);
    }

    borrarPersona(persona_id: number) {
        let dialog = confirm("Esta seguro? Esta accion no se puede deshacer.");

        if (dialog) {
            this.loadingData = true;
            this._personaService.borrarPersona(persona_id)
                .subscribe(
                    response => {
                        this.verNotificacion = true;
                        this.notificacion.status ='success';
                        this.notificacion.message = 'Persona borrada exitosamente!';

                        setTimeout(() => { this.getPersonas(); }, 500);
                    },
                    err => {
                        this.getPersonas();
                        this.verNotificacion = true;
                        this.notificacion.status ='error';
                        this.notificacion.message = err._body;
                    },
                    () => {
                        this.loadingData = false;
                    }
                );
        }
    }

    changePage(newValue: number) {
        if (newValue <= 0){
            this.paginaActual = 1;
            this.pagination.pagina = 0;
        } else if(newValue > this.totalDePaginas) {
            this.paginaActual = this.totalDePaginas;
            this.pagination.pagina = this.paginaActual-1;
        } else {
            this.paginaActual = newValue;
            this.pagination.pagina = newValue-1;
        }
        this.getPersonas();
    }

    prevPage() {
        this.pagination.pagina -= 1;
        this.paginaActual -= 1;
        this.getPersonas();
    }

    nextPage() {
        this.pagination.pagina += 1;
        this.paginaActual += 1;
        this.getPersonas();
    }

    filtrar() {
        this.getPersonas();
    }

    limpiar() {
        this.setDefaultParams();
        this.getPersonas();
    }

    ordenar(head) {
        if (head.ordenable) {
            if (this.order.sort == head.columna) {
                this.order.dir = this.order.dir == 'asc' ? 'desc' : 'asc';
                this.getPersonas();
            } else {
                this.order.sort = head.columna;
                this.order.dir = 'asc';
                this.getPersonas();
            }
        }
    }
}
