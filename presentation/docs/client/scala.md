---
id: scalaclient
title: Scala Web Client
sidebar_label: Scala Web Client
---

## React

React is popular framework, the ecosystem is rapidly changing even today. For example, a new facebook-supported state management library was just released.

"State" management is a big topic and there alot of choices that you run into with existing projects (these are typescript state management libraries):

- [apollo graphql client](https://www.apollographql.com/docs/react/v3.0-beta): Baked in seamless into the client (v3).
- [redux](https://redux.js.org/)
- [mobx](https://mobx.js.org)
- react context/reducer (not really state management per se)
- [recoil](https://recoiljs.org/): pure functions, etc.
- ...1000 other state management libraries...

It's important to note that react recently had a big change:

- Function components, vs class components
  - components are now just functions, but not "pure"
- Hooks
  - reuse and management through functions that tie into the react runtime
- React concurrent
  - multi-priority rendering

If your 100% scala based check out things like [diode](https://github.com/suzaku-io/diode).

A react function component is just a function. You can think of it as a little "context bean" in the java world. It's not pure, but you could separate it out into a "backend" and pure rendering if you wanted to (there's even a module for that):

```typescript
function MyComponent(props) {
    // backend jumble - non pure
    // state mgmt, memoization, ...

    // pure rendering code
    ...
}
```

_The_ most import thing to realize in understanding react component is that react
separates out the description of the component from the processing of the component.
While components are not pure functions, it is a very FP way of thinking to treat
effects as values.

```javascript
const node = <MyComponent a={1} b ="blah" />

// is really
const node = createElement(MyComponent, { a, b})

// which returns a description of what is to be rendered
const node = { type: `FUNCTION_COMPONENT`, props: {a,b}, ...more react internal stuff...}
```

The react rendering engine then runs the "value" to render on the screen. There's general confusion around how the same functions are then used to re-render but there's alot of javascript/react talks on that already.

:::note
I am not necessarily a huge react fan but it seems to do the job and reduces
the amount of non-core work that I do.
:::

## Typescript React Client Code

Here's typescript for a component in the app for `AllBooks` relying on code generated from `graphql-codegen` and using [fluenti](https://developer.microsoft.com/en-us/fluentui).

```typescript
import { useAllBooksOpQuery } from "../generated/graphql";

export interface Props {
  className?: string;
}

export function AllBooks(props: Props) {
  const { loading, error, data } = useAllBooksOpQuery();
  const nav = useNavigate();
  const items = data?.allBooks ?? [];
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
  );
}
```

### Scala.js Client Code

There are quite a few react facades available, some highly disciplined. [scalajs-reaction](https://github.com/aappddeevv/scalajs-reaction) was created as simple facade that you could write yourself in a few minutes and has easy interop. For apps that must integrate with existing frameworks and toolkits, relying on scala data structures may not be optimal.

In `scalajs-reaction` a component is just a function:

```
type ReactFC[P] = js.Function1[P, ReactNode]

val aComponent: ReactFC[Props] = props => { ... }
```

The scala object wrapper and `def apply` are usability conventions.

Heres' the equivalent `AllAuthors` code in scala.js:

```scala
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
```

The function is exported from the module using `@JSExport` which operates just like calling `export` in javascript. That's all you need to do to allow the use of your scala.js code in javascript.

## Interop Prelude 1: Using scala.js Component in Typescript

To use scala.js components in typescript you need an interface module. There is no automatic scala.js export mechanism so you must do this manually:

```typescript
// Scala.d.ts right next to the artifact Scala.js
import * as React from "react";

export interface AuthorProps {
  className?: string;
}

export interface AllAuthorsProps {
  className?: string;
}

export interface AuthorsProps {
  className?: string;
}

export const Author: React.FunctionComponent<AuthorProps>;
export const AllAuthors: React.FunctionComponent<AllAuthorsProps>;
export const Authors: React.FunctionComponent<AuthorsProps>;
```
