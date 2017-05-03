import {Component} from '@angular/core';
import {NgForm, CORE_DIRECTIVES}    from '@angular/common';
import {Router} from '@angular/router-deprecated';
import {OnInit} from '@angular/core';
import {Persona} from "../../../org/personas/interfaces/persona.interface";
import {DocumentoTipo} from "../../../org/documentos/interfaces/documento-tipo.interface";
import {Documento} from "../../../org/documentos/interfaces/documento.interface";
import {PersonaService} from "../../../org/personas/services/persona.service";
import {Usuario} from "../interfaces/usuario.interface";
import {UsuariosService} from "../services/usuarios.service";
import {ListarUsuariosComponent} from "./listar-usuarios.component";
import {DatePickerComponent} from "../../../datepicker/components/datepicker.component";
import {Estado} from "../interfaces/estado.interface";


@Component({
    directives: [DatePickerComponent],
    inputs: ['idPersona', 'crearNuevaPersona'],
    selector: 'usuario-form',
    providers: [PersonaService, UsuariosService],
    template: require('./templates/crear-usuario-form.template.html')
})

export class CrearUsuarioFormComponent implements OnInit {
    public persona: Persona;
    public estados: Estado[];
    public usuario: Usuario;
    public idPersona: number;
    public estadoSeleccionado: string;
    public crearNuevaPersona: boolean;
    public tipoDocumentos: DocumentoTipo[];
    public submitted = false;
    public passwordIguales = true;

    // Inicio DatePicker
    private myDatePickerOptions = {
        todayBtnTxt: 'Hoy',
        dateFormat: 'dd/mm/yyyy',
        firstDayOfWeek: 'mo',
        sunHighlight: true,
        height: '34px',
        width: '360px'
    };

    public mensajeAlerta;
    public mostrarMensajeExito: boolean;
    public mostrarMensajeError: boolean;

    public hoy:string = "";

    constructor(
        private _router: Router,
        private _personaService: PersonaService,
        private _usuarioService: UsuariosService) { }

    ngOnInit() {
        console.log("ID recibido desde crear usuario: " + this.idPersona + " y crear persona: " + this.crearNuevaPersona);

        this.persona = new Persona();
        this.usuario = new Usuario();
        this.persona.doc = new Documento();
        this.persona.fecha_de_nacimiento = "";

        this.mostrarMensajeExito = false;
        this.mostrarMensajeError = false;

        this.getTipoDocumentos();
        this.getEstados();

        if(this.idPersona != undefined){
            this.getPersona();
        }

    }

    preZero(val:string):string {
        // Prepend zero if smaller than 10
        return parseInt(val) < 10 ? '0' + val : val;
    }

    onDateChanged(event) {
        this.persona.fecha_de_nacimiento =  this.preZero(event.date.day) + "/" + this.preZero(event.date.month) + "/" + event.date.year;
    }

    // Obtiene los tipos de Documento para SELECT
    getTipoDocumentos() {
        this._personaService.getTipoDocumentos()
            .subscribe(
                tipoDocumentos => this.tipoDocumentos = tipoDocumentos,
                err => console.log("ERROR: " + err),
                () => console.log("GET Complete: " + JSON.stringify(this.tipoDocumentos))
            );
    }

    //Obtiene los estados para el SELECT
    getEstados() {
        this._usuarioService.getEstados()
            .subscribe(
                estados => {
                    this.estadoSeleccionado = undefined;
                    this.estados = estados.rows;
                },

                err => {
                    console.log("ERROR: " + err._body);
                },
                () => {
                    //console.log("GET Complete: " + JSON.stringify(this.tipoDocumentos))
                }
            );
    }

    // Obtiene los tipos de Documento para SELECT
    getPersona() {
        this._personaService.getPersona(this.idPersona)
            .subscribe(
                persona => this.persona = persona,
                err => console.log("ERROR: " + err),
                () => console.log("GET Complete: " + JSON.stringify(this.persona))
            );
    }

    // Boton Guardar -- Tiene que ir al Editar
    onSubmit() {
        let jsonData: string;

        this.usuario.estado = this.estadoSeleccionado;

        this.comparePasswords();

        //Si password
        if(this.passwordIguales){
            //Caso en que se quiera crear un usuario y persona a la vez
            if(this.crearNuevaPersona){
                //TODO: se comento esto para la nueva version. Ver si funciona bien
                if (typeof this.persona.doc.org_documento_tipo_id == "string" /*|| this.persona.doc.org_documento_tipo_id instanceof String*/) {
                    this.persona.doc.org_documento_tipo_id = Number(this.persona.doc.org_documento_tipo_id);
                }

                this.usuario.persona = this.persona;

                if(this.usuario.persona.fecha_de_nacimiento == ""){
                    this.usuario.persona.fecha_de_nacimiento = undefined;
                }
            } else {
                this.usuario.org_persona_id = this.idPersona;
            }



            jsonData = JSON.stringify(this.usuario);
            console.log("Json a enviar para creacion de usuario: " + JSON.stringify(jsonData));

            this.submitted = true;

            this.crearUsuario(jsonData);
        }

    }

    //Comparamos los passwords para ver si coinciden
    comparePasswords(){
        if(this.usuario.password.localeCompare(this.usuario.confirmar_pass) != 0){
            console.log("Passwords son distintos");
            this.passwordIguales = false;
        } else {
            console.log("Passwords son iguales");
            this.passwordIguales = true;
        }
    }

    // LLamada a servicioss
    crearUsuario(jsonData:string) {
        if(this.crearNuevaPersona){
            this._usuarioService.crearUsuarioPersona(jsonData)
                .subscribe(
                    response => {
                        this.mostrarMensaje("Usuario creado exitosamente", true, false);
                        this._router.navigate(['EditarUsuarioComponent', {id: response.id}]);
                    },
                    err => {
                        var msg = JSON.parse(err._body);
                        this.mostrarMensaje(""+msg._body, false, true);
                    },
                    () => console.log("POST Usuario Complete")
                );
        } else {
            this._usuarioService.crearUsuario(jsonData)
                .subscribe(
                    response => {
                        this.mostrarMensaje("Usuario creado exitosamente", true, false);
                        this._router.navigate(['EditarUsuarioComponent', {id: response.id}]);
                    },
                    err => {
                        var msg = JSON.parse(err._body);
                        this.mostrarMensaje(""+msg._body, false, true);
                    },
                    () => console.log("POST Usuario Complete")
                );
        }
    }

    volver() {
        this._router.navigate(['ListarUsuariosComponent'])
    }

    mostrarMensaje(mensaje: String, exito: boolean, error: boolean){

        this.mostrarMensajeExito = exito;
        this.mostrarMensajeError = error;

        if (exito) {
            this.mensajeAlerta = mensaje;

            setTimeout(() => {
                this.mostrarMensajeExito = !exito;
            }, 3000);
        } else {
            this.mensajeAlerta = mensaje;

            setTimeout(() => {
                this.mostrarMensajeError = !error;
            }, 4000);

        }
    }

}