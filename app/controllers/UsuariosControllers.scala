package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import modelos._
import Framework.Formatters
import scala.util.Success
import scala.util.Failure
import services.usuarios.Login
import services.usuarios.Listar
import services.usuarios.CrearUsuario
import services.usuarios.EditarUsuario

import play.api.libs.json._
import play.api.libs.functional.syntax._
import scala.concurrent.ExecutionContext
import scala.concurrent.Future

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */

@Singleton
class UsuariosController @Inject() (editar: EditarUsuario, nuevoUsuario: CrearUsuario, listarUsuarios: Listar, login: Login, implicit val ec: ExecutionContext) extends Controller {
  
  implicit val userdataJsonFormatter = Json.format[user_data]
  implicit val usuariologinJsonFormatter = Json.format[LoginUser]
  implicit val datosloginJsonFormatter = Json.format[DatosLoginUser]
  implicit val usuariosJsonFormatter = Json.format[Usuario]  
  implicit val lugarJsonFormatter = Json.format[listadoUsuarios]
  implicit val datosNuevoUsuarioJsonFormatter = Json.format[DatosNuevoUsuario]
  implicit val nuevoUsuarioJsonFormatter = Json.format[nuevoUsuario]
  implicit val datosEditarUsuarioJsonFormatter = Json.format[DatosEditarUsuario]
  implicit val editarUsuarioJsonFormatter = Json.format[edicionUsuario]
      
  def loginUser() = Action.async { implicit request =>
   val message = "Something go wrong !"
   DatosLoginUser.loginForm.bindFromRequest().fold(
      formWithErrors => {
        Future.successful(BadRequest(Json.obj("status" ->"Error", "message" -> message)))
       },
         d => { 
           login.loginU(d) map{ u =>
             Ok(Json.toJson(u))
           }recover {
             case e: Exception => BadRequest(e.getMessage)
           }
         }
     )
 }
    
  def listar(busqueda: Option[String], pagina: Option[Int], cantidad: Option[Int], ordenarPor: Option[String], direccionOrd: Option[String]) = Action.async{request =>
     listarUsuarios.listar(busqueda, pagina, cantidad, ordenarPor, direccionOrd) map { r =>
       Ok(Json.toJson(r))
     } recover {
      case e: Exception => BadRequest(e.getMessage)
    }
   }  

  def crearUsuario() = Action.async { implicit request =>
   val message = "Something go wrong !"
   DatosNuevoUsuario.datosNuevoUsuarioForm.bindFromRequest().fold(
      formWithErrors => {
        Future.successful(BadRequest(Json.obj("status" ->"Error", "message" -> message)))
       },
         d => { 
           nuevoUsuario.crearUsuario(d) map{ u =>
             Ok(Json.toJson(u))
           }recover {
             case e: Exception => BadRequest(e.getMessage)
           }
         }
     )
 }  
  
  def editarUsuario() = Action.async { implicit request =>
   val message = "Something go wrong !"
   DatosEditarUsuariov.datosEditarUsuarioForm.bindFromRequest().fold(
      formWithErrors => {
        Future.successful(BadRequest(Json.obj("status" ->"Error", "message" -> message)))
       },
         d => { 
           editar.editarUsuario(d) map{ u =>
             Ok(Json.toJson(u))
           }recover {
             case e: Exception => BadRequest(e.getMessage)
           }
         }
     )
 }
  
}

