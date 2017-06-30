package services.usuarios

import play.api.db.slick.{DatabaseConfigProvider,HasDatabaseConfigProvider}
import javax.inject.{Inject,Named}
import scala.concurrent.{ExecutionContext,Future}
import slick.driver.PostgresDriver
import modelos.UsuarioT
import modelos.LogoutUser
import modelos.DatosLogoutUser
import java.sql.Date
import play.api.libs.json._
import services.jwt.authenticacionByJwt


class Logout @Inject() (jwt: authenticacionByJwt, protected val dbConfigProvider: DatabaseConfigProvider, implicit val ec: ExecutionContext) extends HasDatabaseConfigProvider[PostgresDriver] {
  import driver.api._
  val usuarios = TableQuery[UsuarioT]
  
  def logoutU(d: DatosLogoutUser): Future[LogoutUser] = {
    db.run(logoutUser(d).transactionally).recover {
      case e => LogoutUser(true,Some("Usuario no existe"),None) 
    }
  }
         
   def logoutUser(d: DatosLogoutUser): DBIO[LogoutUser] = {
    val user = d.usuario
    val query = sql"""
      SELECT uid
      FROM usuarios 
      WHERE usuario = $user;
      """
     for{
        rOp <- query.as[(String)].headOption
        (uid) <- DBIO.successful(rOp.getOrElse(throw new Exception("Usuario no valido!")))
        jwtToken <- jwt.newToken(uid, user, "secretKey", "secretKey", "secretKey", "secretKey")            
     }yield(LogoutUser(false,None,Some("Sesión finalizada exitosamente")))
  }
}