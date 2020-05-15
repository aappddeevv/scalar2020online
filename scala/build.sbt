import scala.sys.process._
import sbt._
import org.scalajs.sbtplugin._
import org.portablescala.sbtplatformdeps.PlatformDepsPlugin.autoImport._

Global / onChangedBuildSource := ReloadOnSourceChanges

val commonScalacOptions = Seq(
  "-deprecation",
  "-feature",
  "-language:_",
  "-unchecked",
  "-Ymacro-annotations",
  "-Xlint:infer-any",
  "-Yrangepos"
)

val reactionV = "0.1.0-M7"

lazy val library = new {
  object Version {
    val cats = "2.1.1"
    val catsEffect = "2.0.0"
    val shapeless = "2.3.3"
    val zio = "1.0.0-RC19"
  }
  object JVM {
    // for JVM can use val x: Seq[ModuleID] = Seq(...), why?
  }
  object JS {
    val common = Seq(libraryDependencies ++= Seq("ttg" %%% "jshelpers" % reactionV))
    val client = Seq(
      libraryDependencies ++= Seq(
        "org.scala-js" %%% "scalajs-dom" % "1.0.0",
        "ttg" %%% "fabric-experiments" % reactionV,
        "ttg" %%% "react-dom" % reactionV,
        "ttg" %%% "vdom" % reactionV,
        "ttg" %%% "helmet" % reactionV,
        "ttg" %%% "apollo" % reactionV,
        "ttg" %%% "react-router-dom6" % reactionV,
        "ttg" %%% "loglevel" % reactionV,
        "ttg" %%% "luxon" % reactionV,
        "ttg" %%% "react" % reactionV,
        "ttg" %% "react-macros" % reactionV,
        "ttg" %%% "react-content-loader" % reactionV
      )
    )
    val server = Seq(
      libraryDependencies ++= Seq(
        "ttg" %%% "express" % reactionV,
        "ttg" %%% "luxon" % reactionV,
        "ttg" %%% "dataloader" % reactionV,
        "ttg" %%% "jshelpers" % reactionV,
        "ttg" %%% "apollo-server" % reactionV,
        "ttg" %%% "plotlyjs" % reactionV
      ) ++ Generated.lib
    )
  }
}

lazy val libsettings = Seq(
  scalacOptions in (Compile, doc) ++= Seq("-groups"),
  scalacOptions ++= commonScalacOptions,
  // default is good for web and webpack, not good for nodejs
  scalaJSLinkerConfig ~= { _.withModuleKind(ModuleKind.ESModule) },
  addCompilerPlugin("org.typelevel" %% "kind-projector" % "0.11.0" cross CrossVersion.full)
)

inThisBuild(
  List(
    scalaVersion := "2.13.1",
    organizationName := "Your Awesome Org",
    name := "awesome",
    resolvers += Resolver.bintrayRepo("aappddeevv", "maven")
  )
)

lazy val root = project
  .in(file("."))
  .settings(libsettings)
  .settings(name := "app")
  .aggregate(common, client, server)

lazy val clientCommand =
  (files: Seq[String]) => (Seq("npx", "graphql-codegen"), Seq("graphql.scala", "graphql-schema.scala"))

lazy val client = project
  .settings(libsettings)
  .settings(library.JS.client)
  .dependsOn(common)
  .enablePlugins(
    ScalaJSPlugin,
    CLICodegenPlugin,
    UnifyScalaJSOutputArtifactName,
    CopyJSPlugin
  )
  .settings(
    unifiedName := "Scala",
    copyTarget := file("../client/src/generated"),
    codegenCommand := clientCommand,
    codegenInputSources := Seq(
      sourceDirectory.value.toGlob / "client/src/main/graphql/*.graphql",
      baseDirectory.value.toGlob / "../server/src/schema.graphql"
    )
  )

lazy val common = project
  .settings(libsettings)
  .settings(scalaJSLinkerConfig ~= { _.withModuleKind(ModuleKind.CommonJSModule) })
  .settings(library.JS.common)
  .enablePlugins(ScalaJSPlugin)

lazy val server = project
  .settings(libsettings)
  .settings(scalaJSLinkerConfig ~= { _.withModuleKind(ModuleKind.CommonJSModule) })
  .settings(library.JS.server)
  //.settings(libraryDependencies ++= Generated.lib)
  .dependsOn(common)
  .enablePlugins(ScalaJSPlugin, UnifyScalaJSOutputArtifactName, CopyJSPlugin)
  .settings(
    unifiedName := "scala-server",
    copyTarget := file("../server/dist")
    // Compile / sourceGenerators += Def.task {
    //   println("Adding static graphql.scala, don't forget to generate!")
    //   Seq(file(sourceManaged.value + "/main/cli_codegen/graphql.scala"))
    // }.taskValue
  )

// Watch non-scala assets, when they change trigger sbt
// if you are using ~npmBuildFast, you get a rebuild
// when non-scala assets change
watchSources += (baseDirectory in client).value / "src/main/js"
watchSources += (baseDirectory in client).value / "src/main/public"

val npmBuild = taskKey[Unit]("fullOptJS then webpack")
npmBuild := {
  fullOptJS.in(client, Compile).value
  "npm run app" !
}

val npmBuildFast = taskKey[Unit]("fastOptJS then webpack")
npmBuildFast := {
  (fastOptJS in (client, Compile)).value
  "npm run app:dev" !
}

addCommandAlias("prepare", "headerCreate; fix; fmt")
addCommandAlias("fmt", "all scalafmtSbt scalafmt")
addCommandAlias("fix", "all compile:scalafix")
addCommandAlias("check", "all scalafmtSbtCheck scalafmtCheck")

val dumpLinkClasspath = taskKey[Unit]("Create class path shell sourcing file.")
dumpLinkClasspath := {
  val sep = sys.props("path.separator")
  val cp = (client / Compile / dependencyClasspath).value
  val classes = (client / Compile / classDirectory).value
  IO.write(
    (root / Compile / baseDirectory).value / "cp.sh",
    (Seq(classes.toPath) ++ cp.map(_.data.toPath)).map(_.toAbsolutePath).mkString(" ")
  )
}
