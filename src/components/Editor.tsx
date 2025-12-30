import ExampleContents from "./ExampleContents";
import type { ClickedElementInfo } from "../App";
import { getClassName } from "../utils/dom";
import { useState, useRef } from "react";
interface EditorProps {
  onElementClick: (element: ClickedElementInfo | null) => void;
}

export default function Editor({ onElementClick }: EditorProps) {
  // クリックで確定した要素
  const [selectedElement, setSelectedElement] =
    useState<ClickedElementInfo | null>(null);
  // ホバー中の要素
  const [hoveredElement, setHoveredElement] =
    useState<ClickedElementInfo | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 要素情報を取得する共通関数
  const getElementInfo = (
    target: HTMLElement,
    container: HTMLDivElement
  ): ClickedElementInfo => {
    const computedStyles = window.getComputedStyle(target);
    const attributes: Record<string, string> = {};

    const targetRect = target.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const width = targetRect.width;
    const height = targetRect.height;

    // 座標系: スクロールコンテナ（containerRef）の左上を原点(0,0)とした座標
    const top = targetRect.top - containerRect.top + container.scrollTop;
    const left = targetRect.left - containerRect.left + container.scrollLeft;

    Array.from(target.attributes).forEach((attr) => {
      attributes[attr.name] = attr.value;
    });

    const importantStyles: Record<string, string | number> = {
      display: computedStyles.display,
      position: computedStyles.position,
      width,
      height,
      top,
      left,
    };

    return {
      tagName: target.tagName.toLowerCase(),
      className: getClassName(target),
      id: target.id || "",
      textContent: target.textContent?.trim().substring(0, 100) || "",
      attributes,
      computedStyles: importantStyles,
    };
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const container = containerRef.current;
    if (!target || !container) return;

    const elementInfo = getElementInfo(target, container);
    setSelectedElement(elementInfo);
    onElementClick(elementInfo);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const container = containerRef.current;
    if (!target || !container) return;

    const elementInfo = getElementInfo(target, container);
    setHoveredElement(elementInfo);
  };

  const handleMouseLeave = () => {
    setHoveredElement(null);
  };

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
