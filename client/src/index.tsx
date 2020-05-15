import * as React from "react"
import * as ReactDOM from "react-dom"
import { initializeIcons, Fabric, mergeStyles } from "office-ui-fabric-react"
import { BrowserRouter } from "react-router-dom"
import { App } from "./App"

initializeIcons()

mergeStyles({
  selectors: {
    ":global(body)": {
      margin: 0,
      padding: 0,
      overflow: "hidden",
    },
  },
})

export function main({ id }: { id: string } = { id: "root" }) {
  const el = document.getElementById(id)
  if (el)
    ReactDOM.render(
      <Fabric>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Fabric>,
      el,
      () => {
        console.log(`React app rendered into ${id}`)
      }
    )
  else console.log(`Element with id ${id} not found.`)
}
