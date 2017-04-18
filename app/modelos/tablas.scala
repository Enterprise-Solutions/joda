package modelos
import play.api.Play
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

class LugarT(tag: Tag) extends Table[Lugar](tag,"lugares"){
  def id = column[Long]("id",O.PrimaryKey,O.AutoInc)
  def nombre = column[String]("nombre")
  def lat    = column[Double]("lat")
  def long   = column[Double]("long")
  
  def * = (id,nombre,lat,long) <> (Lugar.tupled,Lugar.unapply)
}

case class MarcacionV1(
  id: Long,
  usuario_id: Long,
  lugar_id: Long,
  fecha: Timestamp
)

class MarcacionT(tag: Tag) extends Table[MarcacionV1](tag,"marcaciones"){
  def id = column[Long]("id",O.PrimaryKey,O.AutoInc)
  def usuario_id = column[Long]("usuario_id")
  def lugar_id    = column[Long]("lugar_id")
  def fecha   = column[Timestamp]("fecha")
  
  def * = (id,usuario_id,lugar_id, fecha) <> (MarcacionV1.tupled,MarcacionV1.unapply)
}

