package services

import play.api.db.slick.{DatabaseConfigProvider,HasDatabaseConfigProvider}
import javax.inject.{Inject,Named}
import scala.concurrent.{ExecutionContext,Future}
import slick.driver.PostgresDriver
import modelos.LugarT
import modelos.Lugar
import modelos.DatosCrearLugar


class Lugares @Inject() (protected val dbConfigProvider: DatabaseConfigProvider, implicit val ec: ExecutionContext) extends HasDatabaseConfigProvider[PostgresDriver] {
  import driver.api._
  val lugares = TableQuery[LugarT]
  
  def listado(): Future[Seq[Lugar]] = {
    db.run(_action)
  }
  
  def crear(d: DatosCrearLugar): Future[Lugar] = {
    db.run(crearLugar(d).transactionally)
  }
  
  def borrar(nombre: String):Future[String] = {
    db.run(
        borrarLugar(nombre).transactionally
    )
  }
  
  def _action: DBIO[Seq[Lugar]] = {
    lugares.result
  }
  
  def _findLugar(nombre: String): DBIO[Option[Lugar]] = {
    lugares.filter(_.nombre === nombre).result.headOption
  }
  
  def crearLugar(d: DatosCrearLugar): DBIO[Lugar] = {
    for{
      uOp <- _findLugar(d.nombre)
      _   <- uOp match{
        case Some(u) => DBIO.failed(new Exception(s"Ya existe lugar con nombre: ${d.nombre}"))
        case None    => DBIO.successful("")
      }
      u   <- _crearLugar(d)
    }yield(u)
  }
  
  def _crearLugar(d: DatosCrearLugar): DBIO[Lugar] = {
    val l = Lugar(0,d.nombre,d.latitud,d.longitud)
    for{
      new_id <- lugares returning lugares.map(_.id) += l
      l1  <- new_id match{
        case n if(n > 0) => DBIO.successful(l.copy(id = new_id))
        case _ => DBIO.failed(new Exception(s"No se pudo insertar el lugar"))
      }
    }yield(l1)
  }
  
  def borrarLugar(nombre: String) = {
    for{
      lOp <- _findLugar(nombre)
      l   <- lOp match{
        case None => DBIO.failed(new Exception(s"No existe lugar con nombre: $nombre"))
        case Some(l) => DBIO.successful(l) 
      }
      _   <- _borrarLugar(l)
    }yield("Se borro el lugar")
  }
  
  def _borrarLugar(l:Lugar) = {
    for{
      r <- lugares.filter(_.nombre === l.nombre).delete
      _ <- r match{
        case 1 => DBIO.successful("")
        case _ => DBIO.failed(new Exception(""))
      }
    }yield(r)
  }
}