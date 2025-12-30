import ExampleContents from "./ExampleContents";
import type { ClickedElementInfo } from "../App";
import { useRef } from "react";
import { useElementSelection } from "../hooks/useElementSelection";

interface EditorProps {
  onElementClick: (element: ClickedElementInfo | null) => void;
}

export default function Editor({ onElementClick }: EditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    selectedElement,
    hoveredElement,
    handleClick,
    handleMouseMove,
    handleMouseLeave,
  } = useElementSelection({ containerRef, onElementClick });

  return (
    // スクロールコンテナ: オーバーレイの座標計算の基準となる
    <div
      ref={containerRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="bg-gray-100 flex-1 h-full overflow-y-auto"
    >
      {/* position:relative のラッパー: オーバーレイの position:absolute の基準点 */}
      <div className="relative min-h-full">
        <ExampleContents />
        {/* ホバー用オーバーレイ（青） */}
        <EditorOverlay
          overlayElement={hoveredElement}
          className="bg-blue-500/30"
        />
        {/* クリック確定用オーバーレイ（赤） */}
        <EditorOverlay
          overlayElement={selectedElement}
          className="bg-red-500/50"
        />
      </div>
    </div>
  );
}

/**
 * 選択した要素の上に表示するオーバーレイ
 * 座標系: 親のrelativeラッパーの左上を原点とした絶対位置
 */
function EditorOverlay({
  overlayElement,
  className,
}: {
  overlayElement: ClickedElementInfo | null;
  className?: string;
}) {
  if (!overlayElement) return null;

  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      style={{
        width: overlayElement.computedStyles?.width + "px",
        height: overlayElement.computedStyles?.height + "px",
        top: overlayElement.computedStyles?.top + "px",
        left: overlayElement.computedStyles?.left + "px",
      }}
    />
  );
}
