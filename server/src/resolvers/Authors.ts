import * as _ from "lodash"
import DataLoader from "dataloader"
import { DbAuthor, Authors } from "../db"
import { Author, QueryResolvers } from "../generated/graphql"
import { AuthorsRepo } from "../repos/AuthorsRepo"

export const makeAuthorLoader = () =>
  new DataLoader<string, DbAuthor>(async function (ids: Array<string>) {
    const results = (_.filter(Authors, (b) => ids.includes(b.id)) as unknown) as DbAuthor[]
    const omap = _.keyBy(results, "id")
    const rval = ids.map((id) => omap[id])
    return rval
  })

export type AuthorModel = Author & { fetchBooks: boolean }

export const booksNeeded = (author: DbAuthor): AuthorModel => ({ ...author, fetchBooks: true, books: [] })

export const queries: QueryResolvers = {
  allAuthors: async (parent, args, context, info) => {
    const repo = new AuthorsRepo()
    return repo.findAll().then((authors) => authors.map(booksNeeded))
  },
  author: async (parent, { id }, { authorLoader }, info) => authorLoader.load(id).then(booksNeeded),
}

// resolvers for books from scala world
// see scala code
