package services.lugares

import play.api.db.slick.{DatabaseConfigProvider,HasDatabaseConfigProvider}
import javax.inject.{Inject,Named}
import scala.concurrent.{ExecutionContext,Future}
import slick.driver.PostgresDriver
import modelos.LugarT
import modelos.Lugar
import modelos.listadoLugares
import modelos.listaLugares


class listarLugar @Inject() (protected val dbConfigProvider: DatabaseConfigProvider, implicit val ec: ExecutionContext) extends HasDatabaseConfigProvider[PostgresDriver] {
  import driver.api._
  val lugares = TableQuery[LugarT]
  
  
   def mostrarLugares(busqueda: Option[String], pagina: Option[Int], cantidad: Option[Int], ordenarPor: Option[String], direccionOrd: Option[String]): Future[listadoLugares] = {
      db.run(traerLugares(busqueda, pagina, cantidad, ordenarPor, direccionOrd))recover{
      case e: Exception => listadoLugares(true,Some(e.getMessage),None, None)   
      }
   }
  
  def traerLugares(busqueda: Option[String], pagina: Option[Int], cantidad: Option[Int], ordenarPor: Option[String], direccionOrd: Option[String]) = {
    
     val q = lugares
     val p = pagina.getOrElse(0)
     val c = cantidad.getOrElse(10)
     
     val ilike = SimpleBinaryOperator[Boolean]("ilike")
     
     val q1 = busqueda.map{ b =>
             q.filter(l => ilike(l.nombre, s"%${b}%") || ilike(l.direccion, s"%${b}%"))
           }.getOrElse(q)
     
    //ORDENAMIENTO
     val order = (ordenarPor.getOrElse("nombre"), direccionOrd.getOrElse("asc"))
     
     val q2 = order match {
       case ("nombre", "asc")      => q1.sortBy(_.nombre.asc)
       case ("direccion", "asc")   => q1.sortBy(_.direccion.asc)
       case ("nombre", "desc")     => q1.sortBy(_.nombre.desc)
       case ("direccion", "desc")  => q1.sortBy(_.direccion.desc)
       case _                      => q1
     }
     
     //PAGINACIÓN
     val q3 = q2.drop(p*c).take(c)
     val qtotal = q1.length
    
    for{
      ls <- q3.result
      t <- qtotal.result
      r <- DBIO.successful(ls map{ l => new listaLugares(l.id_lugar,l.nombre,l.direccion)})
      _ <- r.length match{
        case n if(n > 0) => DBIO.successful("")
        case 0 => DBIO.failed(new Exception("No tiene lugares asignados"))
        case _ => DBIO.failed(new Exception("Problema al buscar lugares!"))
      }
    }yield(listadoLugares(false,None,Some(r), Some(t))) 
  }
 
}
