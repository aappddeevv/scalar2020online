package app

import scala.scalajs.js
import js.|

package object server {

  /** Graphql resolvers which always returns an effect.
    * Use this type if you declare your function as a val
    * or just use `def` directly.
    */
  type Resolver[P, A, C, I, O] = js.Function4[P, A, C, I, js.Thenable[O]]

}
