package services

import play.api.db.slick.{DatabaseConfigProvider,HasDatabaseConfigProvider}
import javax.inject.{Inject,Named}
import scala.concurrent.{ExecutionContext,Future}
import slick.driver.PostgresDriver
import modelos.UsuarioT
import modelos.MarcacionT
import modelos.LugarT
import modelos.Usuario
import modelos.Lugar
import modelos.MarcacionV1
import modelos.DatosCrearUsuario
import java.sql.Timestamp
import java.text.SimpleDateFormat

case class DatosDeMarcacion(
  id: Long,
  usuario_id: Long,
  lugar_id: Long,
  fecha: String  
)

case class DatosCrearMarcacion(
  email: String,
  lugar: String,
  fecha: String
)

case class DatosCrearMarcacion2(
  usuario_id: Long,
  lugar_id: Long,
  fecha: Timestamp
)

class Marcaciones @Inject() (protected val dbConfigProvider: DatabaseConfigProvider, implicit val ec: ExecutionContext) extends HasDatabaseConfigProvider[PostgresDriver] {
  import driver.api._
  val marcaciones = TableQuery[MarcacionT]
  val usuarios = TableQuery[UsuarioT]
  val lugares = TableQuery[LugarT]
  
  def listado(usuario_id:Option[Long],lugar_id: Option[Long]): Future[Seq[DatosDeMarcacion]] = {
    db.run(_action(usuario_id,lugar_id))
  }
  
  def _action(usuario_id:Option[Long],lugar_id: Option[Long]): DBIO[Seq[DatosDeMarcacion]] = {
    val q = marcaciones.sortBy(_.fecha.asc)
    val q1 = usuario_id.map{ u =>
      q.filter(_.usuario_id === u)
    }.getOrElse(q)
    val q2 = lugar_id.map{ u =>
      q1.filter(_.lugar_id === u)
    }.getOrElse(q1)
    
    for{
      r <- q2.result
      r1 <- DBIO.successful{r.map{m =>
        DatosDeMarcacion(
          m.id,
          m.usuario_id,
          m.lugar_id,
          m.fecha.toString
        )
      }}
    }yield(r1)
  }
  
  def crear(d: DatosCrearMarcacion): Future[DatosDeMarcacion] = {
    db.run(crearMarcacion(d).transactionally)
  }
  
  def _findUsuario(email: String): DBIO[Option[Usuario]] = {
    usuarios.filter(_.email === email).result.headOption
  }
  
  def _findLugar(nombre: String): DBIO[Option[Lugar]] = {
    lugares.filter(_.nombre === nombre).result.headOption
  }
  
  def crearMarcacion(d: DatosCrearMarcacion): DBIO[DatosDeMarcacion] = {
    
    val formatOfDate = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
	   
    for{
      uOp <- _findUsuario(d.email)
      _   <- uOp match{
        case None => DBIO.failed(new Exception(s"No existe usuario con email: ${d.email}. Crear primero el usuario"))
        case Some(u)    => DBIO.successful("")
      }
      lOp <- _findLugar(d.lugar)
      _   <- lOp match{
        case None => DBIO.failed(new Exception(s"No existe lugar con nombre: ${d.lugar}. Crear primero el lugar"))
        case Some(u)    => DBIO.successful("")
      }
      m   <- _crearMarcacion(DatosCrearMarcacion2(uOp.get.id, lOp.get.id, Timestamp.valueOf(d.fecha)))
    }yield(m)
  }
  
  def _crearMarcacion(d: DatosCrearMarcacion2): DBIO[DatosDeMarcacion] = {
    val m = MarcacionV1(0,d.usuario_id,d.lugar_id,d.fecha)
    for{
      new_id <- marcaciones returning marcaciones.map(_.id) += m
      u1  <- new_id match{
        case n if(n > 0) => DBIO.successful(m.copy(id = new_id))
        case _ => DBIO.failed(new Exception(s"No se pudo insertar la marcacion"))
      }
      m1 <- DBIO.successful{
        DatosDeMarcacion(
          new_id,
          m.usuario_id,
          m.lugar_id,
          m.fecha.toString
        )}
    }yield(m1)
  }
}