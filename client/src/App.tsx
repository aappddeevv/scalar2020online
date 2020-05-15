import * as React from "react"
import { InvalidURL } from "./InvalidURL"
import { Home } from "./Home"
import { AllBooks, Books, Book } from "./books"
import { client } from "./client"
import { ApolloProvider } from "@apollo/react-hooks"
import { Routes, Route } from "react-router"
import { Layout } from "./Layout"
import { AllAuthors, Authors, Author } from "./generated/Scala"

/** Main routes using react-router6. */
export function App() {
  return (
    <ApolloProvider client={client}>
      <Routes basename={process.env.PUBLIC_PATH}>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="books/*" element={<Books />}>
            <Route path="/" element={<AllBooks />} />
            <Route path=":id" element={<Book />} />
          </Route>
          <Route path="authors/*" element={<Authors />}>
            <Route path="/" element={<AllAuthors />} />
            <Route path=":id" element={<Author />} />
          </Route>
          <Route path="*" element={<InvalidURL />} />
        </Route>
      </Routes>
    </ApolloProvider>
  )
}
