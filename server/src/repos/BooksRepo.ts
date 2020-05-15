import { Books } from "../db"
import * as _ from "lodash"

export class BooksRepo {
  public findAll = async () => Books
  public findById = async (id: string) => _.find(Books, (item) => item.id === id)
}
