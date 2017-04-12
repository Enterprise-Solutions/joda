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

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class UsuariosController @Inject() extends Controller {
   //implicit val marcacionJsonFormatter = Json.format[Marcacion]
   implicit val usuarioJsonFormatter = Json.format[Usuario]
   implicit val datosUsuarioJsonFormatter1 = Json.format[DatosUsuario]
   implicit val datosCrearUsuarioFormatter = Json.format[DatosCrearUsuario]
   
  
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
   
  def crearUsuario() = Action(BodyParsers.parse.json) { request =>
    val jsonResult = request.body.validate[DatosCrearUsuario]
    jsonResult.fold(
        errores => {
         BadRequest(Json.obj("status" ->"Error", "message" -> JsError.toJson(errores)))
        },
        d => { 
          Marcaciones.agregarUsuario(d.email, d.apellido, d.nombre, d.password) match{
            case Success(u) => Ok(Json.toJson(u))
            case Failure(e) => BadRequest(e.getMessage)  
          }
        }
    )
  } 
}