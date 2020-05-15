import cache, { CacheClass } from "memory-cache"
import { Request, Response, NextFunction, Send, Application } from "express"
import { logger } from "./config"

const memcache = new cache.Cache<string, any>()
export type Cache = CacheClass<string, any>
export { memcache as cache }

/** Environment for database access. Added to each request. */
export interface Environment {
  cache: Cache
}

export const environment: Environment = {
  cache,
  // add database connection pools here, etc.
  // ...
}

/** Add `environment`, `cache` to app scope. */
export const applyMiddleware = (app: Application) => {
  logger.info("Adding environment and cache to application scope.")
  app.set("environment", environment)
  app.set("cache", cache)
  app
}

/** Add Environment to request scope. */
export const environmentMiddleware = (req: Request, resp: Response, next: NextFunction) => {
  req.environment = environment
  next()
}
