package services.usuarios

import play.api.db.slick.{DatabaseConfigProvider,HasDatabaseConfigProvider}
import javax.inject.{Inject,Named}
import scala.concurrent.{ExecutionContext,Future}
import slick.driver.PostgresDriver
import modelos.UsuarioT
import modelos.LoginUser
import modelos.Usuario
import modelos.user_data
import modelos.DatosLoginUser
import java.sql.Date
import play.api.libs.json._
import services.jwt.TokenDB


class Login @Inject() (token: TokenDB, protected val dbConfigProvider: DatabaseConfigProvider, implicit val ec: ExecutionContext) extends HasDatabaseConfigProvider[PostgresDriver] {
  import driver.api._
  val usuarios = TableQuery[UsuarioT]
  
  def loginU(d: DatosLoginUser): Future[LoginUser] = {
    db.run(loginUser(d).transactionally).recover {
      case e => LoginUser(true,Some("Usuario o contraseña incorrecta"),None,None,None, None) 
    }
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
        rOp <- query.as[(String,String,String)].headOption
        (uid,nombre,email) <- DBIO.successful(rOp.getOrElse(throw new Exception("Usuario no valido!")))
        jwt <- token.newToken(uid, user, password, "secretKey")        
     }yield(LoginUser(false,None,Some(uid),Some(jwt),Some(user_data(nombre,email)), None))
  }
}