name := """joda"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.7"

libraryDependencies ++= Seq(
  //jdbc,
  cache,
  ws,
  "org.scalatestplus.play" %% "scalatestplus-play" % "1.5.1" % Test,
  "com.typesafe.play" %% "play-slick" % "2.0.0",
  "com.typesafe.play" %% "play-slick-evolutions" % "2.0.0",
  "org.postgresql" % "postgresql" % "9.4-1206-jdbc42",
  "io.swagger" %% "swagger-play2" % "1.5.3",
  "org.webjars" %% "webjars-play" % "2.5.0-4",
  "org.webjars" % "swagger-ui" % "2.2.0",
  "io.igl" %% "jwt" % "1.2.2",
  "io.really" %% "jwt-scala" % "1.2.2",
  "com.pauldijou" %% "jwt-core-legacy" % "0.13.0"
)

