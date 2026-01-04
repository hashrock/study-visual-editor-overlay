import ExampleContents from "./ExampleContents";
import ComponentPalette from "./ComponentPalette";
import type { ClickedElementInfo } from "../App";
import { useRef, useEffect } from "react";
import { useElementSelection } from "../hooks/useElementSelection";
import { usePanZoom } from "../hooks/usePanZoom";

interface EditorProps {
  onElementClick: (element: ClickedElementInfo | null) => void;
}

// クリック可能な要素かどうかを判定
const CLICKABLE_TAGS = ["a", "button", "input", "select", "textarea", "label"];
function isClickable(element: ClickedElementInfo | null): boolean {
  if (!element) return false;
  return CLICKABLE_TAGS.includes(element.tagName);
}

export default function Editor({ onElementClick }: EditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Pan/Zoom hook
  const {
    matrix,
    isDragging,
    handleMouseDown: handlePanMouseDown,
    handleMouseMove: handlePanMouseMove,
    handleMouseUp: handlePanMouseUp,
    handleMouseLeave: handlePanMouseLeave,
    handleWheel,
  } = usePanZoom({ containerRef });

  // 要素選択 hook
  const {
    selectedElement,
    hoveredElement,
    handleClick,
    handleMouseMove: handleElementMouseMove,
    handleMouseLeave: handleElementMouseLeave,
    recalculatePositions,
  } = useElementSelection({ containerRef, onElementClick });

  // パン/ズーム時にセレクタ位置を再計算
  useEffect(() => {
    recalculatePositions();
  }, [matrix, recalculatePositions]);

  // マウスイベントを統合
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    handlePanMouseDown(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    handlePanMouseMove(e);
    if (!isDragging) {
      handleElementMouseMove(e);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    handlePanMouseUp(e);
  };

  const handleMouseLeave = () => {
    handlePanMouseLeave();
    handleElementMouseLeave();
  };

  const cursorClass = isDragging
    ? "cursor-grabbing"
    : isClickable(hoveredElement)
      ? "cursor-pointer"
      : "cursor-default";
  const cssMatrix = matrix.toCSSMatrixString();
  return (
    // スクロールコンテナ: オーバーレイの座標計算の基準となる
    <div
      ref={containerRef}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onWheel={handleWheel}
      className={`bg-gray-100 flex-1 h-full overflow-hidden ${cursorClass}`}
    >
      {/* position:relative のラッパー: オーバーレイの position:absolute の基準点 */}
      <div className="relative min-h-full" data-editor-ignore>
        <div
          className="flex items-start p-8"
          data-editor-ignore
          style={{ transform: cssMatrix, transformOrigin: "top left" }}
        >
          <div className="w-[1200px] flex-shrink-0">
            <ExampleContents />
          </div>
          <ComponentPalette />
        </div>
        {/* ホバー用オーバーレイ（青） */}
        <EditorOverlay
          overlayElement={hoveredElement}
          className="border-2 border-blue-500/30 absolute pointer-events-none z-10"
        />
        {/* クリック確定用オーバーレイ（赤） */}
        <EditorOverlay
          overlayElement={selectedElement}
          className="bg-blue-500/10 border-2 border-blue-500/30 absolute pointer-events-none z-10"
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
      className={`${className}`}
      style={{
        width: overlayElement.computedStyles?.width + "px",
        height: overlayElement.computedStyles?.height + "px",
        top: overlayElement.computedStyles?.top + "px",
        left: overlayElement.computedStyles?.left + "px",
      }}
    />
  );
}
