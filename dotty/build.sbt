import scala.sys.process._
import scala.util.Properties._
import sbt.Keys.streams

Global / onChangedBuildSource := ReloadOnSourceChanges

name := "app"
scalaVersion := "0.24.0-RC1"
scalacOptions ++= Seq(
  "-Yindent-colons",
  "-indent",
  //"-strict",
  "-language:strictEquality"
)

val runserver = taskKey[Unit]("Run server using graal node (graaljs).")
runserver := {
  val log = streams.value.log
  // ensure we compile scala sources first
  (Compile / compile).value
  log.info("Running server using graal node (graaljs).")
  val classpath = (Compile / compile / fullClasspath).value

  val classpath_list = classpath
    .map(_.data.getAbsolutePath)
    .mkString(scalaPropOrElse("path.separator", ":"))
  log.info(s"Classpath $classpath_list")
  // run node calling node directly to avoid npm/npx shell issues
  Process(
    Seq("node", "--jvm", "--vm.cp", classpath_list, "../server/dist/server.js"),
    Some(file("../server")),
    "VERBOSE" -> "true",
    "NODE_ENV" -> "production"
  ) !
}

val dumpcp = taskKey[Unit](
  "Dump the classpath use as node --jvm --vm.cp `cat cp.txt` something.js."
)
dumpcp := {
  val classpath = (Compile / compile / fullClasspath).value
  val classpath_list = classpath
    .map(_.data.getAbsolutePath)
    .mkString(scalaPropOrElse("path.separator", ":"))
  IO.write(file("cp.txt"), classpath_list)
}
