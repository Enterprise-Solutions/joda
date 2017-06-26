package services.marcaciones

import play.api.db.slick.{DatabaseConfigProvider,HasDatabaseConfigProvider}
import javax.inject.{Inject,Named}
import scala.concurrent.{ExecutionContext,Future}
import slick.driver.PostgresDriver
import modelos.UsuarioT
import modelos.LugarT
import modelos.MarcacionT
import modelos.ClienteT
import java.sql.Timestamp
import java.text.SimpleDateFormat
import modelos.Marcacion
import modelos.MarcacionR
import modelos.listadoMarcaciones
import java.sql.Date
import scala.math
import java.util.Calendar
import java.util.concurrent.TimeUnit
import slick.driver.H2Driver.api._


class listarMarcaciones @Inject() (protected val dbConfigProvider: DatabaseConfigProvider, implicit val ec: ExecutionContext) extends HasDatabaseConfigProvider[PostgresDriver] {
  import driver.api._
  val usuarios = TableQuery[UsuarioT]
  val lugares = TableQuery[LugarT]
  val marcaciones = TableQuery[MarcacionT]
  var clientes = TableQuery[ClienteT]
  val formatOfDate = new SimpleDateFormat("yyyy-MM-dd")
  val formatOfTime = new SimpleDateFormat("HH:mm:ss")
  val formatOfTimestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")

  
 def mostrarMarcaciones(usuario: Option[String], fecha: Option[String],lugar_id: Option[Long],cliente_id: Option[Long]):Future[Seq[listadoMarcaciones]] = {
    db.run(_showMarcaciones(usuario: Option[String], fecha: Option[String],lugar_id: Option[Long],cliente_id: Option[Long]))
  }
  
   def _showMarcaciones(usuario: Option[String], fecha: Option[String],lugar_id: Option[Long],cliente_id: Option[Long]) = {
     val now = (Calendar.getInstance().getTime()).getTime()
     val fecha_hoy = new Date(now)
     val timestamp = new Timestamp(now)
     val datestring = formatOfDate.format(fecha_hoy)
     val hourString = formatOfTime.format(timestamp)
     val timestampstring = datestring + " " + hourString
     val fts = new Timestamp(formatOfTimestamp.parse(timestampstring).getTime())
//           Vamos a probar sin sacar el Option a ver que pasa...
     val users = usuario.map{ nu =>
             usuarios.filter(_.nombre === nu)
           }.getOrElse(usuarios)
     val places = lugar_id.map{ l_id =>
             lugares.filter(_.id_lugar === l_id)
           }.getOrElse(lugares)
     val fechaDate = fecha.map{ f =>
             new Date(formatOfDate.parse(f).getTime)
           }.getOrElse(fecha_hoy)
     var q = for{
       (((ls,ms),us),cs) <- places join marcaciones on (_.id_lugar === _.id_lugar) join users on (_._2.id_usuario === _.id_usuario) join clientes on (_._1._1.id_cliente === _.id_cliente)
                           if(ms.fecha === fechaDate)
     }yield((ls,ms,us,cs))
     for{
       jr <- q.result
       r <- DBIO.successful(jr.map{x => new listadoMarcaciones(x._1.nombre,x._3.nombre,x._1.direccion,x._4.nombre,formatOfDate.format(fechaDate),formatOfTimestamp.format(x._2.hora_entrada),Some(formatOfTimestamp.format(x._2.hora_salida)),"0")})
       }yield(r)

  }
  
 
}