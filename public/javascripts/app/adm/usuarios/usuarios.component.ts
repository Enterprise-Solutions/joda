import {Component} from '@angular/core';
import {RouteConfig, RouterOutlet} from '@angular/router-deprecated';

// Importar las Funcionalidades
import {ListarUsuariosComponent} from './components/listar-usuarios.component';
import {CrearUsuarioComponent} from './components/crear-usuario.component';
import {EditarPrincipalUsuarioComponent} from './components/editar-principal-usuario.component';
import {CrearPerfilUsuarioComponent} from "./components/crear-perfil-usuario.component";
import {EditarPerfilUsuarioComponent} from "./components/editar-perfil-usuario.component";
import {EditarAreaUsuarioComponent} from "./components/editar-area-usuario.component";
import {EditarPasswordUsuarioComponent} from "./components/editar-pass-usuario.component";
import {EditarPerfilesUsuarioComponent} from "./components/editar-perfiles-usuario.component";
import {EditarPrincipalPerfilComponent} from "./components/editar-perfil-principal.component";

@Component({
    directives: [RouterOutlet],
    template: '<router-outlet></router-outlet>'
})

@RouteConfig([
    { path: '/listar', name: 'ListarUsuariosComponent', component: ListarUsuariosComponent, useAsDefault: true },

    { path: '/crear', name: 'CrearUsuarioComponent', component: CrearUsuarioComponent },
    { path: '/:id/editar/principal', name: 'EditarPrincipalUsuarioComponent', component: EditarPrincipalUsuarioComponent },
    { path: '/:id/editar/pass', name: 'EditarPasswordUsuarioComponent', component: EditarPasswordUsuarioComponent },
    { path: '/:id/editar/perfil', name: 'EditarPerfilesUsuarioComponent', component: EditarPerfilesUsuarioComponent },
    { path: '/crear/:id/perfiles', name: 'CrearPerfilUsuarioComponent', component: CrearPerfilUsuarioComponent },
    { path: '/editar/:id/perfiles/:idPerfil', name: 'EditarPerfilUsuarioComponent', component: EditarPerfilUsuarioComponent },
    { path: '/editar/:id/area/:idPerfil', name: 'EditarAreaUsuarioComponent', component: EditarAreaUsuarioComponent },
    { path: '/editar/:id/principal/:idPerfil', name: 'EditarPrincipalPerfilComponent', component: EditarPrincipalPerfilComponent }
])

export class UsuariosComponent { }