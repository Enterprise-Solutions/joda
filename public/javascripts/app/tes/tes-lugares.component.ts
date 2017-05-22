import {Component, OnInit} from '@angular/core';
import {RouteConfig, RouterOutlet, ROUTER_DIRECTIVES, RouterLink} from '@angular/router-deprecated';

import {MenuService} from '../menu/services/menu.service';

import {TesHomeComponent} from './tes-home.component';
import {ListarLugaresComponent} from './lugares/components/listar_lugares.component';
import {NuevoLugarComponent} from './lugares/components/nuevo_lugar.component';

//import {CrearMarcacionComponent} from './marcaciones/components/crear_nueva_marcacion.component';

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
                  <a [routerLink]="['ListarLugaresComponent']">
                      <i class="fa fa-location-arrow fa-fw"></i>
                      Ver lista de Lugares
                  </a>
                  <a [routerLink]="['NuevoLugarComponent']">
                      <i class="fa fa-location-arrow fa-fw"></i>
                      Agregar Lugar
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
    {path : '/lista', name: 'ListarLugaresComponent', component: ListarLugaresComponent, useAsDefault: true},
    {path : '/nuevo', name: 'NuevoLugarComponent', component: NuevoLugarComponent}

])

export class LugarComponent implements OnInit {
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