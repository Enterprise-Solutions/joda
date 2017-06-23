package Framework

import modelos._
import play.api.Play
import play.api.data.format.Formats._ 
import slick.driver.PostgresDriver.api._
import java.sql.Timestamp
import play.api.data.Form
import play.api.data.Forms.{mapping, text, of}
import play.api.data.format.Formats.doubleFormat
import play.api.libs.json.{__, Reads, Writes}
import play.api.libs.functional.syntax._
import play.api.libs.json.Json
import java.sql.Date
import play.api.libs.json._
import play.api.libs.functional.syntax._
import play.api.data.Forms.{mapping, text, of}
import play.api.data.Form
import play.api.mvc._
import play.api.libs.json._
import play.api.libs.functional.syntax._

class Formatters {
    object FormMarcar {
    val crearMarcacionForm = Form(
          mapping(
      "uid" -> text,
      "hora" -> text,
      "lugar_id" -> of[Long],
      "latitud" -> of[Double],
      "longitud" -> of[Double]
      )(crearMarcacion.apply)(crearMarcacion.unapply)
    )
    
    implicit val readsPerson: Reads[crearMarcacion] = (
      ((__ \ "uid").read[String]) and
      ((__ \ "hora").read[String]) and
      ((__ \ "lugar_id").read[Long]) and
      ((__ \ "latitud").read[Double]) and 
      ((__ \ "longitud").read[Double])
    )(crearMarcacion.apply _)  
  
    implicit val writesItem = Writes[crearMarcacion] {
      case crearMarcacion(uid, hora, lugar_id, latitud, longitud) =>
        Json.obj(
          "uid" -> uid,
          "hora" -> hora,
          "lugar_id" -> lugar_id,
          "latitud" -> latitud,
          "longitud" -> longitud
        )
    }
  }

  object FormLugaresMarcaciones {
    val loginForm = Form(
          mapping(
      "uid" -> text,
      "fecha" -> text
      )(DatosLugaresMarcaciones.apply)(DatosLugaresMarcaciones.unapply)
    )
    
    implicit val readsPerson: Reads[DatosLugaresMarcaciones] = (
      ((__ \ "uid").read[String]) and
      ((__ \ "fecha").read[String])
    )(DatosLugaresMarcaciones.apply _)  
  
    implicit val writesItem = Writes[DatosLugaresMarcaciones] {
      case DatosLugaresMarcaciones(uid, fecha) =>
        Json.obj(
          "uid" -> uid,
          "fecha" -> fecha
        )
    }
  }


  object LoginForm {
    val loginForm = Form(
          mapping(
      "usuario" -> text,
      "password" -> text
      )(DatosLoginUser.apply)(DatosLoginUser.unapply)
    )
    
    implicit val readsPerson: Reads[DatosLoginUser] = (
      ((__ \ "usuario").read[String]) and
      ((__ \ "password").read[String])
    )(DatosLoginUser.apply _)  
  
    implicit val writesItem = Writes[DatosLoginUser] {
      case DatosLoginUser(usuario, password) =>
        Json.obj(
          "usuario" -> usuario,
          "password" -> password
        )
    }
  }
    
  implicit val crearMarcacionJsonFormatter = Json.format[crearMarcacion]
  implicit val userdataJsonFormatter = Json.format[user_data]
  implicit val usuariologinJsonFormatter = Json.format[LoginUser]
  implicit val datosloginJsonFormatter = Json.format[DatosLoginUser]
  implicit val datoslugaresmarcacionesJsonFormatter= Json.format[DatosLugaresMarcaciones]
  implicit val lugarJsonFormatter = Json.format[Lugar]
 
  
  implicit val lugarRWJsonFormatter: Writes[LugarR] = (
    (JsPath \ "id").write[Long] and
    (JsPath \ "nombre").write[String] and
    (JsPath \ "latitud").write[String] and
    (JsPath \ "longitud").write[String] and
    (JsPath \ "direccion").write[String] and
    (JsPath \ "empresa_id").write[Long] and
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
    (JsPath \ "empresa_id").read[Long] and
    (JsPath \ "cliente_id").read[Long] and
    (JsPath \ "uid").read[String] and
    (JsPath \ "es_beacon").read[Boolean] and
    (JsPath \ "tipo_marcacion").read[Long]
  )(LugarR.apply _)
  
    implicit val MarcacionRJsonFormatter: Writes[MarcacionR] = (
    (JsPath \ "usuario_id").write[Long] and
    (JsPath \ "lugar_id").write[Long] and
    (JsPath \ "fecha").write[String] and
    (JsPath \ "hora_entrada").write[String] and
    (JsPath \ "es_valido").write[Boolean] and
    (JsPath \ "id").write[Long] and
    (JsPath \ "hora_salida").write[Option[String]] and
    (JsPath \ "latitud_entrada").write[String] and
    (JsPath \ "longitud_entrada").write[String] and
    (JsPath \ "latitud_salida").write[Option[String]] and
    (JsPath \ "longitud_salida").write[Option[String]]
  )(unlift(MarcacionR.unapply))
  
  implicit val MarcacionRRJsonFormatter: Reads[MarcacionR] = (
    (JsPath \ "usuario_id").read[Long] and
    (JsPath \ "lugar_id").read[Long] and
    (JsPath \ "fecha").read[String] and
    (JsPath \ "hora_entrada").read[String] and
    (JsPath \ "es_valido").read[Boolean] and
    (JsPath \ "id").read[Long] and
    (JsPath \ "hora_salida").readNullable[String] and
    (JsPath \ "latitud_entrada").read[String] and
    (JsPath \ "longitud_entrada").read[String] and
    (JsPath \ "latitud_salida").readNullable[String] and
    (JsPath \ "longitud_salida").readNullable[String]
  )(MarcacionR.apply _)
  
  
  implicit val marcajeJsonFormatter = Json.format[Marcaje]
  implicit val seqMarcacionesWLugaresJsonFormatter = Json.format[lugaresM]
  implicit val lugaresmarcadosJsonFormatter = Json.format[marcacionesLugares]
  implicit val nuevaMarcacionJsonFormatter = Json.format[marcacionRealizada]
    
  implicit val seqMarcacionesLugaresJsonFormatter: Writes[lugaresM] = (
    (JsPath \ "Lugar").write[LugarR] and
    (JsPath \ "Marcaciones").write[Seq[Marcaje]]
  )(unlift(lugaresM.unapply))
  
}



