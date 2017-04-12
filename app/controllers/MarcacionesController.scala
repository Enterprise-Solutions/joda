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
class MarcacionesController @Inject() extends Controller {
   //implicit val marcacionJsonFormatter = Json.format[Marcacion]
   implicit val usuarioJsonFormatter = Json.format[Usuario]
   implicit val datosUsuarioJsonFormatter1 = Json.format[DatosUsuario]
   implicit val datosCrearUsuarioFormatter = Json.format[DatosCrearUsuario]
   implicit val MarcacionFormatter = Json.format[Marcacion]
   implicit val datosMarcacionFormatter = Json.format[DatosMarcacion]
   implicit val datosCrearMarcacionFormatter = Json.format[DatosCrearMarcacion]
   
  
  /**
   * Create an Action to render an HTML page with a welcome message.
   * The configuration in the `routes` file means that this method
   * will be called when the application receives a `GET` request with
   * a path of `/`.
   */
  def getMarcacionesUsuario(email: String) = Action { request => 
    Marcaciones.listarMarcacionesUsuario(email) match{
      case Success(u) => Ok(Json.toJson(u))
      case Failure(e) => BadRequest(e.getMessage) 
    }
  }
   
  def getMarcacionesFecha(fecha: String) = Action { request => 
    Marcaciones.listarMarcaciones(fecha) match{
      case Success(u) => Ok(Json.toJson(u))
      case Failure(e) => BadRequest(e.getMessage) 
    }
  }
   
  def crearMarcacion() = Action(BodyParsers.parse.json) { request =>
    val jsonResult = request.body.validate[DatosCrearMarcacion]
    jsonResult.fold(
        errores => {
         BadRequest(Json.obj("status" ->"Error", "message" -> JsError.toJson(errores)))
        },
        d => { 
          Marcaciones.agregarMarcacion(d.email, d.fecha, d.lugar) match{
            case Success(u) => Ok(Json.toJson(u))
            case Failure(e) => BadRequest(e.getMessage)  
          }
        }
    )
  } 
}