package controllers

import services.jwt.authenticacionByJwt
import javax.inject._
import play.api._
import play.api.mvc._
import scala.concurrent.ExecutionContext
import scala.concurrent.Future

class Authentication @Inject() (jwt: authenticacionByJwt, implicit val ec: ExecutionContext) extends Controller {
  
  val HEADER_STRING = "Authorization"
  val error_token = "Token incorrecto o caducado. Volver a autenticarse"
  def LoggingAction(f: Request[AnyContent] => Future[Result]): Action[AnyContent] = {
    Action.async { implicit request =>
      val token = request.headers.get(HEADER_STRING).getOrElse("")
       for{
         authBooleanVal <- jwt.esValido(token, "secretKey")
         resultMethodAnswer <- authBooleanVal match{
             case true =>  f(request) // si esta autorizado, que el metodo haga lo que debia...
             case _ => Future(Unauthorized(error_token)) // si no retorna un resultado de codigo(401) + message...
           }
       }yield(resultMethodAnswer)
    }
 }
  
  def returnToken(request:Request[AnyContent]) = {
    for{
      token <- request.headers.get(HEADER_STRING).getOrElse("")
    }yield(token) 
  }
}