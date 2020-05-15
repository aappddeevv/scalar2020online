package app
package server

import scala.scalajs.js
import js.|
import js.annotation._
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
