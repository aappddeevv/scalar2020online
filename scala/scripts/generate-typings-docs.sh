#!/usr/bin/env sh

CP=`coursier  fetch --classpath org.scala-js:scalajs-library_2.13:1.0.1 org.scala-js:scalajs-dom_sjs1_2.13:1.0.0 com.olvind:scalablytyped-runtime_sjs1_2.13:2.1.0`

scaladoc -classpath $CP -d generated_docs -doc-title "generated" -doc-no-compile `find ./out -name *.scala` 
