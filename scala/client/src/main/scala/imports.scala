package app
package client

import scala.scalajs.js
import js.annotation._
import react._
import fabric.components.IColumn

//
// scala.js output is placed into "generated/Scala" module
// so our import paths must match the location of the artifact
// in the typescript client project.
//
// We could scalablytyped to access these bindings but there
// were only two things we needed access to.
//
// Note that idpath is a String because lodash is used
// underneath in javascript. There's no way around that but
// it should be noted that in metadata-driven applications,
// you typically only have strings anayway.
//
@js.native
@JSImport("../renderers", JSImport.Namespace)
object renderers extends js.Object {
  val missing: String = js.native
  def renderLink[T <: js.Object](
      idpath: String,
      nav: js.Function1[String, Unit]
    ): js.Function3[T, Int, IColumn, ReactNode] =
    js.native
}
