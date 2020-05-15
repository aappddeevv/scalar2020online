---
id: db
title: Graphql Model and Database
---

## Graphql Schema

This app has a simple graphql schema. You should think of the "Query" part of the graphql schema as the routes.

```json
type Query {
  hello: String

  favoriteColor: AllowedColor!

  allBooks: [Book!]!
  book(id: ID!): Book

  allAuthors: [Author!]!
  author(id: ID!): Author
}

type Book {
  id: ID!
  title: String!
  authors: [Author!]!
  published: Int!
}

type Author {
  id: ID!
  name: String!
  books: [Book!]!
}

enum AllowedColor {
  RED
  GREEN
  BLUE
  ORANGE
}
```

Graphql resolvers form a data resolution graph. Your resolvers provide a small part of the overall object being constructed based on the request and resolution can take different paths depending on the data requested.

:::note
In fact, some the hardest parts of working with graphql is trying to prove that
all of your data will actually resolve in the graph, it less so about types.
:::

## Database

Our database schema and database looks like the below. The database and graphql types are different, e.g., `DbAuthor` does not have `books` like it does for graphql.

```typescript
export type DbBook = {
  id: string;
  title: string;
  authorids: string[];
  published: number;
};

export type DbAuthor = {
  id: string;
  name: string;
};

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
];

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
];
```

:::note
The database schema and the graphql schema are similar but not the same
no our graphql resolvers must factor this in--this is the usual scenario.
:::
