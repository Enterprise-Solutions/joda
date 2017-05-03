import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import {UsuariosService} from '../services/usuarios.service';

import {Usuario} from '../interfaces/usuario.interface';

@Component({
    template: require('./templates/listar-usuarios.template.html'),
    providers: [UsuariosService],
    directives: [ROUTER_DIRECTIVES],
    styles: [`.table th { text-align: center; }`]
})

export class ListarUsuariosComponent implements OnInit {
    public usuarios: Usuario[];
    public numResults: number;
    public loadingData: boolean;

    public headers = [{
        'descrip': 'Usuario',
        'columna': 'email',
        'ordenable': true
    }, {
        'descrip': 'Nombre',
        'columna': 'nombre',
        'ordenable': true
    }, {
        'descrip': 'Apellido',
        'columna': 'apellido',
        'ordenable': true
    }, {
        'descrip': 'Estado',
        'columna': 'estado',
        'ordenable': false
    }];


    // Default Params
    public search = {
        'email': undefined,
        'nombre': undefined
    };
    public pagination = {'pagina': 0, 'cantidad': 10};
    public order = {'sort': 'email', 'dir': 'asc'};
    public totalDePaginas = 0;
    public paginaActual = 1;

    constructor(
        private _router: Router,
        private _usuariosService: UsuariosService) { }

    ngOnInit() {
        this.getUsuarios();
    }

    getUsuarios() {
        this.loadingData = true;

        this._usuariosService.getUsuarios(this.search, this.pagination, this.order)
            .subscribe(
                response => {
                    this.usuarios = response.rows;
                    this.numResults = response.total;
                    this.paginaActual = this.pagination.pagina + 1;
                    this.totalDePaginas = Math.ceil(this.numResults / this.pagination.cantidad);
                },
                err => console.log("ERROR: " + err),
                () => {
                    this.loadingData = false;
                    console.log("GET Usuarios Complete")
                }
            );
    }

    gotoCrearUsuario() {
        this._router.navigate(['CrearUsuarioComponent']);
    }

    setDefaultParams() {
        this.search = {
            'email': undefined,
            'nombre': undefined
        };
    }

    changePage(newValue) {
        if (newValue <= 0) {
            this.paginaActual = 1;
            this.pagination.pagina = 0;
        } else if (newValue > this.totalDePaginas) {
            this.paginaActual = this.totalDePaginas;
            this.pagination.pagina = this.paginaActual-1;
        } else {
            this.paginaActual = newValue;
            this.pagination.pagina = newValue-1;
        }
        this.getUsuarios();
    }

    prevPage() {
        this.pagination.pagina -= 1;
        this.paginaActual -= 1;
        this.getUsuarios();
    }

    nextPage() {
        this.pagination.pagina += 1;
        this.paginaActual += 1;
        this.getUsuarios();
    }

    filtrar() {
        this.getUsuarios();
    }

    limpiar() {
        this.setDefaultParams();
        this.getUsuarios();
    }

    ordenar(head) {
        if (head.ordenable) {
            if (this.order.sort == head.columna) {
                this.order.dir = this.order.dir == 'asc' ? 'desc' : 'asc';
            } else {
                this.order.sort = head.columna;
                this.order.dir = 'asc';
            }
            this.getUsuarios();
        }
    }
}