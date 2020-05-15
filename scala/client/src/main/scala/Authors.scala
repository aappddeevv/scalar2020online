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
import vdom._
import react_router6.Outlet
import fabric.hooks._

//
object Authors {
  val NAME = "Authors"
  trait Props extends js.Object {
    var className: js.UndefOr[String] = js.undefined
    var styles: js.UndefOr[IStyleFunctionOrObject[StyleProps, Styles]] = js.undefined
  }

  def apply(props: Props) = render.elementWith(props)

  @JSExportTopLevel("Authors")
  val render: ReactFC[Props] = props => {
    val gtheme = useTheme()
    val cn = getClassNames(new StyleProps {
      className = props.className
      theme = gtheme
    }, props.styles)

    divWithClass(
      cn.root,
      //
      Text(new Text.Props {
        className = cn.header
        variant = Text.Variant.xLarge
      })("Authors Page!"),
      //
      divWithClass(cn.body, Outlet()))
  }
  render.displayName(NAME)

  @deriveClassNames trait Styles extends IStyleSetTag {
    var root: js.UndefOr[IStyle] = js.undefined
    var header: js.UndefOr[IStyle] = js.undefined
    var body: js.UndefOr[IStyle] = js.undefined
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
        },
        props.className
      )
      header = new IRawStyle { flex = "0 0 auto" }
      body = new IRawStyle { flex = "1 1 auto" }
    }
  }

  val getClassNames: GetClassNamesFn[StyleProps, Styles, ClassNames] =
    (p, s) => mergeStyleSets(concatStyleSetsWithProps(p, s, getStyles))

}
