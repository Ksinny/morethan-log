import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { ExtendedRecordMap } from "notion-types"
import useScheme from "src/hooks/useScheme"

// core styles shared by all of react-notion-x (required)
import "react-notion-x/src/styles.css"

// used for rendering equations (optional)
import "katex/dist/katex.min.css"
import { FC, useEffect } from "react"
import styled from "@emotion/styled"

const _NotionRenderer = dynamic(
  () => import("react-notion-x").then((m) => m.NotionRenderer),
  { ssr: false }
)

const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then(async (m) => {
    await Promise.all([
      import("prismjs/components/prism-java.js"),
      import("prismjs/components/prism-sql.js"),
      import("prismjs/components/prism-python.js"),
      import("prismjs/components/prism-markdown.js"),
      import("prismjs/components/prism-bash.js"),
      import("prismjs/components/prism-diff.js"),
      import("prismjs/components/prism-yaml.js"),
    ])
    return m.Code as any
  })
)

const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection
  )
)
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
)
const Pdf = dynamic(
  () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
  {
    ssr: false,
  }
)
const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  {
    ssr: false,
  }
)

const mapPageUrl = (id: string) => {
  return "https://www.notion.so/" + id.replace(/-/g, "")
}

type Props = {
  recordMap: ExtendedRecordMap
}

type StyledWrapperProps = {
  currentScheme: string
}

const NotionRenderer: FC<Props> = ({ recordMap }) => {
  const [scheme] = useScheme()

   useEffect(() => {
    const id = "prism-theme"
    let link = document.getElementById(id) as HTMLLinkElement | null
    if (!link) {
      link = document.createElement("link")
      link.id = id
      link.rel = "stylesheet"
      document.head.appendChild(link)
    }
    link.href =
      scheme === "dark"
        ? "/prism/prism-tomorrow.css"
        : "/prism/prism-solarizedlight.css"
  }, [scheme])
  
  return (
    <StyledWrapper currentScheme={scheme}>
      <_NotionRenderer
        darkMode={scheme === "dark"}
        recordMap={recordMap}
        components={{
          Code,
          Collection,
          Equation,
          Modal,
          Pdf,
          nextImage: Image,
          nextLink: Link,
        }}
        mapPageUrl={mapPageUrl}
      />
    </StyledWrapper>
  )
}

export default NotionRenderer

const StyledWrapper = styled.div<StyledWrapperProps>`
  .notion-collection-page-properties {
    display: none !important;
  }
  .notion-page {
    padding: 0;
  }
  .notion-code {
    background-color: ${({ currentScheme }) =>
      currentScheme === "dark" ? "#2d2d2d" : "#f7f6f3"};
  }
  .notion {
    font-family: Pretendard, -apple-system, sans-serif;
    color: ${({ currentScheme }) =>
      currentScheme === "dark" ? "rgb(209 213 219)" : "rgb(107 114 128)"};
    overflow-wrap: break-word;
  }
`