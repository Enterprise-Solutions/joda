import {Component, OnInit} from '@angular/core';
import {RouteConfig, RouterOutlet, ROUTER_DIRECTIVES, RouterLink} from '@angular/router-deprecated';

import {MenuService} from '../menu/services/menu.service';

import {TesHomeComponent} from './tes-home.component';
import {MarcacionesComponent} from "./marcaciones/marcaciones.component";

import {CasoUso} from '../menu/interface/caso-uso.interface';

@Component({
    directives: [RouterOutlet, RouterLink, ROUTER_DIRECTIVES],
    providers: [MenuService],
    template: `
		<div class="container-fluid">
			<div class="row">
				<div class="col-md-2">
					<ul class="nav nav-pills nav-stacked">
					    <!--<template [ngIf]="cusHabilitados">-->
							<!--<template ngFor let-cu [ngForOf]="cusHabilitados">-->
								<!--<template [ngIf]="cu.codigo == 'tes.emisoras'">-->
									<li>
                                        <a [routerLink]="['MarcacionesComponent']">
                                            <i class="fa fa-location-arrow fa-fw"></i>
                                            Ver de Marcaciones
                                        </a>
                                    </li>
								<!--</template>-->
							<!--</template>-->
						<!--</template>-->
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
    { path: '/', name: 'TesHomeComponent', component: TesHomeComponent },
    { path: '/marcaciones/...', name: 'MarcacionesComponent', component: MarcacionesComponent, useAsDefault: true }
])

export class MarcComponent implements OnInit {
    public cusHabilitados = [];
    public selectedCu: CasoUso;

    constructor(
        private _menuService: MenuService) {}

    ngOnInit() {
        this.selectedCu = new CasoUso();
        // this._menuService.getModules()
        //     .subscribe(
        //         response => {
        //             var modules = response.rows;
        //             for (var module of modules) {
        //                 if (module.codigo == 'tes') {
        //                     this.cusHabilitados = module.cus;
        //                     break;
        //                 }
        //             }
        //         },
        //         err => console.log("ERROR: " + err),
        //         () => {}
        //     );
    }

    selectCu(cu: CasoUso) {
        this.selectedCu = cu;
    }
}
