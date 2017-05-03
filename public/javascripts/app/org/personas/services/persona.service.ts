import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PersonaService {
	constructor(public _http: Http) { }

	getPersonas(search = null, pagination = null, order = null) {
		let fetchUrl = '/org/personas';
		let params = [];

		for (var prop in search) {
			if (search[prop] !== undefined) {
				params.push(prop + '=' + search[prop]);
			}
		}

		for (var prop in pagination) {
			if (pagination[prop] !== undefined) {
				params.push(prop + '=' + pagination[prop]);
			}
		}

		for (var prop in order) {
			if (order[prop] !== undefined) {
				params.push(prop + '=' + order[prop]);
			}
		}

		if (params.length) {
			fetchUrl += '?' + params.join('&');
		}

		return this._http.get(fetchUrl)
			.map(res => { return res.json(); });
	}

	getPersona(id: number | string) {
		return this._http.get('/org/personas/' + id)
			.map(res => { return res.json(); });
	}

	getTipoDocumentos() {
		return this._http.get('/org/tipo-documentos')
			.map((res) => { return res.json().rows; });
	}
	
	crearPersona(jsonData:string) {
		var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post('/org/personas', jsonData, { headers: headers })
            .map(res => { return res.json(); });
    }

	editarPersona(id: number, jsonData: string) {
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this._http.put('/org/personas/'+id, jsonData, { headers: headers })
			.map((res) => {
				return res;
			});
	}

    borrarPersona(id: number) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.delete('/org/personas/' + id, { headers: headers })
            .map(res => {return res.json(); });
    }
};