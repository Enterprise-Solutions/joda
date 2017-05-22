import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

import {LugarL, NuevoLugar} from "../interfaces/lugares.interface";

@Injectable()
export class LugarService {
    constructor(private _http: Http) {}

   sendDataLugar(lugares : NuevoLugar){
     console.log(lugares);
     var headers = new Headers();
     headers.append('Content-Type', 'application/json');
     let body = JSON.stringify(lugares);
     console.log(body);
     return this._http.post('/lugares', body ,{ headers: headers });
   }
  
    getLugares() {
            return this._http.get('/lugares')
                .map(res => { return res.json(); })
    }
      
//    gettimeworked(email:string, fecha:string) {
//            return this._http.get('/maxmarcacion/' +email+'/'+fecha)
//                .map(res => { return res.json(); })
//    }
//  
   deleteLugar(nombre:string){
      return this._http.delete('/lugares/' + nombre);
   }
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