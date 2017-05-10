import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

import {Marcacion, horasTrabajadas} from "../interfaces/marcacion.interface";

@Injectable()
export class MarcacionesService {
    constructor(private _http: Http) {}

    getUsuarios() {
            return this._http.get('/usuarios')
                .map(res => { return res.json(); })
    }
    
    gettimeworked(email:string, fecha:string) {
            return this._http.get('/maxmarcacion/' +email+'/'+fecha)
                .map(res => { return res.json(); })
    }
    
  
    deleteMarcaciones(id:number){
       /* let headers = new Headers({ 'Content-Type': 'application/json' });
       let options = new RequestOptions({ headers: headers });*/
       return this._http.delete('/marcaciones/' + id.toString());
    }
  
    sendDataMarcacion(mark: Marcacion){
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let body = JSON.stringify(mark);
      return this._http.post('/marcacion', body ,{ headers: headers });
    }
  
    deleteUsuario(email:String){
       //let headers = new Headers({ 'Content-Type': 'application/json' });
      // let options = new RequestOptions({ headers: headers });
       return this._http.delete('/usuarios/' + email/*, options*/)
              .map(res => { return res.json(); })
    }

    getFacturasDisponibles(org_organigrama_id: number, nro = null) {

        if(!nro){
            nro = '';
        }
        let fetchUrl = '/nc/' + org_organigrama_id + '/facturas-finalizadas?nro='+nro;

        return this._http.get(fetchUrl)
            .map(res => { return res.json(); });
    }

    // getBancos(org_organigrama_id: number, banco = null) {
    //
    //     if(!banco){
    //         banco = '';
    //     }
    //
    //     let fetchUrl = '/tes/' + org_organigrama_id + '/bancos?nombre='+banco;
    //
    //     return this._http.get(fetchUrl)
    //         .map(res => { return res.json(); });
    // }
    //
    getTarjetas(tipo_tarjeta = null) {
        let fetchUrl;
        if(tipo_tarjeta == 'C'){
            fetchUrl = 'tes/marcaciones-emisoras?fac_medio_pago_codigo=tarjeta_de_credito';
        }else if(tipo_tarjeta == 'D'){
            fetchUrl = 'tes/marcaciones-emisoras?fac_medio_pago_codigo=tarjeta_de_debito';
        }else{
            fetchUrl = 'tes/marcaciones-emisoras';
        }

        return this._http.get(fetchUrl)
            .map(res => { return res.json(); });
    }
    //
    // getCaja(org_organigrama_id: number, caja_id: number) {
    //     return this._http.get('/vnt/' + org_organigrama_id + '/cajas/' + caja_id)
    //         .map(res => { return res.json(); })
    // }
    //
    // crearCaja(org_organigrama_id: number, jsonData: string) {
    //     var headers = new Headers();
    //     headers.append('Content-Type', 'application/json');
    //
    //     return this._http.post('/vnt/' + org_organigrama_id + '/cajas', jsonData, { headers: headers })
    //         .map(res => { return res.json(); });
    // }
    //
    // editarCaja(org_organigrama_id: number, caja_id: number, jsonData: string) {
    //     var headers = new Headers();
    //     headers.append('Content-Type', 'application/json');
    //
    //     return this._http.put('/vnt/' + org_organigrama_id + '/cajas/' + caja_id, jsonData, { headers: headers })
    //         .map(res => { return res.json(); });
    // }
    //
    // eliminarCaja(org_organigrama_id: number, caja_id: number) {
    //     var headers = new Headers();
    //     headers.append('Content-Type', 'application/json');
    //
    //     return this._http.delete('/vnt/' + org_organigrama_id + '/cajas/' + caja_id, { headers: headers })
    //         .map(res => { return res; });
    // }
    //
    // getSucursalesDisponibles(org_organigrama_id: number, search = null, pagination = null, order = null) {
    //     let fetchUrl = '/vnt/' + org_organigrama_id + '/cajas/sucursales-disponibles';
    //     let params = [];
    //
    //     for (var prop in search) {
    //         if (search[prop] !== undefined) {
    //             params.push(prop + '=' + search[prop]);
    //         }
    //     }
    //
    //     for (var prop in pagination) {
    //         if (pagination[prop] !== undefined) {
    //             params.push(prop + '=' + pagination[prop]);
    //         }
    //     }
    //
    //     for (var prop in order) {
    //         if (order[prop] !== undefined) {
    //             params.push(prop + '=' + order[prop]);
    //         }
    //     }
    //
    //     if (params.length) {
    //         fetchUrl += '?' + params.join('&');
    //     }
    //
    //     return this._http.get(fetchUrl)
    //         .map(res => { return res.json(); });
    // }
}