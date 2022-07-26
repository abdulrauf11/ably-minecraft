import { useState } from "react"

export default function Overlay() {
  const [ready, set] = useState(false)

  return (
    <>
      <div className="dot" />
      <div className={`fullscreen bg ${ready ? "ready" : "notready"} ${ready && "clicked"}`}>
        <div className="stack">
          <button onClick={() => set(true)}>Click (needs fullscreen)</button>
        </div>
      </div>
    </>
  )
}
