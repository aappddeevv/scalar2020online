---
id: serverconfig
title: Server Config
---

An apollo graphql server can be created in a dozen lines or so but that's true for most PLs today.

The config includes:

- resolvers
- queries
- mutations
- subscriptions (skipped in this application)

```typescript
const Query: QueryResolvers = {
  hello: () => "Hello World!",
  favoriteColor: () => AllowedColor.Red,
  ...Books.queries,
  ...Authors.queries,
};

const resolvers: Resolvers = {
  // allow opaque json to be sent
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
  Query,
  Book: Books.resolvers,
  // VVVVVVVVVVVVVVVVVVVV scala part here VVVVVVVVVVVVVVVVVVVVVVVV
  Author: require("./scala-server").Authors.resolvers,
};

const apollo_server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (p: ExpressContext) => {
    const req = p.req;
    return {
      environment: req.environment,
      cache: req.environment.cache,
      bookLoader: Books.makeBookLoader(),
      authorLoader: Authors.makeAuthorLoader(),
    };
  },
});
```

In this application, we are going to slice in a very small slice of scala to provide a resolver for the Author object.
