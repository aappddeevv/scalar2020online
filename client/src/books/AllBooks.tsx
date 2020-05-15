import * as React from "react"
import { Text, ShimmeredDetailsList, ConstrainMode, DetailsListLayoutMode } from "office-ui-fabric-react"
import { renderLink } from "../renderers"
import { useNavigate } from "react-router"
import { useAllBooksOpQuery } from "../generated/graphql"

export interface Props {
  className?: string
}

export function AllBooks(props: Props) {
  const { loading, error, data } = useAllBooksOpQuery()
  const nav = useNavigate()
  const items = data?.allBooks ?? []
  return (
    <div
      className={props.className}
      style={{
        height: "100%",
      }}
    >
      <Text variant="large">AllBooks</Text>
      <ShimmeredDetailsList
        items={items}
        constrainMode={ConstrainMode.horizontalConstrained}
        layoutMode={DetailsListLayoutMode.fixedColumns}
        enableShimmer={loading}
        columns={[
          {
            key: "id",
            name: "Id",
            minWidth: 50,
            fieldName: "id",
          },
          {
            key: "title",
            name: "Title",
            minWidth: 100,
            maxWidth: 300,
            fieldName: "title",
            onRender: renderLink("id", nav),
          },
          {
            key: "published",
            name: "Year Publish",
            minWidth: 75,
            maxWidth: 100,
            fieldName: "published",
          },
        ]}
      />
    </div>
  )
}
