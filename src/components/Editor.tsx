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

    // コンテナからの相対位置を計算（スクロール位置を加算）
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
      width: width,
      height: height,
      top: top,
      left: left,
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
    <div
      ref={containerRef}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.currentTarget.click();
        }
      }}
      role="application"
      tabIndex={0}
      className="bg-gray-100 flex-1 h-full overflow-y-auto"
    >
      <div className="relative min-h-full">
        <ExampleContents />
        <EditorOverlay overlayElement={overlayElement} />
      </div>
    </div>
  );
}

function EditorOverlay({
  overlayElement,
}: {
  overlayElement: ClickedElementInfo | null;
}) {
  if (!overlayElement) return null;

  return (
    <div className="absolute inset-0  pointer-events-none z-10">
      <div
        className="absolute bg-red-500 opacity-50 pointer-events-none"
        style={{
          width: overlayElement.computedStyles?.width + "px",
          height: overlayElement.computedStyles?.height + "px",
          top: overlayElement.computedStyles?.top + "px",
          left: overlayElement.computedStyles?.left + "px",
        }}
      ></div>
    </div>
  );
}
