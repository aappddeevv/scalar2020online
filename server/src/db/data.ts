// data as it comes from the "database"
// this is different than the type declaration for graphql
// the graphql resolvers will need to resolve the differences

export type DbBook = {
  id: string
  title: string
  authorids: string[]
  published: number
}

export type DbAuthor = {
  id: string
  name: string
}

export const Books: DbBook[] = [
  {
    id: "1",
    title: "Redefining Healthcare",
    authorids: ["1", "4"],
    published: 2006,
  },
  {
    id: "2",
    title: "IT Governance",
    authorids: ["2", "3"],
    published: 2004,
  },
]

export const Authors: DbAuthor[] = [
  {
    id: "1",
    name: "Michael Porter",
  },
  {
    id: "2",
    name: "Peter Weill",
  },
  {
    id: "3",
    name: "Jeanne Ross",
  },
  {
    id: "4",
    name: "Elizabeth Teisberg",
  },
]
