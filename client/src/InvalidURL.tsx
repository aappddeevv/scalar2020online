import * as React from "react"
import { PrimaryButton, Text } from "office-ui-fabric-react"
import { useNavigate } from "react-router"

export interface Props {
  message?: string
  className?: string
}

/**
 * Show page when invalid URL. Uses inline styling.
 */
export function InvalidURL(props: Props) {
  const nav = useNavigate()
  return (
    <div
      className={props.className}
      style={{
        display: "flex",
        flexDirection: "column",
        flex: "1 1 auto",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Text style={{ marginBottom: 20 }} variant={"large"}>
        Invalid URL!
        <br />
        {props.message ?? "Where were you going?"}
      </Text>
      <PrimaryButton text="Home" onClick={() => nav("/")} />
    </div>
  )
}
