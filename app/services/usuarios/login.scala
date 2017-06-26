package services.usuarios

import play.api.db.slick.{DatabaseConfigProvider,HasDatabaseConfigProvider}
import javax.inject.{Inject,Named}
import scala.concurrent.{ExecutionContext,Future}
import slick.driver.PostgresDriver
import modelos.UsuarioT
import modelos.LoginUser
import modelos.user_data
import modelos.DatosLoginUser
import java.sql.Date
import play.api.libs.json._
import io.really.jwt._
import pdi.jwt.{Jwt, JwtAlgorithm, JwtHeader, JwtClaim, JwtOptions}



class Login @Inject() (protected val dbConfigProvider: DatabaseConfigProvider, implicit val ec: ExecutionContext) extends HasDatabaseConfigProvider[PostgresDriver] {
  import driver.api._
  val usuarios = TableQuery[UsuarioT]
  
  def loginU(d: DatosLoginUser): Future[LoginUser] = {
    db.run(loginUser(d).transactionally)
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
          r1 match { case Some((uid,nombre,email)) =>//existe el usuario... CORRECTO!
            // Aca deberia tirar el JWT.
            val jwt = Jwt.encode(s"""{"user":$user,"password":$password}""", "secretKey", JwtAlgorithm.HS256)
            LoginUser(false,None,Some(uid),Some(jwt),Some(user_data(nombre,email)))
          case None =>
            LoginUser(true,Some("Usuario o contraseña incorrecta"),None,None,None)
          }
        }
     }yield(r2)
  }
  
}