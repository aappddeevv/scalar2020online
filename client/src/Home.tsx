import * as React from "react"
import { Text } from "office-ui-fabric-react"
import { Link } from "react-router-dom"

export interface Props {}

export function Home(props: Props) {
  return (
    <div>
      <Text variant={"large"}>
        Home Page
        <br />
        Awesome app!
      </Text>
      <div>
        <Link to="books">Books List</Link>
      </div>
      <div>
        <Link to="authors">Authors List</Link>
      </div>
    </div>
  )
}
