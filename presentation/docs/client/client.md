---
id: client
title: Web Client
sidebar_label: Web Client
---

Many SPA applications are written with a framework like React or Angular. The choice here is react, which is commercially popular. US government groups like angular.

If you are writing a corporate application it is likely you are using a widget library that has many basic components and perhaps, a few advanced components. There are many widget libraries available and most of them support React.

Bespoke applications may build up their own components in order to target an unique look and feel.

Integrating scala.js into an existing javascript client involves:

- Adding the scala.js output artifact ("module") to the build process.
  - Usually, add the scala.js output to the bundler configuration.
  - Each sbt project becomes a single javascript module.
  - Place the scala.js output module to be available in a well known location for the javascript build system to find--just like is done when using typescript or babel.
  - You can use different scala.js output module formats: ES or common work fine in most bundlers. But stick with ES, that's the future.
- Ensuring relevant facades are available.
  - scala.js libraries are normal jar files with embedded scala.js artifacts. They do not contain javascript code.
- Managing scala.js bundle size.

Current javascript frameworks are still moving quickly, lazy loading both data and code in a bid to build a responsive interface. scala.js output is usually large and cannot currently be loaded as flexibly as pure javascript.

Scala.js processing occurs in 2 phases:

- Compilation: Create scala.js specific and generic scala artifacts.
- Linking: Create the final javascript module. Linking combines all of the scala.js libraries and generates the code each time.

If you ever get stuck, you can often just read the scala.js code. It can be dense javascript because it contains java-style names for functions and variables. It's like reading java output from the jvm-based compiler--the code is full of artifacts from how scala compiles to the target system.

:::info
Its a debatable opinion, but if you are integrating into an existing web client, it is helpful to understand javascript bundling and build technologies. There will already be a build system, but knowing how javascript code is pulled apart and reassembled for delivery to the target client is very, very helpful in understanding how to integrate scala.js into an existing project.
:::

## Config Prelude 1: Bundling Scala.js Artifacts with Webpack

While `scalajs-bundler` is available, in complicated existing applications, webpack or something similar is probably easier. Existing applications won't use `scalajs-bundler` since they are probably typescript projects.

You need to ask the "front-end" typescript team to add the output `Scala.js` output artifact to their bulid:

Here's a verison for webpack:

```javascript
   // webpack config snippet
   modules: {
    rules: [
                 {
                    test: [/Scala\.js$/],
                    use: [
                        {
                            loader: "scalajs-friendly-source-map-loader",
                        }],
                    enforce: "pre",
                    exclude: [/node_modules/],
                },
                ...
    ]}
```

There are other tricks. The [`scalajs-fiendly-source-map-loader`](https://www.npmjs.com/package/scalajs-friendly-source-map-loader) can download and cache the embedded scala source maps _if_ you want to bundle them into the webpack generated code. Otherwise, its Ok to leave them as `http:` references and have your browser pull them in.

## Scala.js Facades to "Bring In" Javascript Libraries

You only have 2 choices to create a facade:

- Manual: Type in the facades. You can create highly ergonomic APIs this way.
- Automated: Use an automated tool like [scalablytyped.org](https://scalablytyped.org).

In general, the more scala.js features you pull in the larger the bundle. You can use javascript tools to measure bundle size and see what you are pulling in, but in generally, pulling in scala collections, scala Future, scala printf and libraries like cats or effects libraries like cats-effect and zio pull in large, hard-to-shrink dependencies that may make your scala.js file too large even after pruning and tree-shaking. Server-side is a different issue, you can have large scala.js modules and the size is less important.

However, on the client, size, load-speed and processing speed make a huge difference so you may be more constrained.

For example, using extension methods on `js.Promise` allow you to use this effect more easily. It's not perfect or great, nor purely functional, but when integrating `js.Promise`s being generated from multiple APIS, conversion to scala data structures can be preversely unnecessary and confusing, e.g., using `mypromise.toFuture` everywhere.

:::danger
If you are only combining several promises or less, its probably not worth the size or processing overhead of a client-side effects library. If you are using an existing graphql client, you may need to deal with effects directly at all and can just use extension methods on `js.Promise`.
:::

Facades are critical. Converting to and from scala data structures to javascript structures can be expensive unless you use scala.js interop types from the start.

:::danger
If you are pulling data from a server then injecting it into a component library that expects javascript types, determine whether its worth converting the data to scala data structures at all. It's probably not.
:::

## Config Prelude 2: Integrating into Javacript Build Systems

Webpack, parcel, and rollup are popular choices. They all pretty much do the same thing though:

- Parse javascript code, CSS and html files.
- Create a source code dependency graph.
- Prune the graph and tree-shake the code to reduce bundle size.
- Reassemble artifacts after passing them through a series of "plugins."

Most of the confusion around bundling scala.js artifacts into the existing web client system occur here. You need to remember that despite outputing a javascript "module" from the scala.js compiler, it will be "compiled" again and the `@JSImport` dependencies processed to create the source graph.

In many cases you can "name" your scala.js module differently either by changing the filename or using an "alias" in the build system.

You also have two choices to present your scala.js output artifact to an existing build system:

- Expect the build system to look for the module in your project folder.
- Copy it from your scala build project folder to the target location it is expected.

There are other ways such as a much more loosely coupled multiple-repo approach in which case you have an even more complicated setup.

While the scala.js artifact is generated from scala, the target typescript project should check thet source in so the front-end can be built without re-running the scala part. Typescript compile/edit iterations are generally shorter than scala compile/edit iterations.

:::tip
If you can co-locate the scala project in the same repo, its easier to copy from the scala folder to the webpack folder. This way,
the existing web client can decide how to version control or manage the file so it can build independent of a scala build.
:::

### GraphQL => Scala.js

You have alot of client choices for graphql client access to a graphql server.

Lately, there has been alot of development around a zio-based server and client. Obviously, it relies on zio. Using zio in the client may or may not meet requirements for buildsize. Here's some choices:

- Code first:
  - [caliban](https://github.com/ghostdogpr/caliban): zio based server and client
- Schema first:
  - apollo graphql client: slinky based code generator
  - [graphql-codegen-scala](https://github.com/aappddeevv/graphql-codegen-scala): code generate graphql general purpose scala.js data structures. Also for apollo graphql server but generates generic code not dependent on any framework.

The basic idea is that there is a "spec" that specifies graphql operations, such as a query or mutation, and you an generate alittle or alot of the data structures/code needed to make remote calls. This is pretty standard practice around gRPC and protobuf.

You need access to the schema which you can pull from a graphql endpoint if you have permissions or access the schema source. There is alot of variability in how schema's can be physically accessed so your scala build process may be quite involved.

Similar to the `graphql-codegen` used to generate graphql bindings for typescript, you can generate them for scala.js:

```yaml
overwrite: true
schema: ../server/src/schema.graphql
documents:
  - ../client/src/graphql/*.graphql
  - ./client/src/main/graphql/*.graphql
config:
  scalars:
    Plot: js.Object
    JSON: String
    JSONObject: js.Object
hooks:
  afterOneFileWrite:
    - scalafmt
generates:
  client/target/scala-2.13/src_managed/main/cli_codegen/graphql.scala:
    plugins:
      - "@aappddeevv/graphql-codegen-scala-operations"
      - add: "// DO NOT EDIT - automatically generated, edits will be lost"
      - add: "package app\npackage client\npackage graphql"
    config:
      gqlImport: "apollo_boost._#gql"
      addTypename: "always"
      addGenericConversionExtensionMethod: "app.client.graphql.schema"
  client/target/scala-2.13/src_managed/main/cli_codegen/graphql-schema.scala:
    plugins:
      - "@aappddeevv/graphql-codegen-scala-schema"
      - add: "// DO NOT EDIT - automatically generated, edits will be lost"
      - add: "package app\npackage client\npackage graphql\npackage schema"
    config:
      addTypename: "always"
      includeSchemaGenerics: true
```

You may also notice the output paths have hard-coded scala sbt paths in it.
When there is heavy interop with javascript tooling, this is normal.

:::tip
A configuration programming language may be helpful ([dhall](https://github.com/travisbrown/dhallj)). Or, a template generation system could also be used. It may be difficult and un-economic to create build tool plugins.
:::

## Additional UI Application Considerations

- Routing: SPAS use client side routing. You may need build constants such as the public url path or other data to create navigation paths. The latest `react-router6` makes this much easier, but you may still need constants injected into your code.
  - Web apps usually have a "config" file that varies by deployment type (i.e. production vs development). You may need a facade for it.
- Javascript processing may pass from typescript to babel so there could be two major compilers involved. Tracking imports and more importantly
  source-maps through these layers can be extremely difficult.

* While the jvm world has had a fairly regular packaging and source code management enviroment for a long time, that's not true for
  javascript client applications. Change velocity is faily high even though many build and UI environments have been around for several
  years.
* Make sure your javascript package versions your facades are desgined for the target versions in the client.

:::tip
If you are really going to integrate scala.js into the front-end world, embrace this complexity and realize that any complaints you have
around the scala build and versioning issues are, I think, trivial compared to those encountered in the javascript world. It's scary
but embrace the scariness.
:::
