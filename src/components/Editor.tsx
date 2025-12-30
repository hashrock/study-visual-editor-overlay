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

    // すべての属性を取得
    Array.from(target.attributes).forEach((attr) => {
      attributes[attr.name] = attr.value;
    });

    // 主要なスタイル情報を取得
    const importantStyles: Record<string, string> = {
      display: computedStyles.display,
      position: computedStyles.position,
      width: computedStyles.width,
      height: computedStyles.height,
      margin: computedStyles.margin,
      padding: computedStyles.padding,
      backgroundColor: computedStyles.backgroundColor,
      color: computedStyles.color,
      fontSize: computedStyles.fontSize,
      fontWeight: computedStyles.fontWeight,
      border: computedStyles.border,
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
