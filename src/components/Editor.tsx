import ExampleContents from "./ExampleContents";
import type { ClickedElementInfo } from "../App";
import { getClassName } from "../utils/dom";
import { useState, useRef } from "react";
interface EditorProps {
  onElementClick: (element: ClickedElementInfo | null) => void;
}

export default function Editor({ onElementClick }: EditorProps) {
  const [overlayElement, setOverlayElement] =
    useState<ClickedElementInfo | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const container = containerRef.current;
    if (!target || !container) return;

    // クリックした要素の情報を取得
    const computedStyles = window.getComputedStyle(target);
    const attributes: Record<string, string> = {};

    const targetRect = target.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const width = targetRect.width;
    const height = targetRect.height;

    // 座標系: スクロールコンテナ（containerRef）の左上を原点(0,0)とした座標
    // - getBoundingClientRect() はビューポート基準なので、コンテナ位置を引く
    // - スクロール位置を加算することで、スクロール後も正しい位置を維持
    const top = targetRect.top - containerRect.top + container.scrollTop;
    const left = targetRect.left - containerRect.left + container.scrollLeft;

    // すべての属性を取得
    Array.from(target.attributes).forEach((attr) => {
      attributes[attr.name] = attr.value;
    });

    // 主要なスタイル情報を取得
    const importantStyles: Record<string, string | number> = {
      display: computedStyles.display,
      position: computedStyles.position,
      width,
      height,
      top,
      left,
    };

    const className = getClassName(target);

    const elementInfo: ClickedElementInfo = {
      tagName: target.tagName.toLowerCase(),
      className,
      id: target.id || "",
      textContent: target.textContent?.trim().substring(0, 100) || "",
      attributes,
      computedStyles: importantStyles,
    };

    setOverlayElement(elementInfo);
    onElementClick(elementInfo);
  };

  return (
    // スクロールコンテナ: オーバーレイの座標計算の基準となる
    <div
      ref={containerRef}
      onClick={handleClick}
      className="bg-gray-100 flex-1 h-full overflow-y-auto"
    >
      {/* position:relative のラッパー: オーバーレイの position:absolute の基準点 */}
      <div className="relative min-h-full">
        <ExampleContents />
        <EditorOverlay overlayElement={overlayElement} />
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
}: {
  overlayElement: ClickedElementInfo | null;
}) {
  if (!overlayElement) return null;

  return (
    <div
      className="absolute bg-red-500/50 pointer-events-none"
      style={{
        width: overlayElement.computedStyles?.width + "px",
        height: overlayElement.computedStyles?.height + "px",
        top: overlayElement.computedStyles?.top + "px",
        left: overlayElement.computedStyles?.left + "px",
      }}
    />
  );
}
