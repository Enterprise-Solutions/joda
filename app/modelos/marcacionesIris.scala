package modelos
import scala.util.Try
import scala.util.Success
import scala.util.Failure
import java.util.Date

import java.util.TimeZone
import java.text.SimpleDateFormat

import org.joda.time.DateTime
import org.joda.time.Interval
import org.joda.time.Years
import org.joda.time.Months
import org.joda.time.Days
import org.joda.time.Period
import org.joda.time.format.PeriodFormat
import org.joda.time.LocalDateTime
import org.joda.time.DateTimeZone
import org.joda.time.format.DateTimeFormat
import org.joda.time.Seconds
import org.joda.time.Minutes
import org.joda.time.Hours

import java.text.ParseException
import java.text.SimpleDateFormat
import java.util._


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
  fecha: Date,
  lugar: String
)

case class DatosMarcacion(
  email: String,
  nombre_apellido: String,
  fecha: String,
  lugar: String
)

case class DatosCrearUsuario(
  email: String,
  apellido: String,
  nombre: String,
  password: String    
)

case class DatosCrearMarcacion(
  email: String,
  fecha: String,
  lugar: String
)

object Marcaciones{
	
  var usuarios: Seq[Usuario] = Seq[Usuario](
    Usuario(1,"pabloislas@gmail.com","Islas","Pablo","pislas123"),
    Usuario(2,"williambeowulf@gmail.com","Caceres","William","william123")
  )
  
  val format = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss")
  val dtf = new SimpleDateFormat("dd-MM-yyyy")
  
  var marcaciones: Seq[Marcacion] = Seq[Marcacion](  
    Marcacion(1, 1, format.parse("31-03-2017 08:00:39"), "ES"),
    Marcacion(2, 1, format.parse("31-03-2017 18:00:39"), "ES"),
    Marcacion(3, 2, format.parse("31-03-2017 09:00:39"), "ES"),
    Marcacion(4, 2, format.parse("31-03-2017 19:00:39"), "ES"),
    Marcacion(5, 2, format.parse("28-03-2017 09:30:39"), "ES")
  )


  def findUsuarios(email: Option[String],nombre: Option[String]) = {
    val u1 = email.map { e =>
      usuarios.filter { _.email == e }
    }.getOrElse(usuarios)
    val u2 = nombre.map{ n =>
      u1.filter{_.nombre == n}
    }.getOrElse(u1)
    u2
  }

   /*Formato de fecha prevista : "dd-MM-yyyy hh:mm:ss"
   @joaquin.olivera
  */
    // Lista de lugares donde se realizan las marcaciones...
 // var lugares : Seq[String] = Seq()
    // Calculo de variables medidas de tiempo(para no tener valores magicos...)
  val secondsInMilli: Long = 1000
  val minutesInMilli: Long = secondsInMilli * 60
	val hoursInMilli: Long = minutesInMilli * 60
	val daysInMilli: Long = hoursInMilli * 24
	
  def toDate(fecha:String): Date = {
	  val formatOfDate = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
	  formatOfDate.parse(fecha)
  }
  
  def _createMarking(usuario_id: Long,lugar: String,fecha: Date): Try[Marcacion] = {
    val m1 = Marcacion(marcaciones.length+1,usuario_id,fecha,lugar)
    marcaciones = marcaciones.:+(m1)
    /*Failure(new Exception("Error al insertertar en la base de datos"))*/Success(m1)
  }
  
  def _newMarking(email:String,lugar:String, fecha:String): Try[Marcacion] = {
    for {
     user <- findUsuario(email)
     mark <- _createMarking(user.id, lugar, toDate(fecha))
    }yield(mark)
  }
  
  def listingMarks(email:String, fecha: String): Seq[Marcacion] = {
    val fechaToDate = toDate(fecha)
     if(findUsuario(email).toOption.isDefined){
        marcaciones.filter(marcacion => 
       ((marcacion.usuario_id == (findUsuario(email).toOption.get).id) && 
       ((marcacion.fecha.getTime - fechaToDate.getTime) / daysInMilli == 0)))
     }else{
       println("No existe el Usuario solicitado\n")
       Seq[Marcacion]()
     }
  }
  
  def listingDate(fecha: String): Seq[Marcacion] = {
		// todas las marcaciones de la fecha...
		marcaciones.filter(marca => ((marca.fecha.getTime - toDate(fecha).getTime)/ daysInMilli) == 0)
  }
  
   // las iteraciones se puede hacer con recursividad y el trabajo con elementos de una lista, mediante .head y .tail.head
  
 /* def calculateWork(email:String, fecha:String, listaDeMarcaciones: Seq[Marcacion], workedTime): Try[Long] = {
    if (listaDeMarcaciones.isEmpty){
      
    }else {
      workedTime += math.abs(listaDeMarcaciones.head.fecha.getTime() - listaDeMarcaciones.tail.head.fecha.getTime())
      calculateWork(email,fecha,listaDeMarcaciones.tail.tail,workedTime)
    }
      println(s"Trabajado: ${workedTime / hoursInMilli} H ${(workedTime / minutesInMilli) - (workedTime / hoursInMilli)*60}M")
      Success(workedTime.toLong)
  }*/
  
  def _calculateWorkTimeEven (email: String, fecha:String): Try[Long] = {
      var i = listingMarks(email, fecha).iterator  // 
      var workedTime: Long = 0
      do{
        workedTime += math.abs(i.next.fecha.getTime() - i.next.fecha.getTime()) // como usar 2 elementos de la lista en una funcion i.e map?
      }while(i.hasNext != false)
       println(s"Trabajado: ${workedTime / hoursInMilli} H ${(workedTime / minutesInMilli) - (workedTime / hoursInMilli)*60}M")
      Success(workedTime)
  }
 
  def _calculateWorkTimeNotEven (email: String, fecha:String) :Try[Long] = {
      var i = listingMarks(email, fecha).init.iterator // se olvida del ultimo porque no pertenece a una sesion cerrada...
      var workedTime: Long = 0
      do{ // hacer las iteraciones con .map
        workedTime += math.abs(i.next.fecha.getTime() - i.next.fecha.getTime()) // DAte 
      }while(i.hasNext != false)
       println(s"Trabajado: ${workedTime / hoursInMilli} H ${(workedTime / minutesInMilli) - (workedTime / hoursInMilli)*60} M")
      Success(workedTime)
  }
  
  def timeWorked(email: String, fecha:String) : Try[Long] = {
    if(listingMarks(email, fecha).size < 2){
      Failure(new Exception(s"No hay registrada una sesion del usuario con email: $email"))
    }else if(listingMarks(email, fecha).size % 2 == 0){
      // si es un numero par de entradas se calculan el tiempo de las sesiones...
      // calculateWork(email, fecha, listingMarks(email, fecha), 0)
      _calculateWorkTimeEven(email, fecha)
    }else{ // existe ademas una sesion abierta...
      println(s"Todavia tiene sesion abierta desde las ${new SimpleDateFormat("HH:mm:ss").format(listingMarks(email, fecha).last.fecha)}")
      //calculateWork(email, fecha, listingMarks(email, fecha).init, 0)
      _calculateWorkTimeNotEven(email, fecha)
    }
  }
  
  /*
   * Fin @joaquin.olivera...
   * */

   
  def findUsuario(email: String): Try[Usuario] = {
    usuarios.filter{usuario => usuario.email == email}.
             headOption.map{ u => 
      Success(u)
    }.getOrElse(Failure(new Exception(s"No existe el usuario con email: $email")))
  }
 
  def validarUsuario(email: String): Try[String] = {
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
      _ <- validarUsuario(email)
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
  
  
  //@irisariana
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
  
   /*Método utilizado en la forma opcional de listar marcaciones por fecha elegida*/
   def findFechaMarcacion(fechaElegida: String): Try[String] = {     
     marcaciones.filter{m => dtf.format(m.fecha) == fechaElegida}.
             headOption.map{ u => 
      Success(u.fecha.toString())
    }.getOrElse(Failure(new Exception(s"No existen marcaciones en fecha: $fechaElegida")))
  }
     
   def listarMarcaciones(fechaElegida: String): Try[Seq[Marcacion]] = {            
     
     /*Otra forma de implementación
     for{
        u <- findFechaMarcacion(fechaElegida)
        n <- (
          Success(marcaciones.filter{m => dtf.format(m.fecha) == fechaElegida}.
                            sortBy(_.fecha)
              )
        )
    }yield(n)*/
     
    val n = marcaciones.filter{m => dtf.format(m.fecha) == fechaElegida}.sortBy(_.fecha)               
    if (n.isEmpty) Failure(new Exception(s"No existen marcaciones en fecha: $fechaElegida"))
    else           Success(n)
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
   
   /*Diferencia entre fechas utilizando API JODA*/
   def difDate2(fecha1: String, fecha2: String) = {
     val fmt = DateTimeFormat.forPattern("dd-MM-yyyy HH:mm:ss");
     val value1 = fmt.parseDateTime(fecha1)
     val value2 = fmt.parseDateTime(fecha2)
     println(s"La fecha1 convertida es: $value1")
     println(s"La fecha2 convertida es: $value2")
     
     /*println(value1.getDayOfWeek)
     println(value2.getDayOfWeek)*/
     
     val interval = new Interval(value1, value2);
     val period = interval.toPeriod()
     val years = Years.yearsIn(interval);
     val months = Months.monthsIn(interval);
     val days = Days.daysIn(interval);
     val hours = Hours.hoursIn(interval)
     val minutes = Minutes.minutesIn(interval)
     val seconds = Seconds.secondsIn(interval)
     
     println(s"La diferencia es de: ${period.getYears()} anhos, ${period.getMonths()} meses, ${period.getDays()} dias, ${period.getHours()} horas, ${period.getMinutes()} minutos, ${period.getSeconds()} segundos")
     println(s"Expresada en anhos: $years")
     println(s"Expresada en meses: $months")
     println(s"Expresada en dias: $days")
     println(s"Expresada en horas: $hours")
     println(s"Expresada en minutes: $minutes")
     println(s"Expresada en segundos: $seconds")
     println(s"La suma del periodo es de: ${period.plus(period).getYears()} anhos, ${period.plus(period).getMonths()} meses, ${period.plus(period).getDays()} dias, ${period.plus(period).getHours()} horas, ${period.plus(period).getMinutes()} minutos, ${period.plus(period).getSeconds()} segundos")
   }
  
   //FIN   @irisariana
}

