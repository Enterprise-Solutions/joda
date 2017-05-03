import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DireccionesService {
    constructor(public _http: Http) { }

    getDirecciones(orgParteId: number) {
        return this._http.get('/org/partes/' + orgParteId + '/direcciones')
            .map(res => { return res.json(); });
    }

    crearDireccion(orgParteId: number, jsonData: string) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post('/org/partes/' + orgParteId + '/direcciones', jsonData, { headers: headers })
            .map(res => { return res.json(); });
    }

    editarDirecciones(orgParteId: number, id: number, jsonData: string) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.put('/org/partes/' + orgParteId + '/direcciones/' + id, jsonData, { headers: headers })
            .map(res => { return res.json(); });
    }

    borrarDireccion(orgParteId: number, id: number) {
        return this._http.delete('/org/partes/' + orgParteId + '/direcciones/' + id)
            .map(res => { return res; });
    }
}