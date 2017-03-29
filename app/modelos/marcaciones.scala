package modelos
import scala.util.Try
import scala.util.Success
import scala.util.Failure
import java.util.Date

case class Usuario(
  id: Long,
  email: String,
  apellido: String,
  nombre: String,
  password: String
){
  def nombre_completo = {
    val Nombre = nombre.toUpperCase()
    s" $Nombre ${apellido.toUpperCase()}"
  }
}

case class Marcacion(
  id: Long,
  usuario_id: Long,
  fecha: Date,
  lugar: String
)

object Marcaciones{
  var usuarios: Seq[Usuario] = Seq[Usuario](
    Usuario(1,"pabloislas@gmail.com","Islas","Pablo","pislas123"),
    Usuario(2,"williambeowulf@gmail.com","Caceres","William","william123")
  )
  var marcaciones: Seq[Marcacion] = Seq[Marcacion]()
  
  
  def findUsuario(email: String): Try[Usuario] = {
    usuarios.filter{usuario => usuario.email == email}.
             headOption.map{ u => 
      Success(u)
    }.getOrElse(Failure(new Exception(s"No existe el usuario con email: $email")))
  }
  
  def validarEmailRepetido(email: String): Try[String] = {
    findUsuario(email).map{u =>
      Failure(new Exception(s"Ya existe el usuario con el email"))
    }.getOrElse(
      Success(email)
    )
  }
  
  def agregarUsuario(email: String,apellido: String,nombre: String,password: String):Try[Usuario] = {
    /*if(findUsuario(email).isDefined){
      None
    }else{
      val u = Usuario(usuarios.length+1,email,apellido,nombre,password)
      usuarios = usuarios.:+(u)
      Some(u)  
    }*/
    
    for{
      _ <- validarEmailRepetido(email)
      u <- _crearUsuarioEnBd(email, apellido, nombre, password)
    }yield(u)
  }
  
  def _crearUsuarioEnBd(email: String,apellido: String,nombre: String,password: String):Try[Usuario] = {
    val u1 = Usuario(usuarios.length+1,email,apellido,nombre,password)
    usuarios = usuarios.:+(u1)
    Success(u1)
  }
  /**
   * dd-m-yyyy hh:mm:ss
   */
  def _agregarMarcacionExterna(email: String) = ???
}

