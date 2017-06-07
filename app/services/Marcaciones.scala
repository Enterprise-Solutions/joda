package services

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


class Marcaciones @Inject() (protected val dbConfigProvider: DatabaseConfigProvider, implicit val ec: ExecutionContext) extends HasDatabaseConfigProvider[PostgresDriver] {
  import driver.api._
  val usuarios = TableQuery[UsuarioT]
  val lugares = TableQuery[LugarT]
  val marcaciones = TableQuery[MarcacionT]
  val formatOfDate = new SimpleDateFormat("yyyy-MM-dd")
  val formatOfTime = new SimpleDateFormat("HH:mm:ss")
  val formatOfTimestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
  
  /*
   * MARCAR ...
   */
  
  def nuevaMarcacion(d: crearMarcacion): Future[marcacionRealizada] = {
    db.run(_creacionMarcacion(d).transactionally) recover{
      case e: Exception => 
        marcacionRealizada(true,None,Some(s"Error al realizar marcación, ${e.getMessage}"))
    }
  }
  
  def _creacionMarcacion (d: crearMarcacion): DBIO[marcacionRealizada] = {
    val now = (Calendar.getInstance().getTime()).getTime()
    val timestamp = new Timestamp(now)
    val hourString = formatOfTime.format(timestamp)
     for{
        u <- revisaUsuario(d) // usuario de la marcacion, si no existe retorna un Failure.
        l <- revisaLugar(d) // lugar de la marcacion, si no existe retorna un Failure.
        _ <- revisaDistancia(d,l.latitud,l.longitud) // revisa que la distancia sea menor a la permitida para marcar...
        pruebaActualizar <- updateMarcacion(d, u.id)
        mOp <- pruebaActualizar match{
            case n if(n > 0) => DBIO.successful("") 
            case 0 =>insertarMarcacion(d,u.id)
            case _ => DBIO.failed(new Exception("Error al actualizar o insertar registro!"))
            
          }
      }yield(marcacionRealizada(false,Some(s"Creaste entrada a las $hourString"),None))
  }
  
  def _updateMarcacion(d: crearMarcacion,m: Marcacion) = {
    val now = (Calendar.getInstance().getTime()).getTime()
    val fecha_hoy = new Date(now)
    val timestamp = new Timestamp(now)
    val datestring = formatOfDate.format(fecha_hoy)
    val hourString = formatOfTime.format(timestamp)
    val timestampstring = datestring + " " + hourString
    val fts = new Timestamp(formatOfTimestamp.parse(timestampstring).getTime())
        val query = sql"""
      UPDATE marcaciones SET hora_salida = ${fts}, latitud_salida = ${d.latitud} , longitud_salida = ${d.longitud}
      WHERE id = ${m.id};
      """
     for{
        r <- query.as[(Int)]
        r1 <- DBIO.successful{r.toSeq.head}
     }yield(r1)
  }
    
  def updateMarcacion(d: crearMarcacion, usuario_id:Long) = {
    val now = (Calendar.getInstance().getTime()).getTime()
    val fecha_hoy = new Date(now)
    val q = for{
      m <- marcaciones.sortBy(_.fecha.desc).sortBy(_.hora_entrada.desc)
      if(m.usuario_id === usuario_id && m.lugar_id === d.lugar_id && m.fecha === fecha_hoy)
    }yield(m)
    
    for{
      r <- q.result.headOption
      p <- r match{
          case Some(m) if(m.hora_salida == None) =>
                        /* le falta salida*/
            _updateMarcacion(d,m) // actualiza la marcacion que le falta hora_salida
          case _ => DBIO.successful(0) // estan los registros completos o no existe ninguno todavia...
        }
    }yield(p)
    
  }
  
  def insertarMarcacion(d:crearMarcacion, usuario_id:Long): DBIO[Marcacion] = {
    val now = (Calendar.getInstance().getTime()).getTime()
    val fecha_hoy = new Date(now)
    val timestamp = new Timestamp(now)
    val datestring = formatOfDate.format(fecha_hoy)
    val hourString = formatOfTime.format(timestamp)
    val timestampstring = datestring + " " + hourString
    val fts = new Timestamp(formatOfTimestamp.parse(timestampstring).getTime())
    val m = Marcacion(usuario_id,d.lugar_id,fecha_hoy,Some(fts),true,0,None,Some(d.latitud),Some(d.longitud),None,None)
    for{
       new_id <- marcaciones returning marcaciones.map(_.id) += m
       m1  <- new_id match{
       case n if(n > 0) => DBIO.successful(m.copy(id = new_id + 1))
       case _ => DBIO.failed(new Exception(s"Error al realizar marcación"))
       }
   }yield(m1)
  }
  
