import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

import {MarcacionL, Marcacion} from "../interfaces/marcaciones.interface";

@Injectable()
export class MarcacionService {
    constructor(private _http: Http) {}
  
    getMarcas() {
            return this._http.get('/marcaciones')
                .map(res => { return res.json(); })
    }
  
    sendDataMarcacion(mark: Marcacion){
      console.log(mark);
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let body = JSON.stringify(mark);
      console.log("Este es el body:")
      console.log(body);
      return this._http.post('/marcaciones', body ,{ headers: headers });
    }
  
 }