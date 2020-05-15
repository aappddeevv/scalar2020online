import * as React from "react"
import { IColumn, Link } from "office-ui-fabric-react"
import { get } from "lodash"

/** Create a IColumn onRender function that uses fieldName for the title property
 * and the thunk to generate the nav point.
 * lodash is used so idpath can be a dotted path.
 */
export function renderLink<T>(idpath: string, nav: (to: string) => void) {
  return (item: T, idx: number, col: IColumn) => {
    const text = get(item, col.fieldName)
    return (
      <Link
        onClick={(e) => {
          e.preventDefault()
          nav(get(item, idpath))
        }}
      >
        {text}
      </Link>
    )
  }
}

/** Show this id data is missing. */
export const missing = "--"
