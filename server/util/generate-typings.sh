#!/usr/bin/env sh

echo "Assumes tsc has been run to generate declarations."

rm -rf ~/.ivy2/local/org.scalablytyped/node-server*
coursier launch -r ivy2local -r bintray:oyvindberg/converter org.scalablytyped.converter:cli_2.12:1.0.0-beta12 --  --includeProject true --scalajs 1.0.1 --ignoredLibs=logform,sequelize

VERSION=`coursier resolve org.scalablytyped::node-server_sjs1:latest.release |grep node-server | cut -f 3 -d:`
echo "import sbt._; object Generated { val lib = Seq(\"org.scalablytyped\" %% \"node-server_sjs1\" % \"$VERSION\")}" > ../webui/project/generated.scala


