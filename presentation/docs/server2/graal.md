---
id: graal
title: Scaling the Backend with Dotty and Graal
---

You can further scale a backend and tap into the JVM ecosystem using
graal. Graal has a new "node" that can run polyglot. It's still
early days for node on graal (graaljs) but you can get a feel for it
fairly quickly.

graal is a family of technologies including a VM, JIT and frameworks
for constructing languages that can share values and functions
between them.

You need to graal installed. A JVM with graal JIT is not sufficient.

While you could run scala.js javascript on graal, the best use for
it may be polglot programming so JVM code and graaljs makes sense.

:::caution
Everything here is experimental.
:::

:::caution
graaljs can take a long time at the start of the process to
compile the compiler or compile code. Startup times can be longer
so tools like `nodemon` that restarts node when it sees a change
may be pragmatically unusable with graaljs.
:::

## Dotty

Dotty outputs JVM code which can be used directly by the graaljs
runtime.

First we might want to have some extension methods:

```scala
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

```

Then, we can define our totally untyped resolver function. Again, this example
exists to help illustrate the point.

```scala
object AuthorResolver:
    def books(parent: Value, args: Value, context: Value, info: Value): String =
        val id: Option[String] = args.get("id").flatMap(_.asStringOpt)
        println(s"resolver args: $id")
        "A list of books!"
```

## Graal

To run graal, make sure that the graal node is in your path and use. If you
just want to play around with graal and your dotty code after compiling
your dotty code, add a task to your sbt build file to dump out the
full build path:

```scala
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
```

Then

```sh
node --jvm --vm.cp `cat cp.txt` file.js
```

This will run graaljs on the script `file.js`.

## Graphql Resolver

Alright, this project does not actually have the resolver defined in all its
production glory, but here's some code to help you envision how it could be
used.

To call this from node, run graal as in above, then:

```javascript
$ node --jvm  --vm.cp `cat cp.txt`
Welcome to Node.js v12.15.0.
Type ".help" for more information.
> globalThis.Java.type("app.AuthorResolver").books(null, { id: "1"}, null, null)
resolver args: Some(1)
'A list of books!'
```

We can now load in jvm zio and other jvm tools to scale-up our server.
