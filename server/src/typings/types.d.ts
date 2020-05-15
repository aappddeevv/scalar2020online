import { Environment } from "../environment"

// add to Request
declare global {
  namespace Express {
    interface Request {
      environment: Environment
    }
  }
}
