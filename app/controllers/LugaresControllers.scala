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
import services.Usuarios
import services.Lugares
import scala.concurrent.ExecutionContext
import scala.concurrent.Future

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class LugaresController @Inject() (lugares: Lugares,implicit val ec: ExecutionContext) extends Controller {
   //implicit val marcacionJsonFormatter = Json.format[Marcacion]
   implicit val lugarJsonFormatter = Json.format[Lugar]
   implicit val datosCrearLugarFormatter = Json.format[DatosCrearLugar]
   
   def index() = Action.async{request =>
     lugares.listado() map { r =>
       Ok(Json.toJson(r))
     } recover {
      case e: Exception => BadRequest(e.getMessage)
    }
   }
   
  
  
  def borrar(nombre: String) = Action.async{request => 
    lugares.borrar(nombre) map{ r =>
      Ok(r)
    }recover {
            case e: Exception => BadRequest(e.getMessage)
          }
  }
   
  def crearLugar() = Action.async(BodyParsers.parse.json) { request =>
    val jsonResult = request.body.validate[DatosCrearLugar]
    jsonResult.fold(
        errores => {
         Future.successful(BadRequest(Json.obj("status" ->"Error", "message" -> JsError.toJson(errores))))
        },
        d => { 
          lugares.crear(d) map{ u =>
            Ok(Json.toJson(u))
          }recover {
            case e: Exception => BadRequest(e.getMessage)
          }
        }
    )
  } 
}