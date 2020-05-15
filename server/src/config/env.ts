import config from "config"

/** ROOT. Routers are attached to "ROOT/*" */
export const ROOT: string = config.get("server.root")
/** ROOT suitable for path route specification. */
export const ROOT_PATH: string = `${ROOT}/*`
export const PORT: number = config.get("server.port")
export const HOST: string = config.get("server.host")
/** Essentially NODE_ENV and defaulting to "development" */
export const MODE: string = process.env.NODE_ENV ?? "development"

function getBool(value: string | boolean) {
  return typeof value === "string" ? value === "true" : value
}

const path: string = config.get("server.publicPath")
/** Should have leading slash but *no* trailing slash. If its just
 * a slash then its transformed to an empty string.
 */
//export const PUBLIC_PATH: string = path
export const PUBLIC_PATH: string = path === "/" ? "" : path
/** Should have leading slash but *no* trailing slash. */
export const SERVE_PATH: string = config.get("server.servePath")

export const GRAPHQL: string = config.get("graphql.schemaFile")

/** App named used throughout the server. */
export const NAME = "app"
