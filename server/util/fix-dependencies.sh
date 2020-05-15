#!/usr/bin/env sh

echo "Fixing dependencies for graaljs. Try to use npm shrinkwrap for this."
# use: tree -dfi | grep depd
rm -rf `find ./node_modules/mssql -name depd -print`
rm -rf `find ./node_modules/express -name depd -print`
rm -rf `find ./node_modules/send -name depd -print`
rm -rf `find ./node_modules/body-parser -name depd -print`
rm -rf `find ./node_modules/graphql-upload -name depd -print`
rm -rf `find ./node_modules/http-errors -name depd -print`
rm -rf `find ./node_modules/hsts -name depd -print`
rm -rf `find ./node_modules/helmet -name depd -print`

rm -rf ./node_modules/mssql/node_modules/tedious
cp ./node_modules/depd/lib/browser/index.js ./node_modules/depd
