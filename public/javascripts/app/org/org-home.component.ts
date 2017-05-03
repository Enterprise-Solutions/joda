import {Component} from '@angular/core';
import {OnInit} from '@angular/core';

import {PersonaService} from "./personas/services/persona.service";
import {OrganigramaService} from "./organigramas/services/organigrama.service";
import {TiposDocumentosService} from "./tipos-documento/services/tipos-documentos.service";
import {Persona} from "./personas/interfaces/persona.interface";
import {OrganizacionService} from "./organizaciones/services/organizacion.service";

@Component({
	providers: [PersonaService, OrganigramaService, TiposDocumentosService, OrganizacionService],
	template: require('./templates/org-home.template.html')
})

export class OrgHomeComponent implements OnInit {
	public numeroPersonas: number;
	public numeroOrganigramas: number;
	public numeroTiposDocumentos: number;
	public numeroOrganizaciones: number;

	public personas: [Persona]

	public loadingNumeroPersonas: boolean;
	public loadingOrganigramas: boolean;
	public loadingTiposDocumentos: boolean;
	public loadingOrganizaciones: boolean;

	constructor(
			private _personaService: PersonaService,
			private _organigramaService: OrganigramaService,
			private _tiposDocumentosService:TiposDocumentosService,
            private _organizacionesService: OrganizacionService) {}

	ngOnInit() {
		this.inicializarLoading();
		this.getPersonas();
		this.getOrganigramas();
		this.getTiposDocumentos();
        this.getOrganizaciones();
	}

	private inicializarLoading():void {
		this.loadingNumeroPersonas = false;
		this.loadingOrganigramas = false;
		this.loadingTiposDocumentos = false;
		this.loadingOrganizaciones = false;
	}

	getPersonas() {
		this.loadingNumeroPersonas = true;
		this._personaService.getPersonas(undefined, undefined, undefined)
				.subscribe(
						personas => {
							this.personas = personas.rows;
							this.numeroPersonas = personas.total;
						},
						err => console.log("GET '/org/personas' => ERROR: " + err),
						() => {
							setTimeout(() => {
								this.loadingNumeroPersonas = false;
							}, 1000);

						}
				);
	}

	getOrganigramas() {
		this.loadingOrganigramas = true;

		this._organigramaService.getOrganigramas()
				.subscribe(
						respuesta => {
							this.numeroOrganigramas = respuesta.length;
						},
						err => console.log('ERROR: ' + err),
						() => {
							setTimeout(() => {
								this.loadingOrganigramas = false;
							}, 1000);
						}
				);
	}

	getTiposDocumentos() {
		this.loadingTiposDocumentos = true;

		this._tiposDocumentosService.getTiposDocumentos(undefined, undefined, undefined)
				.subscribe(
						tiposDocumentos => {
							this.numeroTiposDocumentos = tiposDocumentos.total;
						},
						err => console.log("GET '/org/tipos-documento' => ERROR: " + err),
						() => {
							setTimeout(() => {
								this.loadingTiposDocumentos = false;
							}, 1000);
						}
				);
	}

    getOrganizaciones() {
		this.loadingOrganizaciones = true;

        this._organizacionesService.getOrganizaciones(undefined, undefined, undefined)
            .subscribe(
                response => {
                    this.numeroOrganizaciones = response.total;
                },
                err => console.log("GET '/org/organizaciones' => ERROR: " + err),
                () => {
					setTimeout(() => {
						this.loadingOrganizaciones = false;
					}, 1000);
                }
            );
    }


}