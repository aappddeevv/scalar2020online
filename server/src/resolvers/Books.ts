import * as _ from "lodash"
import DataLoader from "dataloader"
import { DbBook, Books } from "../db"
import { BooksRepo } from "../repos"
import { Book, BookResolvers, QueryResolvers } from "../generated/graphql"
import { booksNeeded } from "./Authors"

export const makeBookLoader = () =>
  new DataLoader<string, DbBook>(async function (ids: Array<string>) {
    const results = _.filter(Books, (b) => ids.includes(b.id))
    const omap = _.keyBy(results, "id")
    const rval = ids.map((id) => omap[id])
    return rval
  })

/** Type needed for processing hierachically and passing
 * processing information through the "parent" object. Think
 * of it is a "header" used to direct "graph processing."
 *
 * You should not be passing processing logic
 * through the context, which should be considered immutable
 * and value resolution order is not guaranteed.
 *
 * You can also use a "repo" or dataloader object that returns
 * exactly what you need from the topmost resolver, you have
 * choices.
 *
 * For small enough graphql entities that are aligned with the database,
 * you can just use the graphql types directly.
 */
export type BookModel = Book & { fetchAuthors: Boolean; authorids: string[] }

/** `Add fetchAuthors: true` */
export const authorsNeeded = (book: DbBook): BookModel => ({ ...book, fetchAuthors: true, authors: [] })

export const queries: QueryResolvers = {
  allBooks: async (parent, args, context, info) => {
    const repo = new BooksRepo()
    return repo.findAll().then((books) => books.map(authorsNeeded))
  },
  book: async (parent, { id }, { bookLoader }, info) => bookLoader.load(id).then(authorsNeeded),
}

export const resolvers: BookResolvers = {
  authors: async (book, args, { authorLoader }, info) => {
    return book.fetchAuthors
      ? Promise.all(book.authorids.map((id) => authorLoader.load(id).then(booksNeeded)))
      : // no need to fetch
        Promise.resolve([])
  },
}
