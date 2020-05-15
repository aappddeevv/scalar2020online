import { Authors } from "../db"
import * as _ from "lodash"

export class AuthorsRepo {
  public findAll = async () => Authors
  public findById = async (id: string) => _.find(Authors, (item) => item.id === id)
}
