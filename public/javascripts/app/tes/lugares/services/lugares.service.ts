import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

import {LugarL} from "../interfaces/lugares.interface";

@Injectable()
export class LugarService {
    constructor(private _http: Http) {}

//    sendDataUsuario(lugares : LugarL){
//      console.log(lugares);
//      var headers = new Headers();
//      headers.append('Content-Type', 'application/json');
//      let body = JSON.stringify(lugares);
//      console.log(body);
//      return this._http.post('/lugares', body ,{ headers: headers });
//    }
  
    getLugares() {
            return this._http.get('/lugares')
                .map(res => { return res.json(); })
    }
      
//    gettimeworked(email:string, fecha:string) {
//            return this._http.get('/maxmarcacion/' +email+'/'+fecha)
//                .map(res => { return res.json(); })
//    }
//  
//    deleteMarcaciones(id:number){
//       return this._http.delete('/marcaciones/' + id.toString());
//    }
//      
//      sendDataMarcacion(mark: UsuarioL){
//      var headers = new Headers();
//      headers.append('Content-Type', 'application/json');
//      let body = JSON.stringify(mark);
//      return this._http.post('/marcacion', body ,{ headers: headers });
//    }
//  
//    deleteLugar(email:String){
//       return this._http.delete('/usuarios/' + email)
//              .map(res => { return res.json(); })
//    }
 }