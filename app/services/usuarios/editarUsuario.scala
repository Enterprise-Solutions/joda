package services.usuarios

import play.api.db.slick.{DatabaseConfigProvider,HasDatabaseConfigProvider}
import javax.inject.{Inject,Named}
import scala.concurrent.{ExecutionContext,Future}
import slick.driver.PostgresDriver
import modelos.UsuarioT
import modelos.Usuario
import modelos.DatosEditarUsuario
import modelos.edicionUsuario


class EditarUsuario @Inject() (protected val dbConfigProvider: DatabaseConfigProvider, implicit val ec: ExecutionContext) extends HasDatabaseConfigProvider[PostgresDriver] {
  import driver.api._
  val usuarios = TableQuery[UsuarioT]
  
   def editarUsuario(d: DatosEditarUsuario): Future[edicionUsuario] = {
      db.run(_editarUsuario(d).transactionally) recover{
        case e: Exception => 
          edicionUsuario(true,Some(s"Error al editar datos del usuario, ${e.getMessage}"), None)
      }
    }
    
    def _editarUsuario (d: DatosEditarUsuario): DBIO[edicionUsuario] = {
       for{
          u <- revisaUsuario(d) // si el usuario no existe retorna un Failure.
          up <- _updateMarcacion(d)
        }yield(edicionUsuario(false,None,Some(up)))
    }
    
    def _updateMarcacion(d: DatosEditarUsuario): DBIO[Usuario] = {
      for {      
        _ <- usuarios.filter(_.uid === d.uid)
       .map(p => (p.nombre,p.apellido, p.documento, p.email, p.usuario, p.activo, p.web_login))
       .update((d.nombre,d.apellido, d.documento, Some(d.email), d.usuario, d.activo, d.web_login))
       u <- usuarios.filter(_.uid === d.uid).result
       u1 <- u.length match {
          case n if (n > 0) => DBIO.successful(u.head)
          case 0 => DBIO.failed(new Exception(s"No existe usuario con uid ${d.uid}"))
          case _ => DBIO.failed(new Exception("Problemas al consultar con la base de datos"))
        }
       }yield(u1)
    }  
    
    def revisaUsuario(d: DatosEditarUsuario) = {
      for {
        us <- usuarios.filter(_.uid === d.uid).result
        l <- us.length match {
          case n if (n > 0) => DBIO.successful("")
          case 0 => DBIO.failed(new Exception(s"No existe el usuario con uid ${d.uid}"))
          case _ => DBIO.failed(new Exception("Problemas al consultar con la base de datos"))
        }
      }yield()
      
    }
    
   
}
