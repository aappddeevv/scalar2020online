package app
package client

import scala.scalajs.js
import js.|
import js.annotation._

import react._
import react.implicits._
import fabric._
import fabric.styling._
import fabric.merge_styles._
import fabric.components._
import apollo_boost._
import react_apollo._
import react_router6._
import vdom._

@js.native
trait HasId extends js.Object {
  val id: String
}

object Author {
  val NAME = "Author"
  import app.client.graphql.{AuthorOpQuery => Q}

  type ItemType = Q.Data.Author_Author.Books_Book
  val emptyArray = js.Array[ItemType]()
  val GQL = UseQuery[Q.Data, Q.Variables]()
  import GQL._

  trait Props extends js.Object {
    var className: js.UndefOr[String] = js.undefined
    var styles: js.UndefOr[IStyleFunctionOrObject[StyleProps, Styles]] = js.undefined
  }

  def apply(props: Props) = render.elementWith(props)

  @JSExportTopLevel("Author")
  val render: ReactFC[Props] = props => {
    val nav = useNavigate()
    val params = useParams[HasId]()
    val cn = getClassNames(new StyleProps {
      className = props.className
    }, props.styles)
    val gql = useQuery(Q.operation, GQL.makeOptions(variables = Q.Variables(params.id)))

    val author = gql.data.flatMap(_.author.absorbNull)
    val id = author.map(_.id) getOrElse renderers.missing
    val name = author.map(_.name) getOrElse renderers.missing
    val books = author.map(_.books) getOrElse emptyArray

    divWithClass(
      cn.root,
      divWithClass(cn.field, s"Id: $id"),
      divWithClass(cn.field, s"Name: $name"),
      Details.Shimmered[ItemType](new Details.Shimmered.Props[ItemType] {
        className = cn.list
        enableShimmer = gql.loading
        constrainMode = Details.ConstrainMode.horizontalConstrained
        layoutMode = Details.LayoutMode.fixedColumns
        val items = books
        columns = js.Array(
          new IColumn {
            val key = "id"
            val name = "Id"
            val minWidth = 100
            fieldName = "id"
          },
          new IColumn {
            val key = "title"
            val name = "Title"
            val minWidth = 150
            fieldName = "title"
            onRender = IColumn.OnRender[ItemType](renderers.renderLink[ItemType]("id", id => nav(s"/books/$id")))
          },
          new IColumn {
            val key = "published"
            val name = "Published"
            val minWidth = 100
            fieldName = "published"
          }
        )
      })
    )
  }
  render.displayName(NAME)

  @deriveClassNames trait Styles extends IStyleSetTag {
    var root: js.UndefOr[IStyle] = js.undefined
    var field: js.UndefOr[IStyle] = js.undefined
    var list: js.UndefOr[IStyle] = js.undefined
  }

  trait StyleProps extends js.Object {
    var className: js.UndefOr[String] = js.undefined
    var theme: js.UndefOr[ITheme] = js.undefined
  }

  val getStyles = stylingFunction[StyleProps, Styles] { props =>
    val th = props.theme getOrElse fabric.styling.module.getTheme()
    new Styles {
      root = stylearray(
        new IRawStyle {
          display = "flex"
          flexDirection = "column"
          height = "100%"
          selectors = selectorset(
            "& > *" -> new IRawStyle {
              marginTop = 20
            }
          )
        },
        props.className
      )
      field = new IRawStyle { flex = "0 0 auto" }
      list = new IRawStyle { flex = "1 1 auto" }
    }
  }

  val getClassNames: GetClassNamesFn[StyleProps, Styles, ClassNames] =
    (p, s) => mergeStyleSets(concatStyleSetsWithProps(p, s, getStyles))

}
