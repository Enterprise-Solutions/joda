import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

import {Usuario, UsuarioL, horasTrabajadas} from "../interfaces/usuarios.interface";

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
      
    gettimeworked(email:string, fecha:string) {
            return this._http.get('/maxmarcacion/' +email+'/'+fecha)
                .map(res => { return res.json(); })
    }
  
    deleteMarcaciones(id:number){
       return this._http.delete('/marcaciones/' + id.toString());
    }
      
      sendDataMarcacion(mark: UsuarioL){
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let body = JSON.stringify(mark);
      return this._http.post('/marcacion', body ,{ headers: headers });
    }
  
    deleteUsuario(email:String){
       return this._http.delete('/usuarios/' + email)
              .map(res => { return res.json(); })
    }
 }