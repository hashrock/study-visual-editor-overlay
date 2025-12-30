import { useState } from "react";
import "./App.css";
import Editor from "./components/Editor";
import DebugPanel from "./components/DebugPanel.tsx";

export interface ClickedElementInfo {
  tagName: string;
  className: string;
  id: string;
  textContent: string;
  attributes: Record<string, string>;
  computedStyles?: Record<string, string>;
}

function App() {
  const [clickedElement, setClickedElement] =
    useState<ClickedElementInfo | null>(null);

  return (
    <>
      <div className="flex h-screen">
        <Editor onElementClick={setClickedElement} />
        <DebugPanel clickedElement={clickedElement} />
      </div>
    </>
  );
}

export default App;
