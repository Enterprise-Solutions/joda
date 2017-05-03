import {Component} from '@angular/core';
import {RouteConfig, RouterOutlet} from '@angular/router-deprecated';

// Importar las Funcionalidades
import {ListarOrganizacionComponent} from './components/listar-organizacion.component';
import {CrearOrganizacionComponent} from './components/crear-organizacion.component';
import {EditarOrganizacionComponent} from './components/editar-organizacion.component';

import {DocumentosOrganizacionComponent} from './components/documentos/components/documentos-organizacion.component';
import {DireccionesOrganizacionComponent} from './components/direcciones/components/direcciones-organizacion.component';
import {ContactosOrganizacionComponent} from './components/contactos/components/contactos-organizacion.component';

@Component({
    directives: [RouterOutlet],
    template: '<router-outlet></router-outlet>'
})

@RouteConfig([
    { path: '/listar', name: 'ListarOrganizacionComponent', component: ListarOrganizacionComponent, useAsDefault: true },
    { path: '/crear', name: 'CrearOrganizacionComponent', component: CrearOrganizacionComponent },
    { path: '/:id/editar', name: 'EditarOrganizacionComponent', component: EditarOrganizacionComponent },

    // Documentos, Direcciones y Contactos
    { path: '/:id/documentos', name: 'DocumentosOrganizacionComponent', component: DocumentosOrganizacionComponent },
    { path: '/:id/direcciones', name: 'DireccionesOrganizacionComponent', component: DireccionesOrganizacionComponent },
    { path: '/:id/contactos', name: 'ContactosOrganizacionComponent', component: ContactosOrganizacionComponent }
])

export class OrganizacionesComponent { }