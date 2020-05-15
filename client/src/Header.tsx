import * as React from "react"
import {
  IStyle,
  IStyleFunctionOrObject,
  Label,
  classNamesFunction,
  styled,
  ITheme,
  PeoplePickerItem,
} from "office-ui-fabric-react"
import { warnConditionallyRequiredProps } from "@uifabric/experiments/lib/Utilities"

export interface Props {
  title?: string
  className?: string
  styles?: IStyleFunctionOrObject<StyleProps, Styles>
  theme?: ITheme
}

function HeaderBase({ className, styles, theme, title }: Props) {
  const cn = getClassNames(styles, { className, theme: theme! })

  return (
    <header className={cn.root}>
      <Label className={cn.title}>{title ?? "App"}</Label>
    </header>
  )
}

/** Header. Uses fabric styling. */
export const Header: React.FunctionComponent<Props> = styled<Props, StyleProps, Styles>(HeaderBase, getStyles)

export interface StyleProps {
  className?: string
  theme: ITheme
}

export interface Styles {
  root: IStyle
  title: IStyle
}

function getStyles(props: StyleProps): Styles {
  const { className, theme } = props
  return {
    root: [
      {
        height: 42,
        backgroundColor: theme.palette.themeLighter,
        color: "white",
        display: "flex",
        alignItems: "center",
      },
      className,
    ],
    title: {
      marginLeft: 20,
      fontSize: 20,
      color: theme.semanticColors.bodyText,
    },
  }
}

const getClassNames = classNamesFunction<StyleProps, Styles>()
