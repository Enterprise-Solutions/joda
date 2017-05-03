import {Component} from '@angular/core';
import {RouteConfig, RouterOutlet} from '@angular/router-deprecated';

// Importar las Funcionalidades
import {ListarPersonaComponent} from './components/listar-persona.component';
import {CrearPersonaComponent} from './components/crear-persona.component';
import {EditarPersonaComponent} from './components/editar-persona.component';

import {DocumentosPersonaComponent} from './components/documentos/components/documentos-persona.component';
import {DireccionesPersonaComponent} from './components/direcciones/components/direcciones-persona.component';
import {ContactosPersonaComponent} from './components/contactos/components/contactos-persona.component';

@Component({
    directives: [RouterOutlet],
    template: '<router-outlet></router-outlet>'
})

@RouteConfig([
    { path: '/listar', name: 'ListarPersonaComponent', component: ListarPersonaComponent, useAsDefault: true },
    { path: '/crear', name: 'CrearPersonaComponent', component: CrearPersonaComponent },
    { path: '/:id/editar', name: 'EditarPersonaComponent', component: EditarPersonaComponent },

    // Documentos, Direcciones y Contactos
    { path: '/:id/documentos', name: 'DocumentosPersonaComponent', component: DocumentosPersonaComponent },
    { path: '/:id/direcciones', name: 'DireccionesPersonaComponent', component: DireccionesPersonaComponent },
    { path: '/:id/contactos', name: 'ContactosPersonaComponent', component: ContactosPersonaComponent }
])

export class PersonasComponent { }