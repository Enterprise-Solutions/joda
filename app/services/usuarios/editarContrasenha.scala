package services.usuarios

import play.api.db.slick.{DatabaseConfigProvider,HasDatabaseConfigProvider}
import javax.inject.{Inject,Named}
import scala.concurrent.{ExecutionContext,Future}
import slick.driver.PostgresDriver
import modelos.UsuarioT
import modelos.Usuario
import modelos.DatosEditarContrasenha
import modelos.edicionContrasenha

class EditarContrasenha @Inject() (editar: EditarUsuario, protected val dbConfigProvider: DatabaseConfigProvider, implicit val ec: ExecutionContext) extends HasDatabaseConfigProvider[PostgresDriver] {
  import driver.api._
  val usuarios = TableQuery[UsuarioT]
  
   def editarContrasenha(d: DatosEditarContrasenha): Future[edicionContrasenha] = {
      db.run(_editarContrasenha(d).transactionally) recover{
        case e: Exception => 
          edicionContrasenha(true,Some(s"Error al editar datos del usuario, ${e.getMessage}"), None)
      }
    }
    
    def _editarContrasenha (d: DatosEditarContrasenha): DBIO[edicionContrasenha] = {
       for{
          u <- editar.revisaUsuario(d.uid) // si el usuario no existe retorna un Failure.
          _ <- revisaContrasenha(u, d)
          up <- _updateContrasenha(d)
        }yield(edicionContrasenha(false,None,Some(s"Contrasena de usuario ${d.uid} actualizada correctamente")))
    }
    
    def _updateContrasenha(d: DatosEditarContrasenha) = {
      for {      
        r <- usuarios.filter(_.uid === d.uid)
                     .map(p => (p.password))
                     .update((d.contrasenha_nueva))
        _ <- r match{
          case 1 => DBIO.successful("")
          case _ => DBIO.failed(new Exception("Error al actualizar contrasena de usuario"))
        }
       }yield()
    }  
    
    def revisaContrasenha(u: Usuario, d: DatosEditarContrasenha) = {
           
      for {
        c1 <- d.contrasenha_actual.map{ cv =>
          (cv == u.password) match{
            case true => DBIO.successful("")
            case false => DBIO.failed(new Exception("Las contrasena actual no es válida"))
          }
        }.getOrElse(DBIO.successful(""))
        c2 <- (d.confirmacion_contrasenha_nueva == d.contrasenha_nueva) match{
            case true => DBIO.successful("")
            case false => DBIO.failed(new Exception("La confirmación no coincide con la nueva contrasena"))
          }
      }yield()
      
      /*Si utilizamos solo sentencias IF el metodo deberia estar encapsulado dentro de un DBIO
      Por ejemplo: _ <- DBIO.successful(revisaContrasenha(u, d))
      Esto porque el metodo revisaContrasenha si bien no opera con la BD está dentro del for donde
      se mezcla con los otros metodos del entorno DBIO*/
      
      /*if (d.confirmacion_contrasenha_nueva != d.contrasenha_nueva){
        throw new Exception("La confirmación no coincide con la contraseña elegida")
      }
      
      d.contrasenha_actual.map{ cv =>
        if(cv != u.password)
          throw new Exception("Las contraseñas no son iguales")
      }*/
    }  
   
}
