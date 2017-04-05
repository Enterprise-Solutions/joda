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
    //Ok(views.html.index("Your new application is ready."))
    val r = Marcaciones.findUsuario(email)
    
    if(r.isSuccess){
      val u = r.get
      Ok(Json.toJson(u))
    }
    else
      BadRequest(s"No existe el usuario :$email!")
    
  }
   
  def crearUsuario() = Action(BodyParsers.parse.json) { request =>
    val jsonResult = request.body.validate[DatosCrearUsuario]
    jsonResult.fold(
        errores => {
         BadRequest(Json.obj("status" ->"Error", "message" -> JsError.toJson(errores)))
        },
        d => { 
          val r = Marcaciones.agregarUsuario(d.email, d.apellido, d.nombre, d.password)
          if(r.isSuccess){
            Ok(Json.toJson(r.get))
          }
          else
            BadRequest("No se pudo crear el usuario!")
        }
    )
  } 
}