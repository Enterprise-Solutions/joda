package services

import play.api.db.slick.{DatabaseConfigProvider,HasDatabaseConfigProvider}
import javax.inject.{Inject,Named}
import scala.concurrent.{ExecutionContext,Future}
import slick.driver.PostgresDriver
import modelos.UsuarioT
import modelos.Usuario
import modelos.DatosCrearUsuario

class Usuarios @Inject() (protected val dbConfigProvider: DatabaseConfigProvider, implicit val ec: ExecutionContext) extends HasDatabaseConfigProvider[PostgresDriver] {
  import driver.api._
  val usuarios = TableQuery[UsuarioT]
  
  def listado(): Future[Seq[Usuario]] = {
    db.run(_action)
  }
  
  def crear(d: DatosCrearUsuario): Future[Usuario] = {
    db.run(crearUsuario(d).transactionally)
  }
  
  def borrar(email: String):Future[String] = {
    db.run(
        borrarUsuario(email).transactionally
    )
  }
  
  def _action: DBIO[Seq[Usuario]] = {
    usuarios.result
  }
  
  def _findUsuario(email: String): DBIO[Option[Usuario]] = {
    usuarios.filter(_.email === email).result.headOption
  }
  
  def crearUsuario(d: DatosCrearUsuario): DBIO[Usuario] = {
    for{
      uOp <- _findUsuario(d.email)
      _   <- uOp match{
        case Some(u) => DBIO.failed(new Exception(s"Ya existe usuario con email: ${d.email}"))
        case None    => DBIO.successful("")
      }
      u   <- _crearUsuario(d)
    }yield(u)
  }
  
  def _crearUsuario(d: DatosCrearUsuario): DBIO[Usuario] = {
    val u = Usuario(0,d.email,d.apellido,d.nombre,d.password)
    for{
      new_id <- usuarios returning usuarios.map(_.id) += u
      u1  <- new_id match{
        case n if(n > 0) => DBIO.successful(u.copy(id = new_id))
        case _ => DBIO.failed(new Exception(s"No se pudo insertar el usuario"))
      }
    }yield(u1)
  }
  
  def borrarUsuario(email: String) = {
    for{
      uOp <- _findUsuario(email)
      u   <- uOp match{
        case None => DBIO.failed(new Exception(s"No existe el usuario con email: $email"))
        case Some(u) => DBIO.successful(u) 
      }
      _   <- _borrarUsuario(u)
    }yield("Se borro el usuario")
  }
  
  def _borrarUsuario(u:Usuario) = {
    for{
      r <- usuarios.filter(_.email === u.email).delete
      _ <- r match{
        case 1 => DBIO.successful("")
        case _ => DBIO.failed(new Exception(""))
      }
    }yield(r)
  }
}