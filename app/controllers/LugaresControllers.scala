package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import modelos._
import Framework.Formatters
import scala.util.Success
import scala.util.Failure
import services.lugares.listarLugar
import services.lugares.CrearLugar
import services.lugares.EditarLugar
import play.api.libs.json._
import io.swagger.converter.ModelConverters
import io.swagger.annotations._
import play.api.libs.functional.syntax._
import scala.concurrent.ExecutionContext
import scala.concurrent.Future
import io.really.jwt._
import pdi.jwt.{Jwt, JwtAlgorithm, JwtHeader, JwtClaim, JwtOptions}

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */

@Singleton
@Api(value = "Lugares", description = "Operaciones con lugares", consumes="application/x-www-form-urlencoded ,application/json") 
class LugaresControllers @Inject() (editar: EditarLugar, crear: CrearLugar,listarlugares:listarLugar,implicit val ec: ExecutionContext) extends Controller {
  
  implicit val lugarJsonFormatter = Json.format[Lugar]
  implicit val listarLugaresFormatter = Json.format[listaLugares]
  implicit val listadoLugaresFormatter = Json.format[listadoLugares]
  implicit val crearLugarFormatter = Json.format[nuevoLugar]
  implicit val editarLugarFormatter = Json.format[edicionLugar]
  val HEADER_STRING = "Authorization"

  implicit val lugarRWJsonFormatter: Writes[LugarR] = (
    (JsPath \ "id").write[Long] and
    (JsPath \ "nombre").write[String] and
    (JsPath \ "latitud").write[String] and
    (JsPath \ "longitud").write[String] and
    (JsPath \ "direccion").write[String] and
    (JsPath \ "cliente_id").write[Long] and
    (JsPath \ "uid").write[String] and
    (JsPath \ "es_beacon").write[Boolean] and
    (JsPath \ "tipo_marcacion").write[Long]
  )(unlift(LugarR.unapply))
  
  implicit val lugarRRJsonFormatter: Reads[LugarR] = (
    (__ \ "id").read[Long] and
    (JsPath \ "nombre").read[String] and
    (JsPath \ "latitud").read[String] and
    (JsPath \ "longitud").read[String] and
    (JsPath \ "direccion").read[String] and
    (JsPath \ "cliente_id").read[Long] and
    (JsPath \ "uid").read[String] and
    (JsPath \ "es_beacon").read[Boolean] and
    (JsPath \ "tipo_marcacion").read[Long]
  )(LugarR.apply _)

   
  @ApiOperation(value = "enlistarLugares",
     notes = "Muestra todos los lugares",
     response = classOf[modelos.listadoLugares],
     httpMethod = "GET")
  def listarLugares(busqueda: Option[String], pagina: Option[Int], cantidad: Option[Int], ordenarPor: Option[String], direccionOrd: Option[String]) = Action.async{request =>
     val token = request.headers.get(HEADER_STRING).getOrElse("")
     Jwt.isValid(token, "secretKey", Seq(JwtAlgorithm.HS256)) match {
       case true =>      
         listarlugares.mostrarLugares(busqueda, pagina, cantidad, ordenarPor, direccionOrd) map { r =>
           Ok(Json.toJson(r))
         } recover {
          case e: Exception => BadRequest(e.getMessage)
        }
       case _ => Future(BadRequest("WRONG TOKEN!"))
     }

   }  

  @ApiOperation(value = "crearLugar",
     notes = "Crea un lugar",
     response = classOf[modelos.nuevoLugar],
     httpMethod = "POST")
     @ApiImplicitParams(Array(
      new ApiImplicitParam(
        name = "nombre",
        value = "nombre del lugar",
        required = true,
        dataType = "string",
        paramType = "query"),
      new ApiImplicitParam(
        name = "direccion",
        value = "dirección del lugar",
        required = true,
        dataType = "string",
        paramType = "query"),
      new ApiImplicitParam(
        name = "latitud",
        value = "latitud del lugar",
        required = true,
        dataType = "string",
        paramType = "query"),
      new ApiImplicitParam(
        name = "longitud",
        value = "longitud del lugar",
        required = true,
        dataType = "string",
        paramType = "query"),
      new ApiImplicitParam(
        name = "es_beacon",
        value = "si tiene elemento para marcacion automática",
        required = true,
        dataType = "boolean",
        paramType = "query"),
      new ApiImplicitParam(
        name = "cliente_id",
        value = "ID del cliente al que pertenece el lugar",
        required = true,
        dataType = "int",
        paramType = "query")
  ))
  def crearLugar() = Action.async { implicit request =>
   val message = "Something go wrong !"
   DatosNuevoLugar.datosNuevoLugarForm.bindFromRequest().fold(
      formWithErrors => {
        Future.successful(BadRequest(Json.obj("status" ->"Error", "message" -> message)))
       },
         d => { 
           crear.crearLugar(d) map{ u =>
             Ok(Json.toJson(u))
           }recover {
             case e: Exception => BadRequest(e.getMessage)
           }
         }
     )
 } 
  
  @ApiOperation(value = "editarLugar",
     notes = "Edita un lugar",
     response = classOf[modelos.edicionLugar],
     httpMethod = "POST")
    @ApiImplicitParams(Array(
      new ApiImplicitParam(
        name = "nombre",
        value = "Nombre del lugar",
        required = true,
        dataType = "string",
        paramType = "query"),
      new ApiImplicitParam(
        name = "direccion",
        value = "Direccion del lugar",
        required = true,
        dataType = "string",
        paramType = "query"),
      new ApiImplicitParam(
        name = "latitud",
        value = "Latitud del lugar",
        required = true,
        dataType = "string",
        paramType = "query"),
      new ApiImplicitParam(
        name = "longitud",
        value = "Longitud del lugar",
        required = true,
        dataType = "string",
        paramType = "query"),
      new ApiImplicitParam(
        name = "es_beacon",
        value = "Tiene elemento de marcacion automática?",
        required = true,
        dataType = "boolean",
        paramType = "query")
  ))
  def editarLugar() = Action.async { implicit request =>
   val message = "Something go wrong !"
   DatosEditarLugar.datosEditarLugarForm.bindFromRequest().fold(
      formWithErrors => {
        Future.successful(BadRequest(Json.obj("status" ->"Error", "message" -> message)))
       },
         d => { 
           editar.editarLugar(d) map{ u =>
             Ok(Json.toJson(u))
           }recover {
             case e: Exception => BadRequest(e.getMessage)
           }
         }
     )
 }
}