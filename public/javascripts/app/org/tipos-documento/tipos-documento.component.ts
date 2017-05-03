import {Component} from '@angular/core';
import {RouteConfig, RouterOutlet} from '@angular/router-deprecated';

// Importar las Funcionalidades
import {ListarTiposDocumentosComponent} from './components/listar-tipos-documentos.component';
import {CrearTipoDocumentoComponent} from './components/crear-tipo-documento.component';
import {EditarTipoDocumentoComponent} from './components/editar-tipo-documento.component';

@Component({
	directives: [RouterOutlet],
	template: '<router-outlet></router-outlet>'
})

@RouteConfig([
	{ path: '/listar', name: 'ListarTiposDocumentosComponent', component: ListarTiposDocumentosComponent, useAsDefault: true },
	{ path: '/crear', name: 'CrearTipoDocumentoComponent', component: CrearTipoDocumentoComponent },
    { path: '/:tipo_id/editar', name: 'EditarTipoDocumentoComponent', component: EditarTipoDocumentoComponent }
])

export class TiposDocumentoComponent { }