package modelos

import play.api.Play
import play.api.data._
import play.api.data.Forms._
import play.api.data.format.Formats._ 
import slick.driver.PostgresDriver.api._
import java.sql.Timestamp
import play.api.data.Form
import play.api.data.Forms.{mapping, text, of, boolean, optional}
import play.api.data.format.Formats.doubleFormat
import play.api.libs.json.{__, Reads, Writes}
import play.api.libs.functional.syntax._
import play.api.libs.json.Json
import java.sql.Date
import play.api.libs.json._
import play.api.libs.functional.syntax._
import io.swagger.annotations.ApiModelProperty

/*
 * TABLAS DB's--------------------------
 * -------------------------------------------------------------------------------------------
 */
case class Usuario(
 id_usuario: Long,
 nombre: String,
 apellido: String,
 documento: String,
 email: Option[String],
 usuario:String,
 password: String,
 uid:String,
 activo:Boolean,
 web_login:Boolean,
 id_empresa:Long
)
class UsuarioT (tag: Tag) extends Table[Usuario](tag,"usuarios"){
  def id_usuario = column[Long]("id_usuario",O.PrimaryKey,O.AutoInc)
  def nombre   = column[String]("nombre") // it could be null...
  def apellido = column[String]("apellido")
  def documento = column[String]("documento")
  def email = column[Option[String]]("email")
  def usuario   = column[String]("usuario")
  def password = column[String]("password")
  def uid = column[String]("uid")
  def activo= column[Boolean]("activo")
  def web_login = column[Boolean]("web_login")
  def id_empresa = column[Long]("id_empresa")
  
  def * = (id_usuario,nombre,apellido,documento,email,usuario,password,uid,activo,web_login,id_empresa) <> (Usuario.tupled,Usuario.unapply)
}

case class Cliente(
    id_cliente:Long,
    nombre:String,
    ruc:String,
    id_empresa:Int
 )
 class ClienteT (tag: Tag) extends Table[Cliente](tag,"clientes"){
  def id_cliente = column[Long]("id_cliente",O.PrimaryKey,O.AutoInc)
  def nombre   = column[String]("nombre")
  def ruc = column[String]("ruc")
  def id_empresa   = column[Int]("id_empresa")
  def * = (id_cliente,nombre,ruc,id_empresa) <> (Cliente.tupled,Cliente.unapply)
}

 case class Lugar( // tabla en la BD
 id_lugar: Long,
 nombre: String,
 uid:String,
 latitud: Double,
 longitud: Double,
 es_beacon: Boolean,
 direccion:String,
 id_cliente: Long
)
class LugarT (tag: Tag) extends Table[Lugar](tag,"lugares"){
  def id_lugar = column[Long]("id_lugar",O.PrimaryKey,O.AutoInc)
  def nombre = column[String]("nombre")
  def uid = column[String]("uid")
  def latitud = column[Double]("latitud")
  def longitud = column[Double]("longitud")
  def es_beacon= column[Boolean]("es_beacon")
  def direccion   = column[String]("direccion")
  def id_cliente = column[Long]("id_cliente")
  
  def * = (id_lugar,nombre,uid,latitud,longitud,es_beacon,direccion,id_cliente) <> (Lugar.tupled,Lugar.unapply)
}

case class Marcacion(
 id_marcacion:Long,
 fecha: Date,
 hora_entrada: Timestamp,
 latitud_entrada: Double,
 longitud_entrada: Double,
 hora_salida: Option[Timestamp],
 latitud_salida: Option[Double],
 longitud_salida: Option[Double],
 es_valido: Boolean,
 total_horas:Option[Timestamp],
 id_lugar: Long,
 id_usuario: Long
)
class MarcacionT (tag: Tag) extends Table[Marcacion](tag,"marcaciones"){
  def id_marcacion = column[Long]("id_marcacion",O.PrimaryKey,O.AutoInc)
  def fecha = column[Date] ("fecha")
  def hora_entrada   = column[Timestamp]("hora_entrada")
  def latitud_entrada = column[Double]("latitud_entrada")
  def longitud_entrada = column[Double]("longitud_entrada")
  def hora_salida   = column[Option[Timestamp]]("hora_salida")
  def latitud_salida = column[Option[Double]]("latitud_salida")
  def longitud_salida = column[Option[Double]]("longitud_salida")
  def es_valido= column[Boolean]("es_valido")
  def total_horas   = column[Option[Timestamp]]("total_horas")
  def id_lugar = column[Long]("id_lugar")
  def id_usuario= column[Long]("id_usuario")
  
