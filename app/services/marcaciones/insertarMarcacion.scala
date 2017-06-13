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

class insertarMarcacion @Inject() (protected val dbConfigProvider: DatabaseConfigProvider, implicit val ec: ExecutionContext) extends HasDatabaseConfigProvider[PostgresDriver] {
  import driver.api._
  val usuarios = TableQuery[UsuarioT]
  val lugares = TableQuery[LugarT]
  val marcaciones = TableQuery[MarcacionT]
  val formatOfDate = new SimpleDateFormat("yyyy-MM-dd")
  val formatOfTime = new SimpleDateFormat("HH:mm:ss")
  val formatOfTimestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
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
      var tipo = "entrada"
       for{
          u <- revisaUsuario(d) // usuario de la marcacion, si no existe retorna un Failure.
          l <- revisaLugar(d) // lugar de la marcacion, si no existe retorna un Failure.
          _ <- revisaDistancia(d,l.latitud,l.longitud) // revisa que la distancia sea menor a la permitida para marcar...
          pruebaActualizar <- updateMarcacion(d, u.id)
          mOp <- pruebaActualizar match{
              case n if(n > 0) => tipo = "salida"
                                  DBIO.successful("")              
              case 0 => insertarMarcacion(d,u.id)
              case _ => DBIO.failed(new Exception("Error al actualizar o insertar registro!"))
              
            }
        }yield(marcacionRealizada(false,Some(s"Creaste ${tipo} a las $hourString"),None))
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
          case 0 => DBIO.failed(new Exception(s"No existe el usuario con uid ${d.uid}"))
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
}
