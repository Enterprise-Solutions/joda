package services.jwt

import io.really.jwt._
import pdi.jwt.{Jwt, JwtAlgorithm, JwtHeader, JwtClaim, JwtOptions}
import java.util.Calendar
import java.sql.Timestamp
import java.text.SimpleDateFormat
import modelos.UsuarioT
import play.api.db.slick.{DatabaseConfigProvider,HasDatabaseConfigProvider}
import play.api.libs.json._
import play.api.libs.functional.syntax._
import javax.inject.{Inject,Named}
import scala.concurrent.{ExecutionContext,Future}
import scala.util.Success
import scala.util.Failure
import scala.util.Try
import slick.driver.PostgresDriver
import java.sql.Date
import modelos.DatosToken

class authenticacionByJwt @Inject() (protected val dbConfigProvider: DatabaseConfigProvider, implicit val ec: ExecutionContext) extends HasDatabaseConfigProvider[PostgresDriver] {
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
  
  def newToken(uid: String, user:String,password:String, rol:String, fuente:String, key:String): DBIO[String] = {
    val formatOfTimestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
    val now = (Calendar.getInstance().getTime()).getTime()
    val nowTimestamp = new Timestamp(now)
    val jwt = Jwt.encode(s"""{"usuario":"joaquin","uid":"$uid","rol":"$rol","timestamp":"$nowTimestamp", "fuente":"$fuente"}""",key, JwtAlgorithm.HS256)
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
   
   implicit val locationReads: Reads[DatosToken] = (
    (__ \ "usuario").read[String] and
    (JsPath \ "uid").read[String] and
    (JsPath \ "rol").read[String] and
    (JsPath \ "timestamp").read[String] and
    (JsPath \ "fuente").read[String]
    )(DatosToken.apply _)
   
  def decodificarToken(token: String): DatosToken = {
    /*Decodifica en Try[(String, String, String)] toda la estructura del token
    val t = Jwt.decodeRawAll(token, "secretKey", JwtAlgorithm.allHmac)*/
    
    //Solo decodifica el payload
    val payload = Jwt.decode(token, "secretKey", JwtAlgorithm.allHmac).get
    val json: JsValue = Json.parse(payload)
    
    /*val usuario = (json \ "usuario").get.toString()
    println(s"valor de usuario: $usuario")
    val uid = (json \ "uid").get.toString()
    val rol = (json \ "rol").get.toString()
    val timestamp = (json \ "timestamp").get.toString()
    val fuente = (json \ "fuente").get.toString()*/
    
    val datosTokenResult: DatosToken = json.as[DatosToken]
    datosTokenResult
    
  } 
   
}
