//import {MENU} from './mock-menu';
import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class MenuService {
	constructor(public _http: Http) { }

	getModules() {
		//return MENU;
		return this._http.get('/adm/usuario/operaciones')
			.map(res => { return res.json(); });
	}
}