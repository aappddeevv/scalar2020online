---
id: resolvers
title: Queries and Resolvers
---

## Interop Prelude 1

To use the types from the graphql schema, we will use a schema first model. The other approach is code-first. This is typescript so we can use:

- [graphql-codegen](https://graphql-code-generator.com)

Here's some of the crazy types that are generated, but hey, it mostly works! When types are like this the typing error messages are hard to read!

```typescript
/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  String: Partial<Scalars["String"]>;
  AllowedColor: Partial<AllowedColor>;
  Book: BookModel;
  ID: Partial<Scalars["ID"]>;
  Author: AuthorModel;
  Int: Partial<Scalars["Int"]>;
  Boolean: Partial<Scalars["Boolean"]>;
  JSON: Partial<Scalars["JSON"]>;
  JSONObject: Partial<Scalars["JSONObject"]>;
}>;

export type AuthorResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["Author"] = ResolversParentTypes["Author"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  books?: Resolver<Array<ResolversTypes["Book"]>, ParentType, ContextType>;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
}>;

export type BookResolvers<
  ContextType = AppContext,
  ParentType extends ResolversParentTypes["Book"] = ResolversParentTypes["Book"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  title?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  authors?: Resolver<Array<ResolversTypes["Author"]>, ParentType, ContextType>;
  published?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
}>;
```

## Resolvers

Let's implement the "Book" resolvers in typescript. Given that data resolution
is really graph processing, "header" data helps guide processing and allows
for query optimization. For example, resolving entities at prior area
of the graph allows us to skip processing in some cases. But if the
optimization is not always available, you need processing metadata
to help you manage data management. That's what the illustrative `fetchAuthors`
attribute is for. We always need to return a `Book` but we need to add
the "metadata" to it as it winds it way through the resolution graph.

```typescript
export type BookModel = Book & { fetchAuthors: Boolean; authorids: string[] };

/** `Add fetchAuthors: true` */
export const authorsNeeded = (book: DbBook): BookModel => ({
  ...book,
  fetchAuthors: true,
  authors: [],
});

export const queries: QueryResolvers = {
  allBooks: async (parent, args, context, info) => {
    const repo = new BooksRepo();
    return repo.findAll().then((books) => books.map(authorsNeeded));
  },
  book: async (parent, { id }, { bookLoader }, info) =>
    bookLoader.load(id).then(authorsNeeded),
};

export const resolvers: BookResolvers = {
  authors: async (book, args, { authorLoader }, info) => {
    return book.fetchAuthors
      ? Promise.all(
          book.authorids.map((id) => authorLoader.load(id).then(booksNeeded))
        )
      : Promise.resolve(book.authors);
  },
};
```

Let's implement the resolve for the Authors in scala but implement only
some of it in typescript. The scala part will be finely cut-in to the
typescript parts:

```typescript
export const makeAuthorLoader = () =>
  new DataLoader<string, DbAuthor>(async function (ids: Array<string>) {
    const results = (_.filter(Authors, (b) =>
      ids.includes(b.id)
    ) as unknown) as DbAuthor[];
    const omap = _.keyBy(results, "id");
    const rval = ids.map((id) => omap[id]);
    return rval;
  });

export type AuthorModel = Author & { fetchBooks: boolean };

export const booksNeeded = (author: DbAuthor): AuthorModel => ({
  ...author,
  fetchBooks: true,
  books: [],
});

export const queries: QueryResolvers = {
  allAuthors: async (parent, args, context, info) => {
    const repo = new AuthorsRepo();
    return repo.findAll().then((authors) => authors.map(booksNeeded));
  },
  author: async (parent, { id }, { authorLoader }, info) =>
    authorLoader.load(id).then(booksNeeded),
};

// no resolvers!
```

## Interop Prelude 2 - It Gets Harder!

To use the typescript types in scala.js we need typescript types converted to scala code. You can use scalablytyped to convert an in-place typescript projeect into scala.js bindings:

- [scalablytyped](https://scalablytyped.org/docs/readme.html)

You get some funk module naming but it works:

```scala
package typings.scala

import typings.scala.dataMod.DbAuthor
import scala.scalajs.js
import scala.scalajs.js.`|`
import scala.scalajs.js.annotation._

@JSImport("scala/declarations/server/repos/AuthorsRepo", JSImport.Namespace)
@js.native
object authorsRepoMod extends js.Object {
  @js.native
  class AuthorsRepo () extends js.Object {
    def findAll(): js.Promise[js.Array[DbAuthor]] = js.native
    def findById(id: String): js.Promise[js.UndefOr[DbAuthor]] = js.native
  }

}
```

The `scala` package name is specific to the scalablytyped config. But its important to see that the part that will cause you trouble:

```scala
@JSImport("scala/declarations/server/repos/AuthorsRepo", JSImport.Namespace)
```

That path, when output to a scala.js artifact is imported via javascript mechanisms. When the scala.js module is imported it will resolve the import using javascript rules.

Hence you need to setup module aliases in nodejs. You can create a simple filesystem symbolic link to hadle that:

```sh
# in the "scala" project directory
mkdir -p node_modules/scala/declarations
ln -s ../../../dist node_modules/scala/declarations/server
```

This type of thinking, embedded import statements in scala.js code, must be used everywhere you use scala.js code. This is standard javascript config management but not common in the scala/jvm world.

## Scala at Last

Here's the resolver in scala (scala.js).

While its not obvious, some of the scalablytyped types are are generated from `graphql-codegen`. So there are types used here that run through 2 code generators.

- graphql => typescript
- typescript => scala.js

That can be a source of confusion.

```scala
import jshelpers.implicits._

// imports from scalablytyped generated bindings
import typings.scala.booksRepoMod.BooksRepo
import typings.scala.authorsMod.AuthorModel
import typings.scala.booksMod.{BookModel, authorsNeeded}
import typings.scala.contextMod.AppContext

@JSExportTopLevel("Authors")
@JSExportAll
object AuthorExports {
  // Look here! A plain untyped js.Object. Used for demonstration purposes.
  // Could use BookResolvers type generated from scalablytyped.
  val resolvers = new js.Object {
    // Notice how we use js.Any to mean "can work with any type in that slot"
    // We just use the repo and keep it simple, but this could be an expensive calculation.
    val books: Resolver[AuthorModel, js.Any, AppContext, js.Any, js.Array[BookModel]] =
      (p, a, c, i) => {
        val repo = new BooksRepo()
        // we map on a js.Promise using jshelpers extension methods, no Future conversion involved
        if (p.fetchBooks) repo.findAll().map(_.filter(_.authorids.contains(p.id)).map(authorsNeeded(_)))
        else js.Array().resolve
      }
  }
}
```

:::note

- It's just as short as the typescript code.
- It uses map on a `js.Promise`. Using simple extension methods makes javascript types more like scala friendly types.
- You can import types and functions from typescript. The above resolver use typescript artifiacts so you can compare this to the typescript `Books` resolver implementations.

:::

Obviously, on the server side you could use more sophisticated effects libraries to managed
concurrency (javascript is not parallel). zio is a good choice when things get complicated and zio runs on scala.js.

:::tip
Use a "manage complexity" argument and this type of example as support for justifying scala.
When you need to combine several actions at once, FP style effect programming may be
perceived as easier. The javascript `Promise` effect is like scala `Future`. Even with
a vast ecosystem of `Promise`-based frameworks, it may still be easier to integrate
disparate effects using scala and a "swiss-army knife" effects library.
:::
