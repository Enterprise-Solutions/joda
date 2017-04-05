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
  //marcaciones: Seq[Marcacion] = Seq[Marcacion]()
){
  def nombre_completo = {
    val Nombre = nombre.toUpperCase()
    s" $Nombre ${apellido.toUpperCase()}"
  }
  
  def _toDatosUsuario = {
    DatosUsuario(email)
  }
}

case class DatosUsuario(
  correo: String    
)

case class Marcacion(
  id: Long,
  usuario_id: Long,
  fecha: Date
)

case class DatosCrearUsuario(
  email: String,
  apellido: String,
  nombre: String,
  password: String    
)

object Marcaciones{
  var usuarios: Seq[Usuario] = Seq[Usuario](
    Usuario(1,"pabloislas@gmail.com","Islas","Pablo","pislas123"),
    Usuario(2,"williambeowulf@gmail.com","Caceres","William","william123")
  )
  var marcaciones: Seq[Marcacion] = Seq[Marcacion]()
  
  def findUsuarios(email: Option[String],nombre: Option[String]) = {
    val u1 = email.map { e =>
      usuarios.filter { _.email == e }
    }.getOrElse(usuarios)
    val u2 = nombre.map{ n =>
      u1.filter{_.nombre == n}
    }.getOrElse(u1)
    u2
  }
  
  
  def findUsuario(email: String): Try[DatosUsuario] = {
    usuarios.filter{usuario => usuario.email == email}.
             headOption.map{ u => 
      Success(u._toDatosUsuario)
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

