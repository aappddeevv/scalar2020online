#!/usr/bin/env sh

# Bindings generated from scalablytyped have a @JSImport path 
# based on the declarations and their specific locations in
# the project when they were generated. There are multiple
# ways and npm packages to provide module aliasing in nodejs 
# but a simple link works quite well.
mkdir -p node_modules/scala/declarations
ln -s ../../../dist node_modules/scala/declarations/server

