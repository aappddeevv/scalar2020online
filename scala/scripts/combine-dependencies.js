// designed to be run in toplevel scala project directory
// node ./scripts/combine-dependencies.js
// reads parent package.json and enhances it with
// packages from the client and server project so that
// scalablytyped will pick them up properly.
//
const fs = require("fs")

const pfile = "package.json"
console.log(`Augmenting ${pfile}.`)
const combine = (p1, p2) => Object.assign({}, p1, p2)
const read = (pfile) => JSON.parse(fs.readFileSync(pfile, "utf-8"))
const package = read(pfile)
const p1 = read("../client/package.json").dependencies
const p2 = read("../server/package.json").dependencies
const p3 = combine(p1, p2)
package.dependencies = combine(p3, package.dependencies)
fs.writeFileSync(pfile, JSON.stringify(package, undefined, 3), "utf-8")
