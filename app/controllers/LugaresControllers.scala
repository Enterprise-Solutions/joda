package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import modelos._
import Framework.Formatters
import scala.util.Success
import scala.util.Failure
import services.lugares.listarLugar
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
class LugaresControllers @Inject() (listarlugares:listarLugar,implicit val ec: ExecutionContext) extends Controller {
  
  implicit val lugarJsonFormatter = Json.format[Lugar]
  implicit val listarLugaresFormatter = Json.format[listaLugares]
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
     response = classOf[modelos.Lugar],
     httpMethod = "GET")
  def listarLugares() = Action.async{request =>
     val token = request.headers.get(HEADER_STRING).getOrElse("")
     Jwt.isValid(token, "secretKey", Seq(JwtAlgorithm.HS256)) match {
       case true =>      
         listarlugares.mostrarLugares() map { r =>
           Ok(Json.toJson(r))
         } recover {
          case e: Exception => BadRequest(e.getMessage)
        }
       case _ => Future(BadRequest("WRONG TOKEN!"))
     }

   }  

}