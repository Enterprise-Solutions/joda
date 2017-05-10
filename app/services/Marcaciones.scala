package services

import play.api.db.slick.{DatabaseConfigProvider,HasDatabaseConfigProvider}
import javax.inject.{Inject,Named}
import scala.concurrent.{ExecutionContext,Future}
import slick.driver.PostgresDriver
import modelos.Marcacion
import modelos.MarcacionT
import modelos.LugarT
import modelos.Lugar
import modelos.Usuario
import modelos.UsuarioT
import modelos.DatosListadoMarcaciones
import modelos.DatosCrearMarcacion
import java.sql.Timestamp
//import com.github.maxpsq.googlemaps._


class Marcaciones @Inject() (protected val dbConfigProvider: DatabaseConfigProvider, implicit val ec: ExecutionContext) extends HasDatabaseConfigProvider[PostgresDriver] {
  import driver.api._
  val marcaciones = TableQuery[MarcacionT]
  val usuarios = TableQuery[UsuarioT]
  val lugares = TableQuery[LugarT]
  
 /* def Marcaciones() {
    this.dbConfigProvider = dbConfigProvider
    this.ec = ec
}*///Constructor?...
 //object Marcaciones{ //tira problemas con db y DBIO data type...
  
  /*def nuevaMarcacion(d:DatosCrearMarcacion):Future[Marcacion] = {
    db.run(
        crearNuevaMarcacion(d).transactionally)
  }
  
  def crearNuevaMarcacion(d:DatosCrearMarcacion): DBIO[Marcacion] = {
    
  }*/
  
  def borrarlasmarcaciones(usuario_id: Long):Future[String] = {
    db.run(
        borrarMarcacion(usuario_id).transactionally
    )
  }
  
  def borrarMarcacion(usuario_id: Long) = {
    for{
      uOp <- _findMarcacion(usuario_id)
      u   <- uOp match{
        case n if (n.length == 0) => DBIO.failed(new Exception(s"No existe el usuario con user_id: $usuario_id"))
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
   
   def listadoMarcaciones(): Future[Seq[(String,String)]]={
     db.run(listadoijMarcaciones())
   }
   
   def listadoijMarcaciones():DBIO[Seq[(String,String)]] = {
     (for{
       (uNombre,lNombre) <- ((marcaciones join usuarios on (_.usuario_id === _.id)) join lugares on (_._1.lugar_id === _.id)).map{case ((marks,users),places) => (users.nombre,places.nombre)} 
     }yield(uNombre,lNombre)).result
   }
   
}



