import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router-deprecated';

import {UsuariosService} from '../services/usuarios.service';

import {Persona} from '../../../org/personas/interfaces/persona.interface';
import {PersonaDisponible} from '../interfaces/persona-disponible.interface';
import {Usuario} from '../interfaces/usuario.interface';

import {AutocompleteComponent} from '../../../utils/autocomplete/components/autocomplete.component';
import {CrearPersonaFormComponent} from '../../../org/personas/components/crear-persona-form.component';
import {ModalComponent} from '../../../utils/ng2-bs3-modal/components/modal';
import {ModalResult, MODAL_DIRECTIVES} from '../../../utils/ng2-bs3-modal/ng2-bs3-modal';
import {Notification} from '../../../utils/notification/interfaces/notification.interface';
import {NotificationComponent} from '../../../utils/notification/components/notification.component';

@Component({
    template: require('./templates/crear-usuario.template.html'),
    providers: [UsuariosService],
    directives: [AutocompleteComponent, CrearPersonaFormComponent, MODAL_DIRECTIVES, NotificationComponent]
})

export class CrearUsuarioComponent implements OnInit {
    public usuario: Usuario;
    public existePersona: boolean;

    public personaSeleccionada: PersonaDisponible;
    public personasDisponibles: PersonaDisponible[];
    public cadenaBuscada: string = "";
    public cadenaSeleccionada: string;

    // Modal
    @ViewChild('modal')
    public modal: ModalComponent;
    public animationsEnabled: boolean = true;

    onClose(result: ModalResult) { }

    // Componente Notificacion
    public verNotificacion: boolean;
    public notificacion: Notification;

    closeNotification(event: any) {
        this.verNotificacion = false;
    }

    constructor(
        private _router: Router,
        private _usuarioService: UsuariosService) { }

    ngOnInit() {
        this.notificacion = new Notification();
    }

    getPersonasDisponibles(cadenaBuscada: string) {
        this._usuarioService.getPersonasDisponibles(cadenaBuscada)
            .subscribe(
                response => {
                    this.personasDisponibles = response.rows;
                    for (var i=0; i<this.personasDisponibles.length; i++) {
                        this.personasDisponibles[i].nombres = this.personasDisponibles[i].nombre + ' ' + this.personasDisponibles[i].apellido + ' / ' + this.personasDisponibles[i].documento;
                    }
                },
                err => console.log("ERROR: " + err),
                () => console.log("GET Personas Disponibles Complete")
            );
    }

    seleccionarPersonaDisponible(persona: PersonaDisponible) {
        this.resetPersonasDisponibles();
        this.personaSeleccionada = persona;
        this.existePersona = true;

        this.usuario = new Usuario();
        this.usuario.org_persona_id = this.personaSeleccionada.id;
        this.usuario.estado = 'A';
    }

    resetPersonasDisponibles() {
        this.personasDisponibles = [];
    }

    agregarPersona(cadenaBuscada: string) {
        this.cadenaBuscada = cadenaBuscada;
        this.modal.open();
    }

    agregarUsuarioPersona(persona: Persona) {
        this.usuario = new Usuario();
        this.usuario.persona = persona;
        this.usuario.estado = 'A';

        this.existePersona = false;
        this.cadenaSeleccionada = persona.nombres + ' ' + persona.apellidos + ' / ' + persona.doc.documento;
        this.modal.close();
    }

    onSubmit() {
        let jsonData: string;

        jsonData = JSON.stringify(this.usuario);
        if (this.existePersona) {
            this.crearUsuario(jsonData);
        } else {
            this.crearUsuarioPersona(jsonData);
        }
    }

    crearUsuario(jsonData: string) {
        this._usuarioService.crearUsuario(jsonData)
            .subscribe(
                response => {
                    this.verNotificacion = true;
                    this.notificacion.status = 'success';
                    this.notificacion.message = 'Usuario creado exitosamente!';

                    setTimeout(() => {
                        this._router.navigate(['ListarUsuariosComponent']);
                    }, 300);
                },
                err => {
                    console.log("ERROR: " + err);

                    this.verNotificacion = true;
                    this.notificacion.status = 'error';
                    this.notificacion.message = err._body;
                },
                () => console.log("POST Usuario Complete")
            );
    }

    crearUsuarioPersona(jsonData: string) {
        this._usuarioService.crearUsuarioPersona(jsonData)
            .subscribe(
                response => {
                    this.verNotificacion = true;
                    this.notificacion.status = 'success';
                    this.notificacion.message = 'Usuario creado exitosamente!';

                    setTimeout(() => {
                        this._router.navigate(['ListarUsuariosComponent']);
                    }, 300);
                },
                err => {
                    console.log("ERROR: " + err);

                    this.verNotificacion = true;
                    this.notificacion.status = 'error';
                    this.notificacion.message = err._body;
                },
                () => console.log("POST Usuario Persona Complete")
            );
    }

    onCancel() {
        this._router.navigate(['ListarUsuariosComponent']);
    }
}