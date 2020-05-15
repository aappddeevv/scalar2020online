#!/usr/bin/env sh

echo "Designed to be run in top level scala project directory."

#(cd ../client; npm run declarations)
(cd ../server; npm run declarations)

DECL=./declarations
rm -rf ${DECL} 
mkdir ${DECL} 
#mv ../client/declarations ${DECL}/client
mv ../server/declarations ${DECL}/server

# synthesize a package.json so scalablytyped can grab the combined dependencies
# runs the globally installed node and those packages
PKG=./package.json
node ./scripts/combine-dependencies.js
npm install

PROJNAME=scala
rm -rf ~/.ivy2/local/org.scalablytyped/${PROJNAME}*

coursier launch -r ivy2local -r bintray:oyvindberg/converter org.scalablytyped.converter:cli_2.12:1.0.0-beta12 --  --includeProject true --scalajs 1.0.1 --ignoredLibs=logform,sequelize,apollo-client,@uifabric/experiments

VERSION=`coursier resolve org.scalablytyped::${PROJNAME}_sjs1:latest.release |grep ${PROJNAME}_sjs | cut -f 3 -d:`
echo "import sbt._; object Generated { val lib = Seq(\"org.scalablytyped\" %% \"${PROJNAME}_sjs1\" % \"$VERSION\")}" > ./project/generated.scala

rm -rf ${DECL}
