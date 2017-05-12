package services

import play.api.db.slick.{DatabaseConfigProvider,HasDatabaseConfigProvider}
import javax.inject.{Inject,Named}
import scala.concurrent.{ExecutionContext,Future}
import slick.driver.PostgresDriver
import modelos.UsuarioT
import modelos.Usuario
import modelos.MarcacionT
import modelos.Marcacion
import modelos.MarcacionR
import modelos.DatosCrearUsuario
import modelos.DatosActualizarUsuario
import modelos.DatosResumenDiaTrabajado
import java.sql.Timestamp
import java.util.Date
import org.joda.time._
import java.text.SimpleDateFormat
import scala.math._


//import services.Marcaciones

class Usuarios @Inject() (val marc: Marcaciones, protected val dbConfigProvider: DatabaseConfigProvider, implicit val ec: ExecutionContext) extends HasDatabaseConfigProvider[PostgresDriver] {
  import driver.api._
  val usuarios = TableQuery[UsuarioT]
  val marcaciones = TableQuery[MarcacionT]
  //@Inject() var a: Marcaciones = null
  //val marcaciones = TableQuery[MarcacionT]
  //var marcaciones = new Marcaciones()
  
  def apply() = {
    db.run(_action)
  }
  
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
  
  /*
   * editar...
   */
  
  def editarUser(d: DatosActualizarUsuario): Future[String] = {
    db.run(editarUsuario(d).transactionally)
  }
  
  def editarUsuario(d: DatosActualizarUsuario): DBIO[String] = {
    for{
      uOp <- _findUsuario(d.email)
      _   <- uOp match{
        case None => DBIO.failed(new Exception(s"No existe usuario con email: ${d.email}"))
        case Some(u)   => DBIO.successful("")
      }
      u   <- _editarUsuario(d)
      m <- u match{
        case 1 => DBIO.successful("Cambio exitoso de nombre!!")
        case _ => DBIO.failed(new Exception(s"No se pudo cambiar el nombre del usuario con email: ${d.email}"))
      }
    }yield(m)
  }
    
  def _editarUsuario(d: DatosActualizarUsuario) = {
    /*val u = Usuario(0,d.email,d.apellido,d.nombre,d.password)
    for{
      new_id <- usuarios returning usuarios.map(_.id) += u
      u1  <- new_id match{
        case n if(n > 0) => DBIO.successful(u.copy(id = new_id))
        case _ => DBIO.failed(new Exception(s"No se pudo insertar el usuario"))
      }
    }yield(u1)
    */
      (for{
      u <- usuarios.filter(_.email === d.email)
      }yield(u.nombre)).update(d.nombre)
  }
  /*
   * editar...
   */
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
    print ("Desde borrarUsuario \n")
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
      m <- marc.borrarMarcacion(u.id)// Retorna DBIO action...
      /*
      eliminar todas las marcaciones del usuario para poder realmente borrarlo...
      y si no tiene marcaciones????*/
      r <- usuarios.filter(_.email === u.email).delete
      _ <- r match{
        case 1 => DBIO.successful("")
        case _ => DBIO.failed(new Exception(""))
      }
    }yield(r)
  }
  
   def trabajadoUser(email: String, fecha: Timestamp): Future[Seq[DatosResumenDiaTrabajado]]={
     db.run(_trabajadoUser(email,fecha))
   }
   
   def _trabajadoUser(email:String, fecha: Timestamp):DBIO[Seq[DatosResumenDiaTrabajado]]={
     val formatOfDate = new SimpleDateFormat("dd-MM-yyyy")
     val query = sql"""
          WITH diffs as (
          SELECT
                  u.email,
                  fecha::DATE,
                  fecha - lag(fecha) over (partition BY u.email ORDER BY fecha) as difference,
                  row_number() over (partition BY u.email) as session
          FROM
          	marcaciones m
          	join usuarios u on (m.usuario_id = u.id)
          WHERE  	
          	fecha::DATE = $fecha
            AND u.email = $email
          GROUP BY u.email,m.fecha
          )
          SELECT
          	email,fecha::DATE,
          	extract(hour from SUM(difference)),
          	extract(minutes from SUM(difference)),
          	extract(seconds from SUM(difference))
          FROM
              diffs
          WHERE (session %2 = 0)
          GROUP BY diffs.email,diffs.fecha;
      """
     for{
        r <- query.as[(String,Timestamp,Double,Double,Double)]
        r1 <- DBIO.successful{
          r map { case (email,fechaD,horas,minutos,segundos) =>
            DatosResumenDiaTrabajado(email,formatOfDate.format(fechaD),abs(horas),abs(minutos),abs(segundos))
          }
        }
     }yield(r1)
   }
}