import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

import {Usuario} from "../interfaces/usuarios.interface";

@Injectable()
export class UserService {
    constructor(private _http: Http) {}

    sendDataUsuario(usuarios : Usuario){
      console.log(usuarios);
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let body = JSON.stringify(usuarios);
      console.log(body);
      return this._http.post('/usuarios', body ,{ headers: headers });
    }
  
    getUsuarios() {
            return this._http.get('/usuarios')
                .map(res => { return res.json(); })
    }
  
    deleteMarcaciones(id:number){
       /* let headers = new Headers({ 'Content-Type': 'application/json' });
       let options = new RequestOptions({ headers: headers });*/
       return this._http.delete('/marcaciones/' + id.toString());
    }
  
    deleteUsuario(email:String){
       //let headers = new Headers({ 'Content-Type': 'application/json' });
      // let options = new RequestOptions({ headers: headers });
       return this._http.delete('/usuarios/' + email/*, options*/)
              .map(res => { return res.json(); })
    }
 }