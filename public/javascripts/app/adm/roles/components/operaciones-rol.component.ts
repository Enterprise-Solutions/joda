import {Component, OnInit, ViewChild} from '@angular/core';

import { MODAL_DIRECTIVES, ModalResult } from '../../../utils/ng2-bs3-modal/ng2-bs3-modal';
import {ModalComponent} from "../../../utils/ng2-bs3-modal/components/modal";

import {AuthService} from "../../../auth/services/auth.service";
import {OperacionesService} from "../services/operaciones.service";
import {OperacionesRolService} from "../services/operaciones-rol.service";

import {Modulo} from '../../../menu/interface/modulo.interface';
import {CasoUso} from '../../../menu/interface/caso-uso.interface';
import {Operacion} from '../../../menu/interface/operacion.interface';
import {RolOperacion} from '../interfaces/rol-operacion.interface';
import {OperacionDisponible} from "../interfaces/operacion-disponibles.interface";

@Component({
    inputs: ['rolId'],
    selector: 'operaciones',
    directives: [MODAL_DIRECTIVES],
    providers: [OperacionesService, OperacionesRolService],
    templateUrl: '/assets/javascripts/app/adm/roles/components/templates/operaciones-rol.template.html',
    styles: [`.table th { text-align: center; }`]
})

export class OperacionesRolComponent implements OnInit {
    public org_organigrama_id: number;
    public rolId: number;

    public modulos: Modulo[];
    public moduloSeleccionado: Modulo;
    public casoUsoSeleccionado: CasoUso;
    public ultimoModuloSeleccionadoId: number;

    public codigosOperacionesHabilitadas = [];
    public operacionesHabilitadas: RolOperacion[] = [];

    public idOperacionesModificadas = [];
    public operacionesModificadas: Operacion[] = [];

    public operacionesParaInsertar = [];
    public operacionesParaEliminar = [];
    public codigosOperacionesParaEliminar = [];

    public mensajeAlerta;
    public mostrarMensajeExito: boolean;
    public mostrarMensajeError: boolean;

    constructor(
        private _authService: AuthService,
        private _operacionesService: OperacionesService,
        private _operacionesRolService: OperacionesRolService) { }

    ngOnInit() {
        this.mostrarMensajeExito = false;
        this.mostrarMensajeError = false;

        this.moduloSeleccionado = undefined;
        this.casoUsoSeleccionado = undefined;
        this.ultimoModuloSeleccionadoId = undefined;

        this._authService.getLoggerUsername()
            .subscribe(
                usuario => {
                    this.org_organigrama_id = usuario.org_organigrama_id;

                    // 1. Obtener las operaciones asociadas al Rol
                    this.getOperacionesDeRol();
                },
                err => console.log("ERROR: " + err),
                () => {}
            );
    }

    getOperacionesDeRol() {
        this.resetContadores();

        this._operacionesRolService.getOperacionesDeRol(this.rolId)
            .subscribe(
                response => {
                    var modulosDeRol = response.rows;

                    for (var moduloDeRol of modulosDeRol) {
                        for (var casoUsoDeRol of moduloDeRol.cus) {
                            for (var operacionDeRol of casoUsoDeRol.rops) {
                                this.operacionesHabilitadas.push(operacionDeRol);
                                this.codigosOperacionesHabilitadas.push(operacionDeRol.codigo);
                            }
                        }
                    }

                    // 2. Obtener las Operaciones del Sistema
                    this.getOperacionesDelSistema();
                },
                err => console.log("ERROR: " + err),
                () => console.log("GET Operaciones de Rol Complete")
            );
    }

    getOperacionesDelSistema() {
        this._operacionesService.getOperaciones()
            .subscribe(
                response => {
                    this.modulos = response.rows;
                    for (var i=0; i<this.modulos.length; i++) {
                        this.modulos[i].isOpen = false;
                    }
                },
                err => console.log("ERROR: " + err),
                () => console.log("GET Operaciones del Sistema Complete")
            );
    }

    selectModulo(modulo: Modulo) {
        var moduloSeleccionadoId = this.modulos.indexOf(modulo);
        this.modulos[moduloSeleccionadoId].isOpen = !this.modulos[moduloSeleccionadoId].isOpen;

        if (this.ultimoModuloSeleccionadoId !== undefined) {
            if (this.ultimoModuloSeleccionadoId !== moduloSeleccionadoId) {
                this.modulos[this.ultimoModuloSeleccionadoId].isOpen = false;
            }
        }

        this.ultimoModuloSeleccionadoId = moduloSeleccionadoId;
        this.moduloSeleccionado = this.modulos[moduloSeleccionadoId];
        this.casoUsoSeleccionado = undefined;
    }

    selectCasoUso(casoUso: CasoUso) {
        this.casoUsoSeleccionado = casoUso;
    }

    tieneOperacion(codigo: string) {
        return !(this.codigosOperacionesHabilitadas.indexOf(codigo) == -1);
    }

    marcarDesmarcarOperacion(event, operacion: Operacion) {
        let indiceBuscado = this.idOperacionesModificadas.indexOf(operacion.id);

        if (indiceBuscado == -1) {
            operacion.isChecked = event.target.checked;
            this.idOperacionesModificadas.push(operacion.id);
            this.operacionesModificadas.push(operacion);
        } else {
            this.operacionesModificadas[indiceBuscado].isChecked = event.target.checked;
        }
    }

    actualizarPermisos() {
        for (var operacionModificada of this.operacionesModificadas) {
            if (this.tieneOperacion(operacionModificada.codigo)) {
                if (!operacionModificada.isChecked) {
                    var indice = this.codigosOperacionesHabilitadas.indexOf(operacionModificada.codigo);
                    this.operacionesParaEliminar.push(this.operacionesHabilitadas[indice].id);
                    this.codigosOperacionesParaEliminar.push(operacionModificada.codigo);
                }
            } else {
                if (operacionModificada.isChecked) {
                    this.operacionesParaInsertar.push(operacionModificada.id);
                }
            }
        }

        if (this.operacionesParaEliminar.length) {
            this.eliminarPermisos();
        } else if (this.operacionesParaInsertar.length) {
            this.insertarPermisos();
        }
    }

    eliminarPermisos() {
        let jsonData: string;
        jsonData = JSON.stringify({
            adm_rol_id: Number(this.rolId),
            adm_rol_operacion_id: this.operacionesParaEliminar
        });

        this._operacionesRolService.borrarOperacion(this.rolId, jsonData)
            .subscribe(
                response => {
                    for (var operacionEliminada of this.codigosOperacionesParaEliminar) {
                        var index = this.codigosOperacionesHabilitadas.indexOf(operacionEliminada);

                        if (index != -1) {
                            this.operacionesHabilitadas.splice(index, 1);
                            this.codigosOperacionesHabilitadas.splice(index, 1);
                        }
                    }

                    if (this.operacionesParaInsertar.length) {
                        this.insertarPermisos();
                    } else {
                        this.resetContadores();
                        this.selectCasoUso(this.casoUsoSeleccionado);
                        this.mostrarMensaje("Permisos actualizados correctamente", true, false);
                    }
                },
                err => console.log("ERROR: " + err),
                () => console.log("DEL Operaciones de Rol Complete")
            );
    }

    insertarPermisos() {
        let jsonData: string;
        jsonData = JSON.stringify({
            adm_rol_id: Number(this.rolId),
            adm_operacion_id: this.operacionesParaInsertar
        });

        this._operacionesRolService.crearRolOperaciones(this.rolId, jsonData)
            .subscribe(
                response => {
                    for (var operacionAgregada of response) {
                        this.operacionesHabilitadas.push(operacionAgregada);
                        this.codigosOperacionesHabilitadas.push(operacionAgregada.codigo);
                    }

                    this.resetContadores();
                    this.selectCasoUso(this.casoUsoSeleccionado);
                    this.mostrarMensaje("Permisos actualizados correctamente", true, false);
                },
                err => console.log("ERROR: " + err),
                () => console.log("INS Operaciones de Rol Complete")
            );
    }

    resetContadores() {
        this.idOperacionesModificadas = [];
        this.operacionesModificadas = [];

        this.operacionesParaInsertar = [];
        this.operacionesParaEliminar = [];
        this.codigosOperacionesParaEliminar = [];
    }

    mostrarMensaje(mensaje: String, exito: boolean, error: boolean) {

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
            }, 3000);
        }
    }
}