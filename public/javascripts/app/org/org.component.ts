import {Component, OnInit} from '@angular/core';
import {RouteConfig, RouterLink, RouterOutlet, RouteData, ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import {MenuService} from '../menu/services/menu.service';

// Importar los CU
import {OrgHomeComponent} from './org-home.component';
import {PersonasComponent} from './personas/personas.component';
import {OrganigramasComponent} from './organigramas/organigramas.component';
import {TiposDocumentoComponent} from './tipos-documento/tipos-documento.component';
import {CasoUso} from '../menu/interface/caso-uso.interface';
import {OrganizacionesComponent} from "./organizaciones/organizaciones.component";

@Component({
	directives: [RouterOutlet, RouterLink, ROUTER_DIRECTIVES],
	providers: [MenuService],
	template: `
		<div class="container-fluid">
			<div class="row">
				<div class="col-md-2">
					<ul class="nav nav-pills nav-stacked">
						<template [ngIf]="cusHabilitados">
							<template ngFor let-cu [ngForOf]="cusHabilitados">
								<template [ngIf]="cu.codigo == 'org.per'">
									<li [class.active]="cu.id == selectedCu.id" (click)="selectCu(cu)">
										<a [routerLink]="['PersonasComponent']">
											<i class="fa fa-users fa-fw"></i>
											Personas
										</a>
									</li>
								</template>

								<template [ngIf]="cu.codigo == 'org.org'">
									<li [class.active]="cu.id == selectedCu.id" (click)="selectCu(cu)">
										<a [routerLink]="['OrganizacionesComponent']">
											<i class="fa fa-building-o fa-fw"></i>
											Organizaciones
										</a>
									</li>
								</template>

								<template [ngIf]="cu.codigo == 'org.emp'">
									<li [class.active]="cu.id == selectedCu.id" (click)="selectCu(cu)">
										<a [routerLink]="['OrganigramasComponent']">
											<i class="fa fa-sitemap fa-fw"></i>
											Organigramas
										</a>
									</li>
								</template>

								<template [ngIf]="cu.codigo == 'org.tdoc'">
									<li [class.active]="cu.id == selectedCu.id" (click)="selectCu(cu)">
										<a [routerLink]="['TiposDocumentoComponent']">
											<i class="fa fa-credit-card fa-fw"></i>
											Tipos de Documento
										</a>
									</li>
								</template>
							</template>
						</template>
					</ul>
				</div>
				<div class="col-md-10">
					<router-outlet></router-outlet>
				</div>
			</div>
		</div>
	`
})

@RouteConfig([
	{ path: '/', name: 'OrgHomeComponent', component: OrgHomeComponent, useAsDefault: true },
	{ path: '/personas/...', name: 'PersonasComponent', component: PersonasComponent },
	{ path: '/organigramas/...', name: 'OrganigramasComponent', component: OrganigramasComponent },
	{ path: '/tipos-documentos/...', name: 'TiposDocumentoComponent', component: TiposDocumentoComponent },
    { path: '/organizaciones/...', name: 'OrganizacionesComponent', component: OrganizacionesComponent },
])

export class OrgComponent implements OnInit {
	public cusHabilitados = [];
	public selectedCu: CasoUso;

	constructor(
		private _menuService: MenuService) {}

	ngOnInit() {
		this.selectedCu = new CasoUso();
		this._menuService.getModules()
			.subscribe(
				response => {
					var modules = response.rows;
					for (var module of modules) {
						if (module.codigo == 'org') {
							this.cusHabilitados = module.cus;
							break;
						}
					}
				},
				err => console.log("ERROR: " + err),
				() => {}
			);
	}

	selectCu(cu: CasoUso) {
		this.selectedCu = cu;
	}
}
