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
//import modelos.Marcacion
import scala.util.Success
import scala.util.Failure
import services.Marcaciones
import scala.concurrent.ExecutionContext
import scala.concurrent.Future
import play.api.libs.json._
import play.api.libs.functional.syntax._
import java.sql.Timestamp
//import slick.driver.PostgresDriver.api._

@Singleton
class MarcacionesController @Inject() (marcaciones: Marcaciones,implicit val ec: ExecutionContext) extends Controller {
  
   implicit val listadomarcacionesJsonFormatter = Json.format[ListadoMarcaciones]
   implicit val marcacionesJsonFormatter = Json.format[MarcacionR]
   //implicit val marcacionJsonFormatter = Json.format[Marcacion]
//   implicit val nuevamarcaciontimestamp: Writes[Marcacion] = (
//   (JsPath \ "id").write[Long] and
//   (JsPath \ "usuario_id").write[Long] and
//   (JsPath \ "lugar_id").write[Long] and
//   (JsPath \ "fecha").write[String]
//    )(unlift(Marcacion.unapply))
   implicit val marcacionlistadoJsonFormatter = Json.format[DatosListadoMarcaciones]
   implicit val crearmarcacionJsonFormatter = Json.format[DatosCrearMarcacion]
//   implicit val rds: Reads[Timestamp] = (__ \ "fecha").read[Long].map{ long => new Timestamp(long) }
//   implicit val wrs: Writes[Timestamp] = (__ \ "fecha").write[Long].contramap{ (a: Timestamp) => a.getTime }
//   implicit val fmt: Format[Timestamp] = Format(rds, wrs)
     
  def borrartodo(user_id: Long) = Action.async{request => 
    marcaciones.borrarlasmarcaciones(user_id) map{ r =>
      Ok(r)
    }recover {
            case e: Exception => BadRequest(e.getMessage)
          }
  }
  
  def index() = Action.async{request =>
    marcaciones() map { r =>
       Ok(Json.toJson(r))
     } recover {
      case e: Exception => BadRequest(e.getMessage)
    }
   }
  
  def listado() = Action.async{request => 
    marcaciones.listadoMarcaciones() map{ r =>
      Ok(Json.toJson(r))
    }recover {
            case e: Exception => BadRequest(e.getMessage)
          }
  }
  
  def crearMarcacion() = Action.async(BodyParsers.parse.json) { request =>
    val jsonResult = request.body.validate[DatosCrearMarcacion]
    jsonResult.fold(
        errores => {
         Future.successful(BadRequest(Json.obj("status" ->"Error", "message" -> JsError.toJson(errores))))
        },
        d => { 
          marcaciones.crear(d) map{ u =>
            Ok("Success!")
          }recover {
            case e: Exception => BadRequest(e.getMessage)
          }
        }
    )
  } 
}