  def revisaLugar(d:crearMarcacion): DBIO[Lugar] = {
    for{
      ls <- lugares.filter(_.id === d.lugar_id).result
      r <- ls.length match {
        case n if (n > 0) => DBIO.successful("")
        case 0 => DBIO.failed(new Exception(s"No existe un lugar con el id ${d.lugar_id}"))
        case _ => DBIO.failed(new Exception("Problemas al consultar con la base de datos"))
      }
    }yield(ls.head)
  }
  
  def revisaUsuario(d: crearMarcacion): DBIO[Usuario] = {
    for {
      us <- usuarios.filter(_.uid === d.uid).result
      l <- us.length match {
        case n if (n > 0) => DBIO.successful("")
        case 0 => DBIO.failed(new Exception("No existe el usuario con uid ${d.uid}"))
        case _ => DBIO.failed(new Exception("Problemas al consultar con la base de datos"))
      }
    }yield(us.head)
    
  }
  
  def revisaDistancia (d: crearMarcacion, latitud: Double, longitud: Double): DBIO[Double] = {
    for{
      d <- DBIO.successful(haversineDistance(latitud,longitud,d.latitud,d.longitud))
      _ <- d match{
        case n if(n <= 100.0) => DBIO.successful("")
        case n if(n > 100.0) => DBIO.failed(new Exception("Esta mas lejos de lo permitido del lugar de marcacion!"))
        case _ => DBIO.failed(new Exception("Error al calcular distancia")) // reevisa que la distancia esta a menos que lo establecido...
      }
    }yield(d)
  }

  def haversineDistance(initialLat: Double,initialLong: Double,finalLat: Double,finalLong: Double) = {
    val earthRadiusInKm = 6371 * 1000 // meters...
    val dLat = math.toRadians(finalLat-initialLat)
    val dLon = math.toRadians(finalLong-initialLong)

    val a = math.pow(math.sin(dLat/2),2) + math.pow(math.sin(dLon/2),2) * math.cos(math.toRadians(initialLat)) * math.cos(math.toRadians(finalLat))
    val c = 2 * math.asin(math.sqrt(a))
    earthRadiusInKm * c
  }

  
  /*
   * MOSTRAR MARCACIONES..
   * */
  
  def showMarcaciones(d: DatosLugaresMarcaciones): Future[marcacionesLugares] = {
    db.run(_showMarcaciones(d)) recover{
      case e: Exception => 
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
    LugarR(l.id,l.nombre,l.latitud.toString(),l.longitud.toString(),l.direccion,l.empresa_id,l.cliente_id,l.uid,l.es_beacon,2)
  }
   
  def wrap[A](s: Seq[A]) = if (s.isEmpty) None else Some(s)
  
  def traerLugares():DBIO[Seq[Lugar]] = {
    for{
      r <- lugares.result
      _ <- r.length match{
        case n if(n > 0) => DBIO.successful("")
        case 0 => DBIO.failed(new Exception("No tiene lugares asignados"))
        case _ => DBIO.failed(new Exception("Problema al buscar lugares!"))
      }
    }yield(r)
  }
  
  def _getLugarM(l:LugarR,d:DatosLugaresMarcaciones) = {
    for{
      ms <- marcacionesUser(d,l.id)
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
      (m,u) <- marcaciones join usuarios on (_.usuario_id === _.id)
            if(u.uid === uid && m.lugar_id === lugar_id && m.fecha === fecha)
    }yield(m)
    for{
      r <- q.result
      uOp <- _findUsuario(uid)
      r1 <- uOp match{
        case None => DBIO.failed(new Exception(s"No existe usuario con uid: ${d.uid}"))
        case Some(_) => DBIO.successful{r map {m =>
        Marcaje(MarcacionR(m.usuario_id,m.lugar_id,formatOfDate.format(m.fecha),
            m.hora_entrada match {
              case Some(s) => Some(formatofHour.format(s))
              case None => None}
        ,m.es_valido,m.id,
        m.hora_salida match {
              case Some(s) => Some(formatofHour.format(s))
              case None => None}
          ,m.latitud_entrada match {
              case Some(s) => Some(s.toString())
              case None => None}
          ,m.longitud_entrada match {
              case Some(s) => Some(s.toString())
              case None => None}
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