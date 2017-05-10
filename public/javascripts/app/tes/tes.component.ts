import {Component, OnInit} from '@angular/core';
import {RouteConfig, RouterOutlet, ROUTER_DIRECTIVES, RouterLink} from '@angular/router-deprecated';

import {MenuService} from '../menu/services/menu.service';

import {TesHomeComponent} from './tes-home.component';
import {MarcacionesComponent} from "./usuarios/marcaciones.component";
import {CrearUsuarioComponent} from './usuarios/components/crear_nuevousuario.component';
import {HorasLaburadasComponent} from './usuarios/components/horas_trabajadas.component';

import {CasoUso} from '../menu/interface/caso-uso.interface';

@Component({
  directives: [RouterOutlet, RouterLink, ROUTER_DIRECTIVES],
  providers: [MenuService],
  template: `
		<div class="container-fluid">
			<div class="row">
				<div class="col-md-2">
					<ul class="nav nav-pills nav-stacked">
							<li>
                  <a [routerLink]="['MarcacionesComponent']">
                      <i class="fa fa-location-arrow fa-fw"></i>
                      Ver lista de Usuarios
                  </a>
                  <a [routerLink]="['CrearUsuarioComponent']">
                      <i class="fa fa-location-arrow fa-fw"></i>
                      Crear nuevo usuario
                  </a>
                  <a [routerLink]="['HorasLaburadasComponent']">
                      <i class="fa fa-location-arrow fa-fw"></i>
                      Consulta de horas trabajadas
                  </a>
              </li>					
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
  { path: '/marcaciones/...', name: 'MarcacionesComponent', component: MarcacionesComponent, useAsDefault: true},
  { path : '/crearusuario', name: 'CrearUsuarioComponent', component: CrearUsuarioComponent},
  { path : '/horastrabajadas', name: 'HorasLaburadasComponent', component: HorasLaburadasComponent}
])

export class MarcComponent implements OnInit {
  public cusHabilitados = [];
  public selectedCu: CasoUso;

  constructor(
    private _menuService: MenuService) { }

  ngOnInit() {
    this.selectedCu = new CasoUso();
  }

  selectCu(cu: CasoUso) {
    this.selectedCu = cu;
  }
}
