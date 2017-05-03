import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UbicacionService {
	constructor(public _http: Http) { }

	getUbicaciones() {
		return this._http.get('/org/ubicaciones')
			.map(res => { return res.json().rows; });
	}

	
};