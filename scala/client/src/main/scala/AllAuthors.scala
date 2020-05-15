package app
package client

import scala.scalajs.js
import js.|
import js.annotation._
import org.scalajs.dom

import react._
import react.implicits._
import fabric._
import fabric.styling._
import fabric.components._
import apollo_boost._
import react_apollo._
import vdom._
import vdom.styling._
import react_router6.useNavigate

object AllAuthors {
  val NAME = "AllAuthors"
  import client.graphql.{AllAuthorsOpQuery => Q}
  val GQL = UseQuery[Q.Data, Nothing]()
  import GQL._
  type ItemType = Q.Data.AllAuthors_Author
  val emptyArray = js.Array[ItemType]()

  trait Props extends js.Object {
    var className: js.UndefOr[String] = js.undefined
  }

  def apply(props: Props) = render.elementWith(props)

  @JSExportTopLevel("AllAuthors")
  val render: ReactFC[Props] = props => {
    val nav = useNavigate()
    val gql = useQuery(Q.operation)

    val data = gql.data.map(_.allAuthors) getOrElse emptyArray

    div(new DivProps {
      className = props.className
      style = new StyleAttr {
        height = "100%"
      }
    })(
      Text(new Text.Props {
        variant = Text.Variant.large
      })("AllAuthors"),
      Details.Shimmered[ItemType](new Details.Shimmered.Props[ItemType] {
        constrainMode = Details.ConstrainMode.horizontalConstrained
        layoutMode = Details.LayoutMode.fixedColumns
        enableShimmer = gql.loading
        val items = data
        columns = js.Array(
          new IColumn {
            val key = "id"
            val name = "Id"
            val minWidth = 50
            fieldName = "id"
          },
          new IColumn {
            val key = "name"
            val name = "Name"
            val minWidth = 100
            fieldName = "name"
            onRender = IColumn.OnRender(renderers.renderLink[ItemType]("id", id => nav(s"/authors/$id")))
          }
        )
      })
    )
  }
  render.displayName(NAME)
}
