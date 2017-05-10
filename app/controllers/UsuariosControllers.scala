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
import scala.util.Try
import services.Usuarios
import scala.concurrent.ExecutionContext
import scala.concurrent.Future
import java.sql.Timestamp
import java.text.SimpleDateFormat
import play.api.libs.json._
import org.joda.time.format._
import org.joda.time._



/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */

@Singleton
class UsuariosController @Inject() (usuarios: Usuarios,implicit val ec: ExecutionContext) extends Controller {
  
   implicit val marcacionJsonFormatter = Json.format[MarcacionR]
   /*implicit val implicitTimestampFormatter = new Writes[Marcacion] {
    def writes(foo: Marcacion): JsValue = {
      Json.obj(
        "id" -> foo.id,
        "usuario_id" -> foo.usuario_id,
        "lugar_id" -> foo.lugar_id,
        "fecha" -> foo.fecha.toString()
      )
    }
  }*/
   implicit val resumenJsonFormatter = Json.format[DatosResumenDiaTrabajado]
   implicit val usuarioJsonFormatter = Json.format[Usuario]
   implicit val datosUsuarioJsonFormatter1 = Json.format[DatosUsuario]
   implicit val datosCrearUsuarioFormatter = Json.format[DatosCrearUsuario]
   implicit val datosActualizarUsuarioFormatter = Json.format[DatosActualizarUsuario]
   //implicit val dateTimestampFormatter = Json.format[Seq[Marcacion]]
   
   def index() = Action.async{request =>
     usuarios() map { r =>
       Ok(Json.toJson(r))
     } recover {
      case e: Exception => BadRequest(e.getMessage)
    }
   }

  def get(email: String,nombre: String) = Action { request => 
    Marcaciones.findUsuario(email) match{
      case Success(u) => Ok(Json.toJson(u))
      case Failure(e) => BadRequest(e.getMessage) 
    }
  }
  
  def borrar(email: String) = Action.async{request => 
    usuarios.borrar(email) map{ r =>
      Ok(r)
    }recover {
            case e: Exception => BadRequest(e.getMessage)
          }
  }
  
  def marcacionMax(email: String, fecha: String) = Action.async{request =>
    val formatOfDate = new SimpleDateFormat("dd-MM-yyyy")
    val fmt = DateTimeFormat.forPattern("dd-MM-yyyy")
    // Corroborar que el formato de fecha sea pasado correctamente...
    val date = Try[DateTime](fmt.parseDateTime(fecha)) 
    date match {
      case Success(date) => usuarios.trabajadoUser(email, new Timestamp(formatOfDate.parse(fecha).getTime())) map{ r =>
                          Ok(Json.toJson(r))
                          }recover {
                            case e: Exception => BadRequest(e.getMessage)
                          }// ok
      case Failure(exception) => Future(BadRequest(exception.getMessage))// not ok
    }

  }
  
  def editarUsuario() = Action.async(BodyParsers.parse.json) { request =>
    val jsonResult = request.body.validate[DatosActualizarUsuario]
    jsonResult.fold(
        errores => {
         Future.successful(BadRequest(Json.obj("status" ->"Error", "message" -> JsError.toJson(errores))))
        },
        d => {
          usuarios.editarUser(d) map{ u =>
            Ok(Json.toJson(u))
          }recover {
            case e: Exception => BadRequest(e.getMessage)
          }
        }
    )
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
  } 
}