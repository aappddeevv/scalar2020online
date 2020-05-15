 package app

import org.graalvm.polyglot._
import scala.jdk.CollectionConverters._
import scala.language.implicitConversions
import scala.util.control.Exception._
import java.{util => ju}

/** Value extension methods. Uses *Opt suffix since Value already has as* methods.
* scala types are immutable.
*/
extension valueOps on (o: Value):
    def asStringOpt = if o.isNull then None else Option(o.asString())
    def asIntOpt = if o.isNull then None else Option(o.asInt())
    def asFloatOpt = if o.isNull then None else Option(o.asFloat())
    def asDoubleOpt = if o.isNull then None else Option(o.asDouble())
    def asBooleanOpt = if o.isNull then None else Option(o.asBoolean())
    /** Throw it, catch it then return it as a value. */
    def asExceptionOpt: Option[Throwable] =
        try { if o.isException() then o.throwException(); None } catch{ case x@_ => Option(x) }
    def get(m: String) = if o.hasMember(m) then Option(o.getMember(m)) else None
    def asJavaListOpt[T] = if o.hasArrayElements then Option(o.as(classOf[ju.List[T]])) else None
    def asSeqOpt[T] = o.asJavaListOpt[T].map(_.asScala.toVector)
    /** K will typically be a string or number. */
    def asMapOpt[K,V] = if o.isHostObject then Option(o.as(classOf[ju.Map[K,V]]).asScala.toMap) else None

/** Structural type. */
case class JSValue(o: Value) extends Selectable:
    def selectDynamic(name: String): Value = o.getMember(name)

// Obtain the current context if you need it...
// val context = Context.getCurrent()
// val jsPolyBindings = context.getPolyglotBindings()

object AuthorResolver:
    def books(parent: Value, args: Value, context: Value, info: Value): String =
        val id: Option[String] = args.get("id").flatMap(_.asStringOpt)
        println(s"resolver args: $id")
        "A list of books!"
