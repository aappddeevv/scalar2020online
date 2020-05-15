import * as React from "react"
import { useParams, useNavigate } from "react-router"
import {
  styled,
  ITheme,
  IStyle,
  classNamesFunction,
  ShimmeredDetailsList,
  ConstrainMode,
  DetailsListLayoutMode,
} from "office-ui-fabric-react"
import { IStyleFunctionOrObject } from "@uifabric/experiments/lib/Utilities"
import { renderLink, missing } from "../renderers"
import { useBookOpQuery } from "../generated/graphql"

export interface Props {
  id?: string
  className?: string
  theme?: ITheme
  styles?: IStyleFunctionOrObject<StyleProps, Styles>
}

export function BookBase(props: Props) {
  const nav = useNavigate()
  const cn = getClassNames(props.styles, { className: props.className, theme: props.theme! })
  const { id: pid } = useParams()
  const id = pid ?? props.id
  const { loading, error, data } = useBookOpQuery({ variables: { id } })
  const message: string | undefined = error ? "Error..." : undefined
  if (message) return <div className={cn.root}>message</div>

  const display_id = data?.book?.id ?? missing
  const title = data?.book?.title ?? missing
  const published = data?.book?.published ?? missing

  return (
    <div className={cn.root}>
      <div className={cn.field}>Id: {display_id}</div>
      <div className={cn.field}>Title: {title}</div>
      <div className={cn.field}>Published: {published}</div>
      <ShimmeredDetailsList
        className={cn.list}
        enableShimmer={loading}
        constrainMode={ConstrainMode.horizontalConstrained}
        layoutMode={DetailsListLayoutMode.fixedColumns}
        items={data?.book?.authors ?? []}
        columns={[
          { key: "id", minWidth: 100, name: "Id", fieldName: "id" },
          {
            key: "name",
            minWidth: 150,
            name: "Name",
            fieldName: "name",
            onRender: renderLink("id", (id) => nav(`/authors/${id}`)),
          },
        ]}
      />
    </div>
  )
}

/** Books layout. Uses fabric styling. */
export const Book: React.FunctionComponent<Props> = styled<Props, StyleProps, Styles>(BookBase, getStyles)

export interface StyleProps {
  className?: string
  theme: ITheme
}

export interface Styles {
  root: IStyle
  field: IStyle
  list: IStyle
}

function getStyles(props: StyleProps): Styles {
  const { className, theme } = props
  return {
    root: [
      {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        selectors: {
          "& > *": {
            marginTop: 20,
          },
        },
      },
      className,
    ],
    field: { flex: "0 0 auto" },
    list: { flex: "1 1 auto" },
  }
}

const getClassNames = classNamesFunction<StyleProps, Styles>()
