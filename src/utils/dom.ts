import type { ClickedElementInfo } from "../App";

/**
 * 要素のclassNameを文字列として取得する
 * SVG要素のclassNameはSVGAnimatedString型なので変換が必要
 */
export function getClassName(el: Element): string {
  if (typeof el.className === "string") {
    return el.className;
  }
  // SVG要素の場合
  if (
    el.className &&
    typeof el.className === "object" &&
    "baseVal" in el.className
  ) {
    return (el.className as SVGAnimatedString).baseVal;
  }
  return "";
}

/**
 * 要素情報を取得する
 * @param target 対象の要素
 * @param container スクロールコンテナ（座標計算の基準）
 */
export function getElementInfo(
  target: HTMLElement,
  container: HTMLDivElement
): ClickedElementInfo {
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
}
