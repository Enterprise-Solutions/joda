package services.lugares

import play.api.db.slick.{DatabaseConfigProvider,HasDatabaseConfigProvider}
import javax.inject.{Inject,Named}
import scala.concurrent.{ExecutionContext,Future}
import slick.driver.PostgresDriver
import modelos.LugarT
import modelos.Lugar
import modelos.listaLugares


class listarLugar @Inject() (protected val dbConfigProvider: DatabaseConfigProvider, implicit val ec: ExecutionContext) extends HasDatabaseConfigProvider[PostgresDriver] {
  import driver.api._
  val lugares = TableQuery[LugarT]
  
  
   def mostrarLugares(): Future[Seq[listaLugares]] = {
      db.run(traerLugares())
    }
  
  def traerLugares():DBIO[Seq[listaLugares]] = {
    for{
      ls <- lugares.result
      r <- DBIO.successful(ls map{ l => new listaLugares(l.id_lugar,l.nombre,l.direccion)})
      _ <- r.length match{
        case n if(n > 0) => DBIO.successful("")
        case 0 => DBIO.failed(new Exception("No tiene lugares asignados"))
        case _ => DBIO.failed(new Exception("Problema al buscar lugares!"))
      }
    }yield(r)
  }
 
}
