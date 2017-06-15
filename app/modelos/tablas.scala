package modelos

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


case class Usuario(
 id: Long,
 nombre: Option[String],
 apellido: Option[String],
 documento: Option[String],
 email: Option[String],
 usuario:String,
 password: String,
 uid:String,
 activo:Boolean,
 web_login:Boolean,
 empresas_id: Long
)

case class UsuarioJ( //Json que se pasa como respuesta
 id: Long,
 nombre: String,
 apellido: String,
 documento: String,
 email: Option[String],
 usuario:String,
 password: String,
 uid:String,
 activo:Boolean,
 web_login:Boolean,
 empresas_id: Long
)

case class Lugar( // tabla en la BD
 id: Long,
 nombre: Option[String],
 uid:Option[String],
 latitud: Double,
 longitud: Double,
 es_beacon: Boolean,
 direccion:Option[String],
 cliente_id: Option[Long],
 empresa_id: Long
)


case class LugarR( // JSON que se pasa como Respuesta...
 id: Long,
 nombre: Option[String],
 latitud: String,
 longitud: String,
 direccion:Option[String],
 empresa_id: Long,
 cliente_id: Option[Long],
 uid:Option[String],
 es_beacon:Boolean,
 tipo_marcacion: Long
)

case class Marcacion(
 usuario_id: Long,
 lugar_id: Long,
 fecha: Date,
 hora_entrada: Option[Timestamp],
 es_valido: Boolean,
 id: Long,
 hora_salida: Option[Timestamp],
 latitud_entrada: Option[Double],
 longitud_entrada: Option[Double],
 latitud_salida: Option[Double],
 longitud_salida: Option[Double]
)

case class MarcacionR(
 usuario_id: Long,
 lugar_id: Long,
 fecha: String,
 hora_entrada: Option[String],
 es_valido: Boolean,
 id: Long,
 hora_salida: Option[String],
 latitud_entrada: Option[String],
 longitud_entrada: Option[String],
 latitud_salida: Option[String],
 longitud_salida: Option[String]
)

class UsuarioT (tag: Tag) extends Table[Usuario](tag,"usuarios"){
  def id = column[Long]("id",O.PrimaryKey,O.AutoInc)
  def nombre   = column[Option[String]]("nombre") // it could be null...
  def apellido = column[Option[String]]("apellido")
  def documento = column[Option[String]]("documento")
  def email = column[Option[String]]("email")
  def usuario   = column[String]("usuario")
  def password = column[String]("password")
  def uid = column[String]("uid")
  def activo= column[Boolean]("activo")
  def web_login = column[Boolean]("web_login")
  def empresas_id= column[Long]("empresas_id")
  
  def * = (id,nombre,apellido,documento,email,usuario,password,uid,activo,web_login,empresas_id) <> (Usuario.tupled,Usuario.unapply)
}

class LugarT (tag: Tag) extends Table[Lugar](tag,"lugares"){
  def id = column[Long]("id",O.PrimaryKey,O.AutoInc)
  def nombre = column[Option[String]]("nombre")
  def uid = column[Option[String]]("uid")
  def latitud = column[Double]("latitud")
  def longitud = column[Double]("longitud")
  def es_beacon= column[Boolean]("es_beacon")
  def direccion   = column[Option[String]]("direccion")
  def cliente_id = column[Option[Long]]("cliente_id")
  def empresa_id= column[Long]("empresa_id")
  
  def * = (id,nombre,uid,latitud,longitud,es_beacon,direccion,cliente_id,empresa_id) <> (Lugar.tupled,Lugar.unapply)
}

class MarcacionT (tag: Tag) extends Table[Marcacion](tag,"marcaciones"){
  def usuario_id = column[Long]("usuario_id")
  def lugar_id = column[Long]("lugar_id")
  def fecha = column[Date] ("fecha")
  def hora_entrada   = column[Option[Timestamp]]("hora_entrada")
  def es_valido= column[Boolean]("es_valido")
  def id = column[Long]("id",O.PrimaryKey,O.AutoInc)
  def hora_salida   = column[Option[Timestamp]]("hora_salida")
  def latitud_entrada = column[Option[Double]]("latitud_entrada")
  def longitud_entrada = column[Option[Double]]("longitud_entrada")
  def latitud_salida = column[Option[Double]]("latitud_salida")
  def longitud_salida = column[Option[Double]]("longitud_salida")
  
  def * = (usuario_id,lugar_id,fecha,hora_entrada,es_valido,id,hora_salida,latitud_entrada,longitud_entrada,latitud_salida,longitud_salida) <> (Marcacion.tupled,Marcacion.unapply)
}

// Inputs...

//Login
case class DatosLoginUser(
    usuario:String,
    password:String
)

object DatosLoginUser {
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

//Consulta Marcacion...
case class DatosLugaresMarcaciones(
  uid: String,
  fecha: String
)

object Formulario {
  val marcacionesUsuarioForm = Form(
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

//Crear Marcacion...
case class crearMarcacion(
  uid: String,
  hora: String,
  lugar_id: Long,
  latitud: Double,
  longitud: Double
)

object DatosCrearMarcacion {
  val crearMarcacionForm = Form(
        mapping(
    "uid" -> text,
    "hora" -> text,
    "lugar_id" -> of[Long],
    "latitud" -> of[Double],
    "longitud" -> of[Double]
    )(crearMarcacion.apply)(crearMarcacion.unapply)
  )
  
  implicit val readsPerson: Reads[crearMarcacion] = ( //conversion de json a otro tipo
    ((__ \ "uid").read[String]) and
    ((__ \ "hora").read[String]) and
    ((__ \ "lugar_id").read[Long]) and
    ((__ \ "latitud").read[Double]) and 
    ((__ \ "longitud").read[Double])
  )(crearMarcacion.apply _)  

  implicit val writesItem = Writes[crearMarcacion] { //convierte un tipo a json
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

// Respuestas...

//Login
case class LoginUser(
  error: Boolean,
  error_msg: Option[String],
  uid: Option[String],
  user: Option[user_data] = None
)

case class user_data(
  nombre:String,
  email:String
)

case class Marcaje(
    Marcacion: MarcacionR
)

//Consulta Marcacion...
case class lugaresM(
    Lugar: LugarR,
    Marcaciones: Seq[Marcaje]
)
    
case class marcacionesLugares(
    error: Boolean,
    error_msg: Option[String],
    lugares: Option[Seq[lugaresM]]
)

case class listadoUsuarios(
    error: Boolean,
    error_msg: Option[String],
    usuarios: Option[Seq[Usuario]]
)

//Crear Marcacion...

case class marcacionRealizada(
    error: Boolean,
    mensaje: Option[String],
    error_msg: Option[String]
)

case class ExceptionJoda(msg:String, codigo:String) extends Exception(msg)

  
    




