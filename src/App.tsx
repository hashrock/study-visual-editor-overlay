import { useState } from "react";
import Editor from "./components/Editor";
import DebugPanel from "./components/DebugPanel";

export interface ElementAncestor {
  tagName: string;
  className: string;
  id: string;
  computedStyles?: Record<string, string | number>;
}

export interface ClickedElementInfo {
  tagName: string;
  className: string;
  id: string;
  textContent: string;
  attributes: Record<string, string>;
  computedStyles?: Record<string, string | number>;
  ancestors?: ElementAncestor[];
}

export interface DOMTreeNode {
  tagName: string;
  className: string;
  id: string;
  children: DOMTreeNode[];
  computedStyles?: Record<string, string | number>;
}

function App() {
  const [clickedElement, setClickedElement] =
    useState<ClickedElementInfo | null>(null);
  const [domTree, setDomTree] = useState<DOMTreeNode | null>(null);

  return (
    <>
      <div className="flex h-screen">
        <Editor
          onElementClick={setClickedElement}
          onTreeChange={setDomTree}
        />
        <DebugPanel
          clickedElement={clickedElement}
          onElementClick={setClickedElement}
          domTree={domTree}
        />
      </div>
    </>
  );
}

export default App;