  def * = (id_marcacion,fecha,hora_entrada,latitud_entrada,longitud_entrada,hora_salida,latitud_salida,longitud_salida,es_valido,total_horas,id_lugar,id_usuario) <> (Marcacion.tupled,Marcacion.unapply)
}

case class Empresa(
  id_empresa:Long,
  nombre:String,
  logo:Option[String],
  color1:Option[String],
  color2:Option[String],
  color3:Option[String],
  cnt_usuarios_plan:Int
)
class EmpresaT (tag: Tag) extends Table[Empresa](tag,"empresas"){
  def id_empresa = column[Long]("id",O.PrimaryKey,O.AutoInc)
  def nombre   = column[String]("nombre") // it could be null...
  def logo = column[Option[String]]("logo")
  def color1 = column[Option[String]]("color1")
  def color2 = column[Option[String]]("color2")
  def color3   = column[Option[String]]("color3")
  def cnt_usuarios_plan = column[Int]("cnt_usuarios_plan")
  
  def * = (id_empresa,nombre,logo,color1,color2,color3,cnt_usuarios_plan) <> (Empresa.tupled,Empresa.unapply)
}

/*
 * -------------------------------------------------------------------------------------------------------------------
 */

case class UsuarioJ( //Json que se pasa como respuesta
 id_usuario: Long,
 nombre: String,
 apellido: String,
 documento: String,
 email: Option[String],
 usuario:String,
 password: String,
 uid:String,
 activo:Boolean,
 web_login:Boolean
)

//datos de un nuevo usuario a ser creado
case class DatosNuevoUsuario(
 nombre: String,
 apellido: String,
 documento: String,
 email: String,
 usuario:String,
 password: String,
 activo:Boolean,
 web_login:Boolean,
 empresas_id:Int
)


//Json de respuesta al crear nuevo usuario
case class nuevoUsuario(
    error: Boolean,
    error_msg: Option[String],
    usuario: Option[Usuario]
)

case class nuevoUsuarioNoencontrado(
    error: Boolean,
    error_msg: Option[String]
)

//datos a editar de un usuario
case class DatosEditarUsuario(
 nombre: String,
 apellido: String,
 documento: String,
 email: String,
 usuario:String,
 activo:Boolean,
 web_login:Boolean,
 uid: String
)

//Json de respuesta al editar datos del usuario
case class edicionUsuario(
    error: Boolean,
    error_msg: Option[String],
    usuario: Option[Usuario]
)


case class listaLugares(
    id: Long,
    nombre: String,
    direccion:String
   )


//datos para editar contraseña de usuario
case class DatosEditarContrasenha(
 uid: String,
 contrasenha_vieja: Option[String],
 contrasenha_nueva: String,
 confirmacion_contrasenha_nueva: String
)

//Json de respuesta al editar contrasenha del usuario
case class edicionContrasenha(
    error: Boolean,
    error_msg: Option[String],
    mensaje: Option[String]
)

case class LugarR( // JSON que se pasa como Respuesta...
 id_lugar: Long,
 nombre: String,
 latitud: String,
 longitud: String,
 direccion:String,
 cliente_id: Long,
 uid:String,
 es_beacon:Boolean,
 tipo_marcacion: Long
)

case class MarcacionR(
 usuario_id: Long,
 lugar_id: Long,
 fecha: String,
 hora_entrada: String,
 es_valido: Boolean,
 id: Long,
 hora_salida: Option[String],
 latitud_entrada: String,
 longitud_entrada: String,
 latitud_salida: Option[String],
 longitud_salida: Option[String]
)

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

object DatosNuevoUsuario {
  val datosNuevoUsuarioForm = Form(
        mapping(
    "nombre" -> text,
    "apellido" -> text,
    "documento" -> text,
    "email" -> text,
    "usuario" -> text,
    "password" -> text,
    "activo" -> boolean,
    "web_login" -> boolean,
    "empresas_id" -> number
    )(DatosNuevoUsuario.apply)(DatosNuevoUsuario.unapply)
  )
  
 implicit val readsPerson: Reads[DatosNuevoUsuario] = (
    ((__ \ "nombre").read[String]) and
    ((__ \ "apellido").read[String]) and
    ((__ \ "documento").read[String]) and
    ((__ \ "email").read[String]) and
    ((__ \ "usuario").read[String]) and
    ((__ \ "password").read[String]) and
    ((__ \ "activo").read[Boolean]) and
    ((__ \ "web_login").read[Boolean]) and
    ((__ \ "empresas_id").read[Int])
  )(DatosNuevoUsuario.apply _)  

  implicit val writesItem = Writes[DatosNuevoUsuario] {
    case DatosNuevoUsuario(nombre, apellido, documento, email, usuario, password, activo, web_login,empresas_id) =>
      Json.obj(
        "nombre" -> nombre,
        "apellido" -> apellido,
        "documento" -> documento,
        "email" -> email,
        "usuario" -> usuario,
        "password" -> password,
        "activo" -> activo,
        "web_login" -> web_login,
        "empresas_id" -> empresas_id
      )
  }
}

object DatosEditarUsuariov {
  val datosEditarUsuarioForm = Form(
        mapping(
    "nombre" -> text,
    "apellido" -> text,
    "documento" -> text,
    "email" -> text,
    "usuario" -> text,
    "activo" -> boolean,
    "web_login" -> boolean,
    "uid" -> text
    )(DatosEditarUsuario.apply)(DatosEditarUsuario.unapply)
  )
  
 implicit val readsEditPerson: Reads[DatosEditarUsuario] = (
    ((__ \ "nombre").read[String]) and
    ((__ \ "apellido").read[String]) and
    ((__ \ "documento").read[String]) and
    ((__ \ "email").read[String]) and
    ((__ \ "usuario").read[String]) and
    ((__ \ "activo").read[Boolean]) and
    ((__ \ "web_login").read[Boolean]) and
    ((__ \ "uid").read[String])
  )(DatosEditarUsuario.apply _)  

  implicit val writesEditPerson = Writes[DatosEditarUsuario] {
    case DatosEditarUsuario(nombre, apellido, documento, email, usuario, activo, web_login, uid) =>
      Json.obj(
        "nombre" -> nombre,
        "apellido" -> apellido,
        "documento" -> documento,
        "email" -> email,
        "usuario" -> usuario,
        "activo" -> activo,
        "web_login" -> web_login,
        "uid" -> uid
      )
  }
}

object DatosEditarContrasenha {
  val datosEditarContrasenhaForm = Form(
        mapping(
    "uid" -> text,
    "contrasenha_vieja" -> optional(text),
    "contrasenha_nueva" -> text,
    "confirmacion_contrasenha_nueva" -> text
    )(DatosEditarContrasenha.apply)(DatosEditarContrasenha.unapply)
  )
  
 implicit val readsEditPerson: Reads[DatosEditarContrasenha] = (
    ((__ \ "uid").read[String]) and
    ((__ \ "contrasenha_vieja").readNullable[String]) and
    ((__ \ "contrasenha_nueva").read[String]) and
    ((__ \ "confirmacion_contrasenha_nueva").read[String]) 
  )(DatosEditarContrasenha.apply _)  

  implicit val writesEditPerson = Writes[DatosEditarContrasenha] {
    case DatosEditarContrasenha(uid, contrasenha_vieja, contrasenha_nueva, confirmacion_contrasenha_nueva) =>
      Json.obj(
        "uid" -> uid,
        "contrasenha_vieja" -> contrasenha_vieja,
        "contrasenha_nueva" -> contrasenha_nueva,
        "confirmacion_contrasenha_nueva" -> confirmacion_contrasenha_nueva
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

case class listadoMarcaciones(
    lugar:String,
    usuario:String,//nombre del usuario que marco...
    dirección:String,
    cliente:String,//nombre de la empresa...
    fecha:String,
    horaEntrada:String,
    horaSalida:Option[String],
    tiempoEmpleado: String
    )

// Respuestas...

//Login
case class LoginUser(
  error: Boolean,
  error_msg: Option[String],
  uid: Option[String],
  token:Option[String],
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
    usuarios: Option[Seq[Usuario]],
    total: Option[Int]
)

//Crear Marcacion...

case class marcacionRealizada(
    error: Boolean,
    mensaje: Option[String],
    error_msg: Option[String]
)

case class ExceptionJoda(msg:String, codigo:String) extends Exception(msg)

  
    




