package services.usuarios

import play.api.db.slick.{DatabaseConfigProvider,HasDatabaseConfigProvider}
import javax.inject.{Inject,Named}
import scala.concurrent.{ExecutionContext,Future}
import slick.driver.PostgresDriver
import modelos.UsuarioT
import modelos.Usuario
import modelos.DatosNuevoUsuario
import modelos.nuevoUsuario

class CrearUsuario @Inject() (protected val dbConfigProvider: DatabaseConfigProvider, implicit val ec: ExecutionContext) extends HasDatabaseConfigProvider[PostgresDriver] {
  import driver.api._
  val usuarios = TableQuery[UsuarioT]
  
   def crearUsuario(d: DatosNuevoUsuario): Future[nuevoUsuario] = {
      db.run(_crearUsuario(d).transactionally) recover{
        case e: Exception => 
          nuevoUsuario(true,Some(s"Error al crear el usuario, ${e.getMessage}"), None)
      }
    }
    
    def _crearUsuario (d: DatosNuevoUsuario): DBIO[nuevoUsuario] = {
       for{
          _ <- buscarUsuario(d.documento) // Si el usuario ya existe retorna un Failure.
          u <- _insertarNuevoUsuario(d)
        }yield(nuevoUsuario(false,None,Some(u)))
    }
        
    def _insertarNuevoUsuario(d: DatosNuevoUsuario): DBIO[Usuario] = {
    val u = Usuario(0,d.nombre, d.apellido,d.documento,Some(d.email), d.usuario, d.password, "1", d.activo, d.web_login,d.empresa_id,null,d.rol)
    for{
      new_id <- usuarios returning usuarios.map(_.id_usuario) += u
      u1  <- new_id match{
        case n if(n > 0) => DBIO.successful(u.copy(id_usuario = new_id))
        case _ => DBIO.failed(new Exception(s"No se pudo insertar el usuario"))
      }
    }yield(u1)
  }
        
  def buscarUsuario(documento: String) = {
    for {
        us <- usuarios.filter(_.documento === documento).result
        _ <- us.length match {
          case 0 => DBIO.successful("")
          case n if (n > 0) => DBIO.failed(new Exception(s"Ya existe usuario con documento ${documento}"))
          case _ => DBIO.failed(new Exception("Problemas al consultar con la base de datos"))
        }
      }yield()
  }   
}
