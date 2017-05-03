import {Component} from '@angular/core';


@Component({
    template: ''
})

export class FormatDateComponent{
    //Formateamos la fecha al formato que quiere el servidor
    formatFecha(d:any){
        let fechaPartida:string[] = d.split("/");

        if(fechaPartida.length > 0) {
            let day = fechaPartida[0];
            let month = fechaPartida[1];
            let year = fechaPartida[2];

            return  year + "-" + month  + "-" + day;
        } else{
            return "";
        }
    }

}
