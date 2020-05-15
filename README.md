# Scalar2020 Online Project Example

This repo contains a full-stack project integrating

* scala.js: client and server contributions
* server: both app and api server
  * nodejs
  * graphql
  * express
* docusaurus: presentation
* client: javascript SPA client

The projects are interconnected as the scala project produces
artifacts needed by the server project. Generally, when
artifacts are needed elsewhere they are copied or 
directly output to the destination.

To see the presentation run docusaurus:

```sh
cd docusaurus
npm run start
```

The project has build steps that rely on some
beta products so it will not build for you from
scratch. The project will be updated once the
tools are generally available.

Build tools include:

* coursier
* sbt
* webpack
* npm scripts with nodejs
* scalablytype
* shell scripts

# License

[![GitHub license](https://img.shields.io/badge/license-MIT-lightgrey.svg?maxAge=2592000)](https://raw.githubusercontent.com/aappddeevv/scalar2020online/master/LICENSE)

MIT license.


