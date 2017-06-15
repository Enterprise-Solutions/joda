package services.usuarios

import play.api.db.slick.{DatabaseConfigProvider,HasDatabaseConfigProvider}
import javax.inject.{Inject,Named}
import scala.concurrent.{ExecutionContext,Future}
import slick.driver.PostgresDriver
import modelos.UsuarioT
import modelos.LoginUser
import modelos.user_data
import modelos.DatosLoginUser
import modelos.Usuario
import modelos.listadoUsuarios
import java.sql.Date

class Listar @Inject() (protected val dbConfigProvider: DatabaseConfigProvider, implicit val ec: ExecutionContext) extends HasDatabaseConfigProvider[PostgresDriver] {
  import driver.api._
  val usuarios = TableQuery[UsuarioT]
  
  
  /*Métodos para permitir la búsqueda mediante filtro de email*/
  def listarU(email: Option[String]) : Future[listadoUsuarios] = {
    db.run(listarUsuarios(email)) recover{
      case e: Exception => listadoUsuarios(true,Some(e.getMessage),None)   
    }
  }
   
   def listarUsuarios(email: Option[String]) = {    
    for{
      r <- email.map { e =>
             usuarios.filter(_.email === email).result
           }.getOrElse(usuarios.result)
      _ <- r.length match{
        case n if(n > 0) => DBIO.successful("")
        case 0 => DBIO.failed(new Exception("No existen usuarios para mostrar"))
        case _ => DBIO.failed(new Exception("Problema al buscar los usuarios!"))
      }
    }yield(listadoUsuarios(false,None,Some(r))) 
  }
   
   /*Métodos para permitir la búsqueda en varios campos a la vez*/ 
   def listarBusq(busqueda: Option[String], pagina: Option[Int], cantidad: Option[Int]) : Future[listadoUsuarios] = {
    db.run(listarUsuariosBusq(busqueda, pagina, cantidad)) recover{
      case e: Exception => listadoUsuarios(true,Some(e.getMessage),None)   
    }
  }
   
   def listarUsuariosBusq(busqueda: Option[String], pagina: Option[Int] = Some(0), cantidad: Option[Int] = Some(10)) = {        
     
     val q = usuarios
     
     val q1 = busqueda.map{ b =>
             q.filter(u => u.email like s"${b}%")
           }.getOrElse(q)
     
     val p = pagina.getOrElse(0)
     val c = cantidad.getOrElse(10)
     val q11 = q1.sortBy(_.nombre.asc)
     val q2 = q11.drop(p*c).take(c)
     val qtotal = q1.length
     
     for{
       r <- q2.result
       t <- qtotal.result
       _ <- r.length match{
        case n if(n > 0) => DBIO.successful("")
        case 0 => DBIO.failed(new Exception("No existen usuarios para mostrar"))
        case _ => DBIO.failed(new Exception("Problema al buscar los usuarios!"))
      }
     }yield(listadoUsuarios(false,None,Some(r))) 
  }  
}