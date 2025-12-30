import "./App.css";
import Editor from "./components/Editor";
import DebugPanel from "./components/DebugPanel.tsx";

function App() {
  return (
    <>
      <div className="flex h-screen">
        <Editor />
        <DebugPanel />
      </div>
    </>
  );
}

export default App;
