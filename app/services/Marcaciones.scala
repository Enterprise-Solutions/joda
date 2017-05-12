package services

import play.api.db.slick.{DatabaseConfigProvider,HasDatabaseConfigProvider}
import javax.inject.{Inject,Named}
import scala.concurrent.{ExecutionContext,Future}
import slick.driver.PostgresDriver
import modelos.Marcacion
import modelos.MarcacionR
import modelos.ListadoMarcaciones
import modelos.MarcacionT
import modelos.MarcacionRT
import modelos.LugarT
import modelos.Lugar
import modelos.Usuario
import modelos.UsuarioT
import modelos.DatosListadoMarcaciones
import modelos.DatosCrearMarcacion
import java.sql.Timestamp
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Calendar


class Marcaciones @Inject() (protected val dbConfigProvider: DatabaseConfigProvider, implicit val ec: ExecutionContext) extends HasDatabaseConfigProvider[PostgresDriver] {
  import driver.api._
  val marcaciones = TableQuery[MarcacionT]
  val marcacionesr = TableQuery[MarcacionRT]
  val usuarios = TableQuery[UsuarioT]
  val lugares = TableQuery[LugarT]

  
    def crear(d: DatosCrearMarcacion): Future[Marcacion] = {
      db.run(_crearMarcacion(d).transactionally)
  }
  
//    def crearMarcacion(d: DatosCrearMarcacion): DBIO[Marcacion] = {
//    for{
//      uOp <- _findMarcacion(d.id)
//      _   <- uOp match{
//        case Some(u) => DBIO.failed(new Exception(""))
//        case None    => DBIO.successful("")
//      }
//      u   <- _crearMarcacion(d)
//    }yield(u)
//  }
    
    def _crearMarcacion(d: DatosCrearMarcacion): DBIO[Marcacion] = {
      val dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
      val today = dateFormat.format(Calendar.getInstance().getTime());
      val m = Marcacion(0,d.usuario_id,d.lugar_id, new Timestamp(dateFormat.parse(today).getTime()))
      for{
        new_id <- marcaciones returning marcaciones.map(_.id) += m
        m1  <- new_id match{
          case n if(n > 0) => DBIO.successful(m.copy(id = new_id))
          case _ => DBIO.failed(new Exception(s"No se pudo insertar la marcacion"))
        }
      }yield(m1)
  }
  
    def apply() = {
    db.run(_action)
  }
  
    def _action: DBIO[Seq[MarcacionR]] = {
    marcacionesr.result
  }
  
  def borrarlasmarcaciones(usuario_id: Long):Future[String] = {
    db.run(
        borrarMarcacion(usuario_id).transactionally
    )
  }
  
  def borrarMarcacion(usuario_id: Long) = {
    for{
      uOp <- _findMarcacion(usuario_id)
      u   <- uOp match{
        case n if (n.length == 0) => DBIO.successful("")
        case _ => _borrarMarcaciones(usuario_id) 
      }
      //_   <- _borrarMarcaciones(usuario_id)
    }yield("Se borraron las marcaciones del usuario")
  }
    
   def _findMarcacion(usuario_id: Long): DBIO[Seq[Marcacion]] = {
     marcaciones.filter(_.usuario_id === usuario_id).result
  }
   
   def _borrarMarcaciones(u: Long) = {
     for{
        r <- marcaciones.filter(_.usuario_id === u).delete
        _ <- r match{
           case n if (n >= 1) => DBIO.successful(n)
           case _ => DBIO.failed(new Exception(""))
        }
     }yield(r)
    }
   
   def listadoMarcaciones(): Future[Seq[ListadoMarcaciones]]={
     db.run(listadoijMarcaciones())
   }
   
   
   
   def listadoijMarcaciones():DBIO[Seq[ListadoMarcaciones]] = {
      val formatOfDate = new SimpleDateFormat("dd-MM-yyyy")
      val formatOfHour = new SimpleDateFormat("HH:mm:ss");
      val query = sql""" SELECT
                u.nombre,
                u.apellido,
                u.email,
                m.fecha::DATE,
                COUNT(m),
                max(fecha),
                min(fecha)
          FROM
          	marcaciones m
          	join usuarios u on (m.usuario_id = u.id)
          GROUP BY u.id, fecha::DATE;"""
     for{
        r <- query.as[(String,String,String,Timestamp,Int,Timestamp,Timestamp)]
        r1 <- DBIO.successful{
          r map { case (nombre,apellido,email,fecha,cantidad,maxd,mind) =>
            ListadoMarcaciones(nombre,apellido,email,formatOfDate.format(fecha),cantidad,formatOfHour.format(maxd),formatOfHour.format(mind))
          }
        }
     }yield(r1)
   }
   
}



