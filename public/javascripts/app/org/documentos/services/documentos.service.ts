import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DocumentosService {
    constructor(public _http: Http) { }

    getTipoDocumentoPorParte(orgParteId: number) {
        return this._http.get('/org/partes/' + orgParteId + '/tipos-de-documentos')
            .map(res => { return res.json(); });
    }

    getDocumentosParte(orgParteId: number) {
        return this._http.get('/org/partes/' + orgParteId + '/documentos')
            .map(res => { return res.json(); });
    }

    crearDocumento(orgParteId: number, jsonData: string) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post('/org/partes/' + orgParteId + '/documentos', jsonData, { headers: headers })
            .map(res => { return res.json(); });
    }

    editarDocumento(orgParteId: number, id: number, jsonData: string) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.put('/org/partes/' + orgParteId + '/documentos/'+id, jsonData, { headers: headers })
            .map(res => { return res.json(); });
    }

    borrarDocumento(orgParteId: number, id: number) {
        return this._http.delete('/org/partes/' + orgParteId + '/documentos/' + id)
            .map(res => { return res; });
    }
}