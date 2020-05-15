import ApolloClient from "apollo-boost"
import { InMemoryCache } from "apollo-cache-inmemory"

const stripLastSlash = (s: string) => (s.slice(-1) === "/" ? s.substr(0, s.length - 1) : s)

const publicPath = stripLastSlash(process.env.PUBLIC_PATH ?? "")

const path = publicPath + "/graphql"

/** Apollo client. */
export const client = new ApolloClient({
  uri: path,
  cache: new InMemoryCache(),
})
