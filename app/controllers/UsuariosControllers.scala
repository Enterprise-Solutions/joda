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
import io.swagger.converter.ModelConverters
import io.swagger.annotations._
import services.marcaciones.marcacionesDeLugares
import play.api.libs.json._
import play.api.libs.functional.syntax._
import scala.concurrent.ExecutionContext
import scala.concurrent.Future

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */

@Singleton
@Api(value = "Usuarios", description = "Operations about Users", consumes="application/x-www-form-urlencoded") 
class UsuariosController @Inject() (nuevoUsuario: CrearUsuario, listarUsuarios: Listar, login: Login, implicit val ec: ExecutionContext) extends Controller {
  
  implicit val userdataJsonFormatter = Json.format[user_data]
  implicit val usuariologinJsonFormatter = Json.format[LoginUser]
  implicit val datosloginJsonFormatter = Json.format[DatosLoginUser]
  implicit val usuariosJsonFormatter = Json.format[Usuario]  
  implicit val lugarJsonFormatter = Json.format[listadoUsuarios]
  implicit val datosNuevoUsuarioJsonFormatter = Json.format[DatosNuevoUsuario]
  implicit val nuevoUsuarioJsonFormatter = Json.format[nuevoUsuario]
  
  @ApiOperation(value = "loginUser",
     notes = "Permite Loguear un Usuario",
     response = classOf[modelos.LoginUser],
     httpMethod = "POST")
  @ApiImplicitParams(Array(
      new ApiImplicitParam(
        name = "usuario",
        value = "User's name",
        required = true,
        dataType = "string",
        paramType = "query"),
      new ApiImplicitParam(
        name = "password",
        value = "The Password",
        required = true,
        dataType = "string",
        paramType = "query")
  ))
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
  
  @ApiOperation(value = "listar",
     notes = "Genera una lista de los usuarios segun una busqueda ",
     response = classOf[modelos.listadoUsuarios],
     httpMethod = "GET")
  def listar(busqueda: Option[String], pagina: Option[Int], cantidad: Option[Int], ordenarPor: Option[String], direccionOrd: Option[String]) = Action.async{request =>
     listarUsuarios.listar(busqueda, pagina, cantidad, ordenarPor, direccionOrd) map { r =>
       Ok(Json.toJson(r))
     } recover {
      case e: Exception => BadRequest(e.getMessage)
    }
   }  
  
  @ApiOperation(value = "crearUsuario",
     notes = "Crea un usuario",
     response = classOf[modelos.nuevoUsuario],
     httpMethod = "POST")
       @ApiImplicitParams(Array(
      new ApiImplicitParam(
        name = "nombre",
        value = "User's name",
        required = true,
        dataType = "string",
        paramType = "query"),
      new ApiImplicitParam(
        name = "apellido",
        value = "LastName",
        required = true,
        dataType = "string",
        paramType = "query"),
      new ApiImplicitParam(
        name = "documento",
        value = "document Number",
        required = true,
        dataType = "string",
        paramType = "query"),
      new ApiImplicitParam(
        name = "email",
        value = "Email",
        required = true,
        dataType = "string",
        paramType = "query"),
      new ApiImplicitParam(
        name = "usuario",
        value = "User id",
        required = true,
        dataType = "string",
        paramType = "query"),
      new ApiImplicitParam(
        name = "password",
        value = "Password",
        required = true,
        dataType = "string",
        paramType = "query"),
      new ApiImplicitParam(
        name = "activo",
        value = "Still function?",
        required = true,
        dataType = "boolean",
        paramType = "query"),
      new ApiImplicitParam(
        name = "web_login",
        value = "Can Loggin from web?",
        required = true,
        dataType = "boolean",
        paramType = "query")
  ))
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
  
}

