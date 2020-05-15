// Various ways to do this including using a module that does this all for you
import { gql } from "apollo-server-express"
import * as fs from "fs"
import * as path from "path"
import { GRAPHQL } from "./config"

const pathname = path.resolve(__dirname, GRAPHQL)

if (!fs.existsSync(pathname)) throw new Error(`Schema file ${pathname} cannot be found.`)

const typeDefs = gql(fs.readFileSync(pathname, "utf8"))

export default typeDefs
