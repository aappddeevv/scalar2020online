import * as path from "path"
import * as C from "./config"
import express from "express"
import { applyMiddleware as enhanceScopes, environmentMiddleware } from "./environment"
import helmet from "helmet"
import { ApolloServer } from "apollo-server-express"
import typeDefs from "./typedefs"
import * as _ from "lodash"
import { logger } from "./config"
import compression from "compression"
import { DateTime } from "luxon"
import GraphQLJSON, { GraphQLJSONObject } from "graphql-type-json"
import cors from "cors"
import * as Books from "./resolvers/Books"
import * as Authors from "./resolvers/Authors"
import { Resolvers, QueryResolvers, AllowedColor } from "./generated/graphql"
import { ExpressContext } from "apollo-server-express/dist/ApolloServer"

const app = express()
app.use(helmet())
app.use(compression())
app.use(cors())
enhanceScopes(app)
app.use(environmentMiddleware)
app.use(express.json({}))

// healthcheck
app.get(["/hello"], (req, resp) => {
  resp.json({ status: "ok" })
})

// Serve up app and static content from statically served directories.
// Static content is relative to root
app.get("/", function (req, resp, next) {
  resp.redirect(`${C.SERVE_PATH}/hello.html`)
})
const static_options = {
  maxAge: 31557600000,
  index: ["hello.html"],
}
app.use(C.SERVE_PATH === "" ? "/public" : C.SERVE_PATH, express.static(path.join(__dirname, "public"), static_options))

const Query: QueryResolvers = {
  hello: () => "Hello World!",
  favoriteColor: () => AllowedColor.Red,
  ...Books.queries,
  ...Authors.queries,
}

const resolvers: Resolvers = {
  // allow opaque json to be sent
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
  Query,
  Book: Books.resolvers,
  Author: require("./scala-server").Authors.resolvers,
}

const apollo_server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (p: ExpressContext) => {
    const req = p.req
    return {
      environment: req.environment,
      cache: req.environment.cache,
      bookLoader: Books.makeBookLoader(),
      authorLoader: Authors.makeAuthorLoader(),
    }
  },
})

apollo_server.applyMiddleware({ app, cors: false, path: "/graphql" })

// SPA public path gets mapped to the same file
app.get([C.PUBLIC_PATH, `${C.PUBLIC_PATH}/*`], function (req, resp, next) {
  resp.sendFile(path.join(__dirname, "public", "app.html"))
})

logger.info(`Starting app server: ${DateTime.local().toRFC2822()}`)
app.listen(C.PORT, C.HOST, () => {
  logger.info("  App is running on http://%s:%d%s in %s mode", C.HOST, C.PORT, C.ROOT, C.MODE)
  logger.info("  Press CTRL-C to stop\n")
})
