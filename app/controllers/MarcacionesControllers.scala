package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import modelos._
import play.api.libs.json.Json
/*import modelos.Usuario
import modelos.Marcacion
import modelos.DatosUsuario
import modelos.DatosCrearUsuario*/
import play.api.libs.json.JsError
import scala.util.Success
import scala.util.Failure
import services.Marcaciones
import scala.concurrent.ExecutionContext
import scala.concurrent.Future
//import slick.driver.PostgresDriver.api._

@Singleton
class MarcacionesController @Inject() (marcaciones: Marcaciones,implicit val ec: ExecutionContext) extends Controller {
  
   implicit val marcacionlistadoJsonFormatter = Json.format[DatosListadoMarcaciones]
   //implicit val datosUsuarioJsonFormatter1 = Json.format[DatosUsuario]
   //implicit val datosCrearUsuarioFormatter = Json.format[DatosCrearUsuario]
     
  def borrartodo(user_id: Long) = Action.async{request => 
    marcaciones.borrarlasmarcaciones(user_id) map{ r =>
      Ok(r)
    }recover {
            case e: Exception => BadRequest(e.getMessage)
          }
  }
  
   /*def editarMarcacion(user_id: Long) = Action.async{request => 
    marcaciones.borrarlasmarcaciones(user_id) map{ r =>
      Ok(r)
    }recover {
            case e: Exception => BadRequest(e.getMessage)
          }
  }*/
  
  def listado() = Action.async{request => 
    marcaciones.listadoMarcaciones() map{ r =>
      Ok(Json.toJson(r.toMap))
    }recover {
            case e: Exception => BadRequest(e.getMessage)
          }
  }
  
  /*def getCoordenadas = Action {
    Ok(views.html.coordenates(""))
  }*/
    
}
