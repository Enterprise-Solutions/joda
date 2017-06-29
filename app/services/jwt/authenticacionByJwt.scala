package services.jwt

import io.really.jwt._
import pdi.jwt.{Jwt, JwtAlgorithm, JwtHeader, JwtClaim, JwtOptions}
import java.util.Calendar
import java.sql.Timestamp
import java.text.SimpleDateFormat
import modelos.UsuarioT
import play.api.db.slick.{DatabaseConfigProvider,HasDatabaseConfigProvider}
import play.api.libs.json._
import javax.inject.{Inject,Named}
import scala.concurrent.{ExecutionContext,Future}
import slick.driver.PostgresDriver
import java.sql.Date

/*object authenticacionByJwt extends App {
 
  def esValido(token:String, key:String):Boolean = {
    Jwt.isValid(token, key, Seq(JwtAlgorithm.HS256))
  }
  
  def newToken(uid: String, user:String,password:String, key:String):String = {
    val formatOfTimestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
    val now = (Calendar.getInstance().getTime()).getTime()
    val nowTimestamp = new Timestamp(now)
    Jwt.encode(s"""{"user":$user,"password":$password, "Timestamp":$nowTimestamp}""",key, JwtAlgorithm.HS256)
  } 
}*/

class TokenDB @Inject() (protected val dbConfigProvider: DatabaseConfigProvider, implicit val ec: ExecutionContext) extends HasDatabaseConfigProvider[PostgresDriver] {
  import driver.api._
  val usuarios = TableQuery[UsuarioT]
  
  def esValido(token:String, key:String): Future[Boolean] = {
    db.run(for {
      j <- DBIO.successful(Jwt.isValid(token, key, Seq(JwtAlgorithm.HS256)))
      r <- j match{
        case true => buscarToken(token)
        case _ => DBIO.successful(false)
      }
    }yield(r))
  }
  
  def newToken(uid: String, user:String,password:String, key:String): DBIO[String] = {
    val formatOfTimestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
    val now = (Calendar.getInstance().getTime()).getTime()
    val nowTimestamp = new Timestamp(now)
    val jwt = Jwt.encode(s"""{"user":$user,"password":$password, "Timestamp":$nowTimestamp}""",key, JwtAlgorithm.HS256)
    for {
     _ <- insertToken(uid,jwt) 
    }yield(jwt)
  } 
  
  def insertToken(uid: String, jwt: String) = {
      for{
         u  <- usuarios.filter(_.uid === uid)
               .map(n => (n.token))
               .update((Some(jwt)))
         _  <- u match {
               case 1 => DBIO.successful("")
               case _ => DBIO.failed(new Exception  ("Error al editar usuario"))
             }
      }yield(jwt)
    } 
  
   def buscarToken(token: String): DBIO[Boolean] = {
    for {
        us <- usuarios.filter(_.token === token).result
        b <- us.length match {
          case n if (n > 0) => DBIO.successful(true)
          case _ => DBIO.successful(false)
        }
      }yield(b)
  } 
}
