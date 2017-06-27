package services.lugares

import play.api.db.slick.{DatabaseConfigProvider,HasDatabaseConfigProvider}
import javax.inject.{Inject,Named}
import scala.concurrent.{ExecutionContext,Future}
import slick.driver.PostgresDriver
import modelos.LugarT
import modelos.Lugar
import modelos.DatosNuevoLugar
import modelos.nuevoLugar

class CrearLugar @Inject() (protected val dbConfigProvider: DatabaseConfigProvider, implicit val ec: ExecutionContext) extends HasDatabaseConfigProvider[PostgresDriver] {
  import driver.api._
  val lugares = TableQuery[LugarT]
  
   def crearLugar(d: DatosNuevoLugar): Future[nuevoLugar] = {
      db.run(_crearLugar(d).transactionally) recover{
        case e: Exception => 
          nuevoLugar(true,Some(s"Error al crear el lugar, ${e.getMessage}"), None)
      }
    }
    
    def _crearLugar (d: DatosNuevoLugar): DBIO[nuevoLugar] = {
       for{
          l <- _insertarNuevoLugar(d)
        }yield(nuevoLugar(false,None,Some(l)))
    }
        
    def _insertarNuevoLugar(d: DatosNuevoLugar): DBIO[Lugar] = {
      
      val l = Lugar(0, d.nombre, "1", d.latitud.toDouble, d.longitud.toDouble, d.es_beacon, d.direccion, d.cliente_id)
      for{
        new_id <- lugares returning lugares.map(_.id_lugar) += l
        l1  <- new_id match{
          case n if(n > 0) => DBIO.successful(l.copy(id_lugar = new_id))
          case _ => DBIO.failed(new Exception(s"No se pudo insertar el lugar"))
        }
      }yield(l1)
  } 
}
