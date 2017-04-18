package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import modelos._
import play.api.libs.json.Json
import play.api.libs.json._
import play.api.libs.functional.syntax._
import scala.util.Try

/*import modelos.Usuario
import modelos.Marcacion
import modelos.DatosUsuario
import modelos.DatosCrearUsuario*/
import play.api.libs.json.JsError
import scala.util.Success
import scala.util.Failure
//import services.Usuarios
import services.Marcaciones
import java.sql.Timestamp
import scala.concurrent.ExecutionContext
import scala.concurrent.Future
import services.DatosDeMarcacion

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class MarcacionesController @Inject() (marcaciones: Marcaciones, implicit val ec: ExecutionContext) extends Controller {
 //  implicit val marcacionJsonFormatter = Json.format[Marcacion]
 //  implicit val usuarioJsonFormatter = Json.format[Usuario]
   implicit val marcacionesJsonFormatter = Json.format[DatosDeMarcacion]
 //  implicit val datosUsuarioJsonFormatter1 = Json.format[DatosUsuario]
 //  implicit val datosCrearUsuarioFormatter = Json.format[DatosCrearUsuario]
   
   
   
   def index(usuario_id:Option[Long],lugar_id: Option[Long]) = Action.async{request =>
     marcaciones.listado(usuario_id, lugar_id) map { r =>
       Ok(Json.toJson(r))
     } recover {
      case e: Exception => BadRequest(e.getMessage)
    }
   }
   
  
/*  
  def borrar(email: String) = Action.async{request => 
    usuarios.borrar(email) map{ r =>
      Ok(r)
    }recover {
            case e: Exception => BadRequest(e.getMessage)
          }
  }
   
  def crearUsuario() = Action.async(BodyParsers.parse.json) { request =>
    val jsonResult = request.body.validate[DatosCrearUsuario]
    jsonResult.fold(
        errores => {
         Future.successful(BadRequest(Json.obj("status" ->"Error", "message" -> JsError.toJson(errores))))
        },
        d => { 
          /*Marcaciones.agregarUsuario(d.email, d.apellido, d.nombre, d.password) match{
            case Success(u) => Ok(Json.toJson(u))
            case Failure(e) => BadRequest(e.getMessage)  
          }*/
          usuarios.crear(d) map{ u =>
            Ok(Json.toJson(u))
          }recover {
            case e: Exception => BadRequest(e.getMessage)
          }
        }
    )
  } */
}