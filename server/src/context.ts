import { Environment } from "./environment"
import DataLoader from "dataloader"
import { DbBook, DbAuthor } from "./db"

export interface AppContext {
  environment: Environment
  bookLoader: DataLoader<string, DbBook>
  authorLoader: DataLoader<string, DbAuthor>
}
