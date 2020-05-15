#!/usr/bin/env sh

TOP=$(realpath $(dirname $(realpath -s $0))/..)
if [ -z "$DIST" ]; then
  DIST=${TOP}/dist
fi

echo "Build run from server directory."
echo "Top     : $TOP"
echo "Build to: $DIST"

echo "Emptying dist"
rm -rf ${DIST}
mkdir -p ${DIST}/public

echo "Building server code into dist"
npm run codegen
npm run build:ts

echo "Generating typings"
./util/generate-typings.sh

echo "Going to ../webui to build graphql artifacts, scala server and client"
cd $TOP/../webui
# output path relative to webui folder
npm run graphql
# build all projects
sbt fullOptJS
export PUBLIC_PATH="/app/"
export SERVE_PATH="/public/"
npm run ui:prod:bundle

cd $TOP
echo "Copying misc files"
cp -r src/public/* ${DIST}/public
cp src/schema.graphql ${DIST}

echo "Build complete."
