import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {NgForm, CORE_DIRECTIVES}    from '@angular/common';
import {Router} from '@angular/router-deprecated';
import {Rol} from "../interfaces/rol.interface";
import {RolService} from "../services/rol.service";
import {NotificationComponent} from "../../../utils/notification/components/notification.component";
import {Notification} from "../../../utils/notification/interfaces/notification.interface";

@Component({
    providers: [RolService],
    directives: [NotificationComponent],
    template: require('./templates/crear-rol.template.html'),
    styles: [`.table th { text-align: center; }`]
})

export class CrearRolComponent implements OnInit {
    public rol: Rol;
    public submitted = false;

    // Componente Notificacion
    public verNotificacion: boolean;
    public notificacion: Notification;

    constructor(private _router: Router, private _rolService: RolService) { }

    // Inicializa el Formulario y las Interfaces
    ngOnInit() {
        this.notificacion = new Notification();
        this.rol = new Rol();
    }

    // Boton Cancelar -- Vuelve al Listado
    listarRoles() { this._router.navigate(['ListarRolesComponent']); }

    // Boton Guardar -- Tiene que ir al Editar
    onSubmit() {
        let jsonData: string;

        this.submitted = true;

        jsonData = JSON.stringify(this.rol);
        //console.log("Json a enviar: " + jsonData);
        this.crearRol(jsonData);
    }

    // LLamada a servicioss
    crearRol(jsonData:string) {
        this._rolService.crearRol(jsonData)
            .subscribe(
                rol => {
                    //console.log("Respueta crear tipo documento: " + JSON.stringify(rol));
                    this.verNotificacion = true;
                    this.notificacion.status ='success';
                    this.notificacion.message = 'Rol creado con exito';

                    setTimeout(() => {
                        this._router.navigate(['ListarRolesComponent']);
                    }, 1000);


                },
                err => {
                    console.log("ERROR: " + err + " en JSON: " + JSON.stringify(err));

                    this.verNotificacion = true;
                    this.notificacion.status ='error';
                    this.notificacion.message = err._body;
                },
                () => {}
            );
    }

}
