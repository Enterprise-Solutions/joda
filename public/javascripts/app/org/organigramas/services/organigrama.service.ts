import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class OrganigramaService {
    constructor (private _http: Http) { }

    getOrganigramas() {
        return this._http.get('/org/organigramas')
            .map(res => { return res.json(); });
    }

    getOrganigramaDeParte(id: number | string) {
        return this._http.get('/org/organigramas/' + id + '/partes')
            .map(res => { return res.json(); });
    }

    getParte(orgOrganigramaId: number, id: number) {
        return this._http.get('/org/organigramas/' + orgOrganigramaId + '/partes/' + id)
            .map(res => { return res.json(); });
    }

    getSubPartesDisponibles(orgOrganigramaId: number, id: number) {
        return this._http.get('/org/organigramas/' + orgOrganigramaId + '/partes/' + id + '/subpartes-disponibles')
            .map(res => { return res.json(); });
    }

    getTiposDeParte(orgOrganigramaId: number, id: number) {
        return this._http.get('/org/organigramas/' + orgOrganigramaId + '/partes/' + id + '/tipos-partes')
            .map(res => { return res.json(); });
    }

    getTiposDeSubParte(padre_id: number | string, org_organigrama_id: number | string) {
        return this._http.get('/org/organigramas/' + org_organigrama_id + '/partes/' + padre_id + '/tipos-subpartes')
            .map(res => { return res.json(); });
    }

    agregarParte(padre_id: number | string, org_organigrama_id: number | string, jsonData) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post('/org/organigramas/' + org_organigrama_id + '/partes/' + padre_id, jsonData, { headers: headers })
            .map(res => { return res.json(); });
    }

    agregarSubParte(padre_id: number | string, org_organigrama_id: number | string, jsonData) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post('/org/organigramas/' + org_organigrama_id + '/partes/' + padre_id + '/subpartes', jsonData, { headers: headers })
            .map(res => { return res.json(); });
    }

    editarParte(id: number | string, org_organigrama_id: number | string, jsonData) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.put('/org/organigramas/' + org_organigrama_id + '/partes/' + id, jsonData, { headers: headers })
            .map(res => { return res.json(); });
    }

    eliminarParte(id: number | string, org_organigrama_id: number | string) {
        return this._http.delete('/org/organigramas/' + org_organigrama_id + '/partes/' + id)
            .map(res => {return res; });
    }
}