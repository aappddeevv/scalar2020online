import * as React from "react"
import { Outlet } from "react-router"
import { Text, ITheme, IStyleFunctionOrObject, IStyle, classNamesFunction, styled } from "office-ui-fabric-react"

export interface Props {
  className?: string
  styles?: IStyleFunctionOrObject<StyleProps, Styles>
  theme?: ITheme
}

export function BooksBase(props: Props) {
  const cn = getClassNames(props.styles, { className: props.className, theme: props.theme! })
  return (
    <div className={cn.root}>
      <Text className={cn.header} variant="xLarge">
        Books Page!
      </Text>
      <div className={cn.body}>
        <Outlet />
      </div>
    </div>
  )
}

/** Books layout. Uses fabric styling. */
export const Books: React.FunctionComponent<Props> = styled<Props, StyleProps, Styles>(BooksBase, getStyles)

export interface StyleProps {
  className?: string
  theme: ITheme
}

export interface Styles {
  root: IStyle
  header: IStyle
  body: IStyle
}

function getStyles(props: StyleProps): Styles {
  const { className, theme } = props
  return {
    root: [
      {
        display: "flex",
        flexDirection: "column",
        height: "100%",
      },
      className,
    ],
    header: { flex: "0 0 auto" },
    body: { flex: "1 1 auto" },
  }
}

const getClassNames = classNamesFunction<StyleProps, Styles>()
