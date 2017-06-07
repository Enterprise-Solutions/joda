package services

import play.api.db.slick.{DatabaseConfigProvider,HasDatabaseConfigProvider}
import javax.inject.{Inject,Named}
import scala.concurrent.{ExecutionContext,Future}
import slick.driver.PostgresDriver
import modelos.UsuarioT
import modelos.LoginUser
import modelos.user_data
import modelos.DatosLoginUser
import java.sql.Date

class Login @Inject() (protected val dbConfigProvider: DatabaseConfigProvider, implicit val ec: ExecutionContext) extends HasDatabaseConfigProvider[PostgresDriver] {
  import driver.api._
  val usuarios = TableQuery[UsuarioT]
  
  def loginU(d: DatosLoginUser): Future[LoginUser] = {
    db.run(loginUser(d).transactionally)
  }
    
   def loginUsuario(user:String, password: String):DBIO[LoginUser]={
     val query = sql"""
      SELECT uid, nombre, email
      FROM usuarios 
      WHERE usuario = $user AND 
       password = $password;
      """
     for{
        r <- query.as[(String,String,String)]
        r1 <- DBIO.successful{r.toSeq.headOption}
        r2 <- DBIO.successful{
          r1 match { case Some((uid,nombre,email)) =>
            LoginUser(false,None,Some(uid),Some(user_data(nombre,email)))
          case None =>
            LoginUser(true,Some("Usuario o contraseña incorrecta"),None,None)
          }
        }
     }yield(r2)
   }
     
   def loginUser(d: DatosLoginUser): DBIO[LoginUser] = {
    val user = d.usuario
    val password = d.password
    val query = sql"""
      SELECT uid, nombre, email
      FROM usuarios 
      WHERE usuario = $user AND 
       password = $password;
      """
     for{
        r <- query.as[(String,String,String)]
        r1 <- DBIO.successful{r.toSeq.headOption}
        r2 <- DBIO.successful{
          r1 match { case Some((uid,nombre,email)) =>
            LoginUser(false,None,Some(uid),Some(user_data(nombre,email)))
          case None =>
            LoginUser(true,Some("Usuario o contraseña incorrecta"),None,None)
          }
        }
     }yield(r2)
  }
  
  def login(usuario: String, password: String): Future[LoginUser]={
     db.run(loginUsuario(usuario,password))
  }
  
}