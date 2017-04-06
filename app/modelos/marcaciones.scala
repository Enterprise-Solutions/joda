package modelos
import scala.util.Try
import scala.util.Success
import scala.util.Failure
import java.util.Date
import java.util.TimeZone
import java.text.SimpleDateFormat

import org.joda.time.DateTime
import org.joda.time.Interval
import org.joda.time.Period
import org.joda.time.format.PeriodFormat
import org.joda.time.LocalDateTime
import org.joda.time.DateTimeZone

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

case class DatosMarcacion(
  email: String,
  nombre_apellido: String,
  fecha: String,
  lugar: String
)

object Marcaciones{
  var usuarios: Seq[Usuario] = Seq[Usuario](
    Usuario(1,"pabloislas@gmail.com","Islas","Pablo","pislas123"),
    Usuario(2,"williambeowulf@gmail.com","Caceres","William","william123")
  )
  
  val format = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss")
  
  var marcaciones: Seq[Marcacion] = Seq[Marcacion](  
    Marcacion(1, 1, format.parse("31-03-2017 08:00:39"), "ES"),
    Marcacion(2, 1, format.parse("31-03-2017 18:00:39"), "ES"),
    Marcacion(3, 2, format.parse("31-03-2017 09:00:39"), "ES"),
    Marcacion(4, 2, format.parse("31-03-2017 19:00:39"), "ES"),
    Marcacion(5, 2, format.parse("28-03-2017 09:30:39"), "ES")
  )
  
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
  
  /* ============================ EJERCICIO 1 ============================== 
   * 1.  Agregar marcacion para usuario [los campos se utilizan los que ya estan, se supone que los usuarios ya existen]. 
   * Parametros que recibe:
   1. email
   2. fecha: String [dd-MM-yyyy  hh:mm:ss]
       1. Ejemplo: 29-03-2017 16:32:00 */
  
  def agregarMarcacion(email: String, fechaHora: String, lugar: String):Try[Marcacion] = {
              
    for{
      u <- findUsuario(email)
      m <- (_crearMarcacionBD(u.id, fechaHora, lugar)
      )
    }yield(m)  
  }  
  
  def _crearMarcacionBD(id: Long, fechaHora: String, lugar: String):Try[Marcacion] = {
              
    //val format = new java.text.SimpleDateFormat("dd-MM-yyyy HH:mm:ss")
       
    val m1 = Marcacion(marcaciones.length+1, id, format.parse(fechaHora), lugar)
    marcaciones = marcaciones.:+(m1)
    Success(m1)
  }  
  
    /* ============================ EJERCICIO 2 ============================== */
  /* 2. Listar marcaciones por usuario ordenados por fecha. Parametros que recibe:
   1. email
   2. Option[fecha]*/
  
  
   def listarMarcacionesUsuario(email: String): Try[Seq[DatosMarcacion]] = {
    for{
      u <- findUsuario(email)
      n <- (
        Success(marcaciones.filter{_.usuario_id == u.id}.
                            sortBy(_.fecha).
                            map(_datosMarcacion(u, _))
               )
      )
    }yield(n)  
  }
    
   def _datosMarcacion(u: Usuario, m: Marcacion): DatosMarcacion = {
     DatosMarcacion(
       u.email,
       u.nombre_completo,
       format.format(m.fecha),
       m.lugar
     )
   }
   
    /* ============================ EJERCICIO 3 ============================== */
  /* 3. Listar marcaciones por día ordenados por hora. Parametros que recibe:
   1. fecha
   2. retorno:
       1. Persona - Fecha - Hora - Lugar*/
  
  
   def listarMarcaciones(fechaElegida: String): Seq[Marcacion] = {       
     val dtf = new SimpleDateFormat("dd-MM-yyyy")
     marcaciones.filter{m => dtf.format(m.fecha) == fechaElegida}.sortBy(_.fecha)
  }
   
    /* ============================ EJERCICIO 4 ============================== */
   /* Obtener la diferencia entre dos fechas*/
   
   def difDate(entrada: String, salida: String) = {
     
     val dtf = new SimpleDateFormat("HH:mm:ss")
     dtf.setTimeZone(TimeZone.getTimeZone("UTC"))
     
     val interval = new Interval(format.parse(entrada).getTime, format.parse(salida).getTime())
	   val period = interval.toPeriod()
     val time = dtf.format(interval.toDurationMillis())
     
	   println(s"La diferencia es: ${period.getYears()} anhos, ${period.getMonths()} meses, ${period.getDays()} dias, ${period.getHours()} horas, ${period.getMinutes()} minutos, ${period.getSeconds()} segundos") 
	   println(s"La diferencia en formato HH:mm:ss es: $time")
	     
	   
   }
   
   def difHora(entrada: String, salida: String) = {
     
     val dtf = new SimpleDateFormat("HH:mm:ss")
     dtf.setTimeZone(TimeZone.getTimeZone("UTC"))
     
     val interval = new Interval(dtf.parse(entrada).getTime, dtf.parse(salida).getTime())
     val time = dtf.format(interval.toDurationMillis())
      
	   println(s"La diferencia es: $time")
	   
   }
}

