import {Component, Input, Output, EventEmitter, OnChanges, OnInit} from '@angular/core';
import {Router} from '@angular/router-deprecated';

import {Persona}    from '../interfaces/persona.interface';
import {Documento} from '../../documentos/interfaces/documento.interface';
import {Direccion} from '../../direcciones/interfaces/direccion.interface';
import {DocumentoTipo} from '../../documentos/interfaces/documento-tipo.interface';

import {PersonaService} from '../services/persona.service';
import {MyDatePicker} from "../../../my-date-picker/my-date-picker.component";

import {Notification} from "../../../utils/notification/interfaces/notification.interface";
import {NotificationComponent} from "../../../utils/notification/components/notification.component";

@Component({
    selector: 'persona-form',
    providers: [PersonaService],
    directives: [MyDatePicker, NotificationComponent],
    template: require('./templates/crear-persona-form.template.html')
})

export class CrearPersonaFormComponent implements OnInit, OnChanges {
    @Input() fromModal: boolean;
    @Input() data: string = "";
    @Output() personaCreada = new EventEmitter();

    public persona: Persona;
    public dir: Direccion;
    public tipoDocumentos: DocumentoTipo[];
    public tipoDocumentoSeleccionado: DocumentoTipo;

    // Inicio DatePicker
    private myDatePickerOptions = {
        todayBtnTxt: 'Hoy',
        dateFormat: 'dd/mm/yyyy',
        firstDayOfWeek: 'mo',
        sunHighlight: true,
        height: '35px',
        width: '360px',
        inline: false
    };

    public fechaNacimiento = new Date();

    // Componente Notificacion
    public verNotificacion: boolean;
    public notificacion: Notification;

    closeNotification(event: any) {
        this.verNotificacion = false;
    }

    constructor(
        private _router:Router,
        private _personaService:PersonaService) {
    }

    // Inicializa el Formulario y las Interfaces
    ngOnInit() {
        this.notificacion = new Notification();

        this.getTipoDocumentos();
    }

    ngOnChanges() {
        console.log("llamando a onChanges");

        this.persona = new Persona();
        this.persona.doc = new Documento();
        this.persona.fecha_de_nacimiento = "";

        if (!isNaN(parseInt(this.data.at(0)))) {
            this.persona.doc.documento = this.data;
        } else {
            this.persona.nombres = this.data;
        }

        this.dir = new Direccion();
        this.dir.es_principal = false;

    }

    preZero(val:string):string {
        // Prepend zero if smaller than 10
        return parseInt(val) < 10 ? '0' + val : val;
    }

    onDateChanged(event) {
        if (event.date.day != undefined) {
            this.persona.fecha_de_nacimiento = this.preZero(event.date.day) + "/" + this.preZero(event.date.month) + "/" + event.date.year;
        } else {
            this.persona.fecha_de_nacimiento = "";
        }

        // date selected
        console.log('Formatted date: ', event.formatted);

    }

    // Obtiene los tipos de Documento para SELECT
    getTipoDocumentos() {
        this._personaService.getTipoDocumentos()
            .subscribe(
                response => this.tipoDocumentos = response,
                err => console.log("ERROR: " + err),
                () => {}
            );
    }

    onCancel() {
        if (!this.fromModal) {
            this.listarPersona();
        } else {
            this.personaCreada.emit(null);
        }
    }

    // Boton Cancelar -- Vuelve al Listado
    listarPersona() {
        this._router.navigate(['ListarPersonaComponent']);
    }

    // Boton Guardar -- Tiene que ir al Editar
    onSubmit() {
        let jsonData:string;

        this.persona.doc.org_documento_tipo_id = +this.tipoDocumentoSeleccionado.id;
        this.persona.doc.tipo = this.tipoDocumentoSeleccionado.nombre;

        if (this.dir.es_principal) {
            this.persona.dir = this.dir;
        }

        if (!this.fromModal) {
            jsonData = JSON.stringify(this.persona);
            this.crearPersona(jsonData);
        } else {
            this.personaCreada.emit(this.persona);
        }
    }

    // LLamada a servicioss
    crearPersona(jsonData: string) {
        this._personaService.crearPersona(jsonData)
            .subscribe(
                response => {
                    this.verNotificacion = true;
                    this.notificacion.status =  'success';
                    this.notificacion.message = 'Persona creada exitosamente!';

                    setTimeout(() => {
                        this._router.navigate(['EditarPersonaComponent', {id: response.id}])
                    }, 500);
                },
                err => {
                    console.log("ERROR: " + err);

                    this.verNotificacion = true;
                    this.notificacion.status = 'error';
                    this.notificacion.message =  err._body;
                },
                () => {}
            );
    }
}