package modelos
import scala.util.Try
import scala.util.Success
import scala.util.Failure
import java.util.Date
import java.text.ParseException
import java.text.SimpleDateFormat
import java.util._
import org.joda.time.DateTime // importando la clase DateTime de JodA.

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

}

 
  
