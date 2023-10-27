import { Section } from "@/react/section"
import dynamic from "next/dynamic"

const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  {ssr: false}
)

interface FxCodeEditorProps {
  section: Section
}

const FxCodeEditor = (props: any) => (
  <CodeEditor key={props.section.id}
    value={props.section.content} language="jsx" readOnly padding={15}
    style={{ width: '100%',
      fontSize: 12,
      backgroundColor: "#f5f5f5",
      fontFamily: "ui-monospace,SF Mono,Consolas,Liberation Mono,Menlo,monospace"
    }}
  />
)

export default FxCodeEditor