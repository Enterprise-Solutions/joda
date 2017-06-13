package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import modelos._
import Framework.Formatters
import scala.util.Success
import scala.util.Failure
import services.marcaciones.insertarMarcacion
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
class MarcacionesControllers @Inject() (listarMarcacionPorLugares: marcacionesDeLugares, nueva_marcacion: insertarMarcacion,implicit val ec: ExecutionContext) extends Controller {
  
  implicit val crearMarcacionJsonFormatter = Json.format[crearMarcacion]
  implicit val datoslugaresmarcacionesJsonFormatter= Json.format[DatosLugaresMarcaciones]
  implicit val lugarJsonFormatter = Json.format[Lugar]
 
  
  implicit val lugarRWJsonFormatter: Writes[LugarR] = (
    (JsPath \ "id").write[Long] and
    (JsPath \ "nombre").write[Option[String]] and
    (JsPath \ "latitud").write[String] and
    (JsPath \ "longitud").write[String] and
    (JsPath \ "direccion").write[Option[String]] and
    (JsPath \ "empresa_id").write[Long] and
    (JsPath \ "cliente_id").write[Option[Long]] and
    (JsPath \ "uid").write[Option[String]] and
    (JsPath \ "es_beacon").write[Boolean] and
    (JsPath \ "tipo_marcacion").write[Long]
  )(unlift(LugarR.unapply))
  
  implicit val lugarRRJsonFormatter: Reads[LugarR] = (
    (__ \ "id").read[Long] and
    (JsPath \ "nombre").readNullable[String] and
    (JsPath \ "latitud").read[String] and
    (JsPath \ "longitud").read[String] and
    (JsPath \ "direccion").readNullable[String] and
    (JsPath \ "empresa_id").read[Long] and
    (JsPath \ "cliente_id").readNullable[Long] and
    (JsPath \ "uid").readNullable[String] and
    (JsPath \ "es_beacon").read[Boolean] and
    (JsPath \ "tipo_marcacion").read[Long]
  )(LugarR.apply _)
  
    implicit val MarcacionRJsonFormatter: Writes[MarcacionR] = (
    (JsPath \ "usuario_id").write[Long] and
    (JsPath \ "lugar_id").write[Long] and
    (JsPath \ "fecha").write[String] and
    (JsPath \ "hora_entrada").write[Option[String]] and
    (JsPath \ "es_valido").write[Boolean] and
    (JsPath \ "id").write[Long] and
    (JsPath \ "hora_salida").write[Option[String]] and
    (JsPath \ "latitud_entrada").write[Option[String]] and
    (JsPath \ "longitud_entrada").write[Option[String]] and
    (JsPath \ "latitud_salida").write[Option[String]] and
    (JsPath \ "longitud_salida").write[Option[String]]
  )(unlift(MarcacionR.unapply))
  
  implicit val MarcacionRRJsonFormatter: Reads[MarcacionR] = (
    (JsPath \ "usuario_id").read[Long] and
    (JsPath \ "lugar_id").read[Long] and
    (JsPath \ "fecha").read[String] and
    (JsPath \ "hora_entrada").readNullable[String] and
    (JsPath \ "es_valido").read[Boolean] and
    (JsPath \ "id").read[Long] and
    (JsPath \ "hora_salida").readNullable[String] and
    (JsPath \ "latitud_entrada").readNullable[String] and
    (JsPath \ "longitud_entrada").readNullable[String] and
    (JsPath \ "latitud_salida").readNullable[String] and
    (JsPath \ "longitud_salida").readNullable[String]
  )(MarcacionR.apply _)
  
  
  implicit val marcajeJsonFormatter = Json.format[Marcaje]
  
  implicit val seqMarcacionesLugaresJsonFormatter: Writes[lugaresM] = (
    (JsPath \ "Lugar").write[LugarR] and
    (JsPath \ "Marcaciones").write[Seq[Marcaje]]
  )(unlift(lugaresM.unapply))
  
  implicit val seqMarcacionesWLugaresJsonFormatter = Json.format[lugaresM]
  implicit val lugaresmarcadosJsonFormatter = Json.format[marcacionesLugares]
  implicit val nuevaMarcacionJsonFormatter = Json.format[marcacionRealizada]
       
  def marcacionesLugares() = Action.async { implicit request =>
    val message = "Something go wrong !"
    Formulario.marcacionesUsuarioForm.bindFromRequest().fold(
         formWithErrors => {
         Future.successful(BadRequest(Json.obj("status" ->"Error", "message" -> message)))
        },
          d => { 
            listarMarcacionPorLugares.showMarcaciones(d) map{ u =>
              Ok(Json.toJson(u))
            }recover {
              case e: Exception => BadRequest(e.getMessage)
            }
         }
    )
  }
  
    def crearNuevaMarcacion() = Action.async { implicit request =>
    val message = "Something go wrong !"
    DatosCrearMarcacion.crearMarcacionForm.bindFromRequest().fold(
         formWithErrors => {
         Future.successful(BadRequest(Json.obj("status" ->"Error", "message" -> message)))
        },
          d => { 
            nueva_marcacion.nuevaMarcacion(d) map{ u =>
              Ok(Json.toJson(u))
            }recover {
              case e: Exception => BadRequest(e.getMessage)
            }
          }
        )
    }

}