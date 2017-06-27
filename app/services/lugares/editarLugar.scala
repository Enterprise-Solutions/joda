package services.lugares

import play.api.db.slick.{DatabaseConfigProvider,HasDatabaseConfigProvider}
import javax.inject.{Inject,Named}
import scala.concurrent.{ExecutionContext,Future}
import slick.driver.PostgresDriver
import modelos.LugarT
import modelos.DatosEditarLugar
import modelos.edicionLugar
import modelos.Lugar



class EditarLugar @Inject() (protected val dbConfigProvider: DatabaseConfigProvider, implicit val ec: ExecutionContext) extends HasDatabaseConfigProvider[PostgresDriver] {
  import driver.api._
  val lugares = TableQuery[LugarT]
  
   def editarLugar(d: DatosEditarLugar): Future[edicionLugar] = {
      db.run(_editarLugar(d).transactionally) recover{
        case e: Exception => 
          edicionLugar(true,Some(s"Error al editar datos del lugar, ${e.getMessage}"), None)
      }
    }
    
    def _editarLugar (d: DatosEditarLugar): DBIO[edicionLugar] = {
       for{
          u <- revisaLugar(d.uid) // si el lugar no existe retorna un Failure.
          up <- _updateLugar(d)
        }yield(edicionLugar(false,None,Some(up)))
    }
    
    def _updateLugar(d: DatosEditarLugar): DBIO[Lugar] = {
      for {      
        _ <- lugares.filter(_.uid === d.uid)
       .map(p => (p.nombre,p.direccion, p.latitud, p.longitud, p.es_beacon))
       .update((d.nombre,d.direccion, d.latitud.toDouble, d.longitud.toDouble, d.es_beacon))
       u <- lugares.filter(_.uid === d.uid).result
       u1 <- u.length match {
          case n if (n > 0) => DBIO.successful(u.head)
          case 0 => DBIO.failed(new Exception(s"No existe lugar con uid ${d.uid}"))
          case _ => DBIO.failed(new Exception("Problemas al consultar con la base de datos"))
        }
       }yield(u1)
    }  
    
    def revisaLugar(uid: String) : DBIO[Lugar] = {
      for {
        ls <- lugares.filter(_.uid === uid).result
        l <- ls.length match {
          case n if (n > 0) => DBIO.successful(ls.head)
          case 0 => DBIO.failed(new Exception(s"No existe el lugar con uid ${uid}"))
          case _ => DBIO.failed(new Exception("Problemas al consultar con la base de datos"))
        }
      }yield(l)
      
    }  
}
