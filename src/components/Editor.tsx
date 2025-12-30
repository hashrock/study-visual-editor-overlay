import ExampleContents from "./ExampleContents";
import type { ClickedElementInfo } from "../App";
import { getClassName } from "../utils/dom";

interface EditorProps {
  onElementClick: (element: ClickedElementInfo | null) => void;
}

export default function Editor({ onElementClick }: EditorProps) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (!target) return;

    // クリックした要素の情報を取得
    const computedStyles = window.getComputedStyle(target);
    const attributes: Record<string, string> = {};

    const boundingClientRect = target.getBoundingClientRect();
    const top = boundingClientRect.top;
    const left = boundingClientRect.left;
    const right = boundingClientRect.right;
    const bottom = boundingClientRect.bottom;
    const width = boundingClientRect.width;
    const height = boundingClientRect.height;

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
      right: right,
      bottom: bottom,
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

    onElementClick(elementInfo);
  };

  return (
    <div
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
      <ExampleContents />
    </div>
  );
}
