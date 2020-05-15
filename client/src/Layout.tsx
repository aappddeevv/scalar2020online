import * as React from "react"
import { Header } from "./Header"
import { IStyle, ITheme, IStyleFunctionOrObject, classNamesFunction, styled } from "office-ui-fabric-react"
import { Sidebar } from "@uifabric/experiments"
import { useNavigate, Outlet, Routes, Route } from "react-router"

export interface Props {
  className?: string
  styles?: IStyleFunctionOrObject<StyleProps, Styles>
  theme?: ITheme
}

/** Main layout using fabric styling. */
export function LayoutBase(props: Props) {
  const cn = getClassNames(props.styles, { className: props.className, theme: props.theme! })
  const nav = useNavigate()
  return (
    <div className={cn.root}>
      <Header className={cn.header} />
      <main className={cn.main}>
        <Sidebar
          className={cn.nav}
          theme={props.theme!}
          collapsible={true}
          collapseButtonAriaLabel="sitemap"
          items={[
            { key: "home", name: "Home", iconProps: { iconName: "Home" }, onClick: () => nav("/") },
            { key: "books", name: "Books", iconProps: { iconName: "BookAnswers" }, onClick: () => nav("books") },
            { key: "authors", name: "Authors", iconProps: { iconName: "Handwriting" }, onClick: () => nav("authors") },
          ]}
        />
        <div className={cn.content}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export const Layout: React.FunctionComponent<Props> = styled<Props, StyleProps, Styles>(LayoutBase, getStyles)

export interface StyleProps {
  className?: string
  theme: ITheme
}

export interface Styles {
  root?: IStyle
  header?: IStyle
  main?: IStyle
  nav?: IStyle
  content?: IStyle
}

function getStyles(props: StyleProps): Styles {
  return {
    root: {
      display: "grid",
      gridTemplateRows: "40px 1fr",
      gridTemplateAreas: `
      "header"
      "main"`,
      height: "100%",
    },
    header: { gridArea: "header" },
    main: { gridArea: "main", display: "flex" },
    nav: { flex: "0 0 auto" },
    content: { flex: "1 1 auto" },
  }
}

const getClassNames = classNamesFunction<StyleProps, Styles>()
