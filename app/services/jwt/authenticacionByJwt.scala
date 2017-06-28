package services.jwt

import io.really.jwt._
import pdi.jwt.{Jwt, JwtAlgorithm, JwtHeader, JwtClaim, JwtOptions}
import java.util.Calendar
import java.sql.Timestamp
import java.text.SimpleDateFormat

object authenticacionByJwt extends App {
  
  def esValido(token:String, key:String):Boolean = {
    Jwt.isValid(token, key, Seq(JwtAlgorithm.HS256))
  }
  
  def newToken(user:String,password:String, key:String):String = {
    val formatOfTimestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
    val now = (Calendar.getInstance().getTime()).getTime()
    val nowTimestamp = new Timestamp(now)
    Jwt.encode(s"""{"user":$user,"password":$password, "Timestamp":$nowTimestamp}""",key, JwtAlgorithm.HS256)
  }
  
}