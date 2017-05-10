import {Component, OnInit} from '@angular/core';
import {RouteConfig, RouterOutlet, ROUTER_DIRECTIVES, RouterLink} from '@angular/router-deprecated';

import {MenuService} from '../menu/services/menu.service';

import {TesHomeComponent} from './tes-home.component';
import {ListarMarcComponent} from './marcaciones/components/enlistar_marcaciones.component';

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
                  <a [routerLink]="['ListarMarcComponent']">
                      <i class="fa fa-location-arrow fa-fw"></i>
                      Ver lista de Marcaciones
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
  { path : '/lista', name: 'ListarMarcComponent', component: ListarMarcComponent, useAsDefault: true}
])

export class MarKComponent implements OnInit {
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