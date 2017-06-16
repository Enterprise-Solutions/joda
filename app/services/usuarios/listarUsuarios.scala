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
     
   /*Métodos para permitir la búsqueda en varios campos a la vez*/ 
   def listar(busqueda: Option[String], pagina: Option[Int], cantidad: Option[Int], ordenarPor: Option[String], direccionOrd: Option[String]) : Future[listadoUsuarios] = {
    db.run(listarUsuarios(busqueda, pagina, cantidad, ordenarPor, direccionOrd)) recover{
      case e: Exception => listadoUsuarios(true,Some(e.getMessage),None, None)   
    }
  }
   
   def listarUsuarios(busqueda: Option[String], pagina: Option[Int], cantidad: Option[Int], ordenarPor: Option[String], direccionOrd: Option[String]) = {        
     
     val q = usuarios
     val p = pagina.getOrElse(0)
     val c = cantidad.getOrElse(10)
     
     val ilike = SimpleBinaryOperator[Boolean]("ilike")
     
     val q1 = busqueda.map{ b =>
             q.filter(u => ilike(u.email, s"${b}%") || ilike(u.nombre, s"${b}%") || ilike(u.apellido, s"${b}%") || ilike(u.usuario, s"${b}%"))
           }.getOrElse(q)
     
    //ORDENAMIENTO
     val order = (ordenarPor.getOrElse("apellido"), direccionOrd.getOrElse("asc"))
     
     val q2 = order match {
       case ("nombre", "asc")      => q1.sortBy(_.nombre.asc)
       case ("apellido", "asc")    => q1.sortBy(_.apellido.asc)
       case ("email", "asc")       => q1.sortBy(_.email.asc)
       case ("usuario", "asc")     => q1.sortBy(_.usuario.asc)
       case ("nombre", "desc")     => q1.sortBy(_.nombre.desc)
       case ("apellido", "desc")   => q1.sortBy(_.apellido.desc)
       case ("email", "desc")      => q1.sortBy(_.email.desc)
       case ("usuario", "desc")    => q1.sortBy(_.usuario.desc)
       case _                      => q1
     }
     
     //PAGINACIÓN
     val q3 = q2.drop(p*c).take(c)
     val qtotal = q1.length
     
     for{
       r <- q3.result
       t <- qtotal.result
       _ <- r.length match{
        case n if(n > 0) => DBIO.successful("")
        case 0 => DBIO.failed(new Exception("No existen usuarios para mostrar"))
        case _ => DBIO.failed(new Exception("Problema al buscar los usuarios!"))
      }
     }yield(listadoUsuarios(false,None,Some(r), Some(t))) 
  }  
}