package services.marcaciones

import play.api.db.slick.{DatabaseConfigProvider,HasDatabaseConfigProvider}
import javax.inject.{Inject,Named}
import scala.concurrent.{ExecutionContext,Future}
import slick.driver.PostgresDriver
import modelos.UsuarioT
import modelos.LugarT
import modelos.MarcacionT
import java.sql.Timestamp
import java.text.SimpleDateFormat
import modelos.Marcacion
import modelos.MarcacionR
import modelos.Lugar
import modelos.LugarR
import modelos.Usuario
import modelos.Marcaje
import modelos.DatosLugaresMarcaciones
import modelos.marcacionesLugares
import modelos.marcacionesLugares
import java.sql.Date
import scala.math
import java.util.Calendar
import modelos.lugaresM
import modelos.crearMarcacion
import modelos.marcacionRealizada
import modelos.ExceptionJoda

class marcacionesDeLugares @Inject() (protected val dbConfigProvider: DatabaseConfigProvider, implicit val ec: ExecutionContext) extends HasDatabaseConfigProvider[PostgresDriver] {
  import driver.api._
  val usuarios = TableQuery[UsuarioT]
  val lugares = TableQuery[LugarT]
  val marcaciones = TableQuery[MarcacionT]
  val formatOfDate = new SimpleDateFormat("yyyy-MM-dd")
  val formatOfTime = new SimpleDateFormat("HH:mm:ss")
  val formatOfTimestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")

  
 def showMarcaciones(d: DatosLugaresMarcaciones): Future[marcacionesLugares] = {
    db.run(_showMarcaciones(d)) recover{
      case e:ExceptionJoda => marcacionesLugares(true,Some(e.msg),None)
      case e:Exception => 
        marcacionesLugares(true,Some(e.getMessage),None)   
    }
  }
  
   def _showMarcaciones(d: DatosLugaresMarcaciones) = {
     for{
       ls <- traerLugares()
       r <- DBIO.sequence{ls map {l =>
         _getLugarM(_getLugarR(l), d)
       }}
     }yield(marcacionesLugares(false,None,Some(r)))
  }
  
  def _getLugarR(l: Lugar) = {
    LugarR(l.id_lugar,l.nombre,l.latitud.toString(),l.longitud.toString(),l.direccion,l.id_empresa,l.id_cliente,l.uid,l.es_beacon,2)
  }
   
  
  def traerLugares():DBIO[Seq[Lugar]] = {
    for{
      r <- lugares.result
      _ <- r.length match{
        case n if(n > 0) => DBIO.successful("")
        case 0 => DBIO.failed(new ExceptionJoda("No tiene lugares asignados","1"))
        case _ => DBIO.failed(new ExceptionJoda("Problema al buscar lugares!","2"))
      }
    }yield(r)
  }
  
  def _getLugarM(l:LugarR,d:DatosLugaresMarcaciones) = {
    for{
      ms <- marcacionesUser(d,l.id_lugar)
    }yield(
      lugaresM(l,ms)    
    )
  }

  
  def _findUsuario(uid: String) = {
    usuarios.filter(_.uid === uid).result.headOption
  }
  
  def marcacionesUser(d: DatosLugaresMarcaciones, lugar_id : Long) : DBIO[Seq[Marcaje]] = {
    val fromUser = new SimpleDateFormat("ddMMyyyy")
    val formatOfDate = new SimpleDateFormat("yyyy-MM-dd")
    val formatofHour = new SimpleDateFormat("HH:mm:ss")
    val uid = d.uid
    val fecha = new Date(formatOfDate.parse(d.fecha).getTime)
    val q = for{
      (m,u) <- marcaciones join usuarios on (_.id_usuario === _.id_usuario)
            if(u.uid === uid && m.id_lugar === lugar_id && m.fecha === fecha)
    }yield(m)
    for{
      r <- q.result
      uOp <- _findUsuario(uid)
      r1 <- uOp match{
        case None => DBIO.failed(new Exception(s"No existe usuario con uid: ${d.uid}"))
        case Some(_) => DBIO.successful{r map {m =>
        Marcaje(MarcacionR(m.id_usuario,m.id_lugar,formatOfDate.format(m.fecha),
            formatofHour.format(m.hora_entrada),m.es_valido,m.id_marcacion,
           m.hora_salida match {
              case Some(s) => Some(formatofHour.format(s))
              case None => None},m.latitud_entrada.toString(),m.longitud_entrada.toString()
          ,m.latitud_salida match {
              case Some(s) => Some(s.toString())
              case None => None}
          ,m.longitud_salida match {
              case Some(s) => Some(s.toString())
              case None => None}))
        }
      }
      }

    }yield(r1)
  }
  
  
}