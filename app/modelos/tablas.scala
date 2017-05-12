package modelos
import play.api.Play
import java.util.Date
import slick.driver.PostgresDriver.api._
import java.sql.Timestamp

case class Usuario(
  id: Long,
  email: String,
  apellido: String,
  nombre: String,
  password: String
  //marcaciones: Seq[Marcacion] = Seq[Marcacion]()
){
  def nombre_completo = {
    val Nombre = nombre.toUpperCase()
    s" $Nombre ${apellido.toUpperCase()}"
  }
  
  def _toDatosUsuario = {
    DatosUsuario(email)
  }
}

class UsuarioT (tag: Tag) extends Table[Usuario](tag,"usuarios"){
  def id = column[Long]("id",O.PrimaryKey,O.AutoInc)
  def email = column[String]("email")
  def apellido = column[String]("apellido")
  def nombre   = column[String]("nombre")
  def password = column[String]("password")
  
  def * = (id,email,apellido,nombre,password) <> (Usuario.tupled,Usuario.unapply)
}

case class Lugar(
  id: Long,
  nombre: String,
  lat: Double,
  long: Double
)

case class DatosCrearMarcacion(
    usuario_id:Long,
    lugar_id:Long
)

case class DatosListadoMarcaciones(
  nombreUser: String,
  nombreLugar: String
)

case class DatosActualizarUsuario(
  email: String,
  nombre: String
)

class LugarT(tag: Tag) extends Table[Lugar](tag,"lugares"){
  def id = column[Long]("id",O.PrimaryKey,O.AutoInc)
  def nombre = column[String]("nombre")
  def lat    = column[Double]("lat")
  def long   = column[Double]("long")
  
  def * = (id,nombre,lat,long) <> (Lugar.tupled,Lugar.unapply)
}

case class Marcacion(
  id: Long,
  usuario_id: Long,
  lugar_id: Long,
  fecha: Timestamp
)

case class MarcacionR(
  id: Long,
  usuario_id: Long,
  lugar_id: Long,
  fecha: String
)

case class ListadoMarcaciones(
    nombre: String,
    apellido: String,
    email: String,
    fecha: String,
    cant: Int,
    maxd: String,
    mind: String
)

case class DatosResumenDiaTrabajado(
    email:String,
    fecha:String,
    horas:Double,
    minutos:Double,
    segundos:Double
)

case class DatosCrearLugar(
  nombre: String,
  latitud: Double,
  longitud: Double    
)

class MarcacionT(tag: Tag) extends Table[Marcacion](tag,"marcaciones"){
  def id = column[Long]("id",O.PrimaryKey,O.AutoInc)
  def usuario_id = column[Long]("usuario_id")
  def lugar_id    = column[Long]("lugar_id")
  def fecha  = column[Timestamp]("fecha")
  
  def * = (id,usuario_id,lugar_id,fecha) <> (Marcacion.tupled,Marcacion.unapply)
}


class MarcacionRT(tag: Tag) extends Table[MarcacionR](tag,"marcacionesr"){
  def id = column[Long]("id",O.PrimaryKey,O.AutoInc)
  def usuario_id = column[Long]("usuario_id")
  def lugar_id    = column[Long]("lugar_id")
  def fecha  = column[String]("fecha")
  
  def * = (id,usuario_id,lugar_id,fecha) <> (MarcacionR.tupled,MarcacionR.unapply)
}
