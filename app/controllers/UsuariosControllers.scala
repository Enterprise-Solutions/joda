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
import services.Usuarios
import scala.concurrent.ExecutionContext
import scala.concurrent.Future

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class UsuariosController @Inject() (usuarios: Usuarios,implicit val ec: ExecutionContext) extends Controller {
   //implicit val marcacionJsonFormatter = Json.format[Marcacion]
   implicit val usuarioJsonFormatter = Json.format[Usuario]
   implicit val datosUsuarioJsonFormatter1 = Json.format[DatosUsuario]
   implicit val datosCrearUsuarioFormatter = Json.format[DatosCrearUsuario]
   
   def index() = Action.async{request =>
     usuarios.listado() map { r =>
       Ok(Json.toJson(r))
     } recover {
      case e: Exception => BadRequest(e.getMessage)
    }
   }
   
  
  /**
   * Create an Action to render an HTML page with a welcome message.
   * The configuration in the `routes` file means that this method
   * will be called when the application receives a `GET` request with
   * a path of `/`.
   */
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