import type { ClickedElementInfo, ElementAncestor, DOMTreeNode } from "../App";

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
 *
 * 座標系について:
 *   getBoundingClientRect() は CSS transform 適用後のビューポート座標を返す
 *   → パン/ズーム後も自動的に変換後の位置が取得できる
 */
export function getElementInfo(
  target: HTMLElement,
  container: HTMLDivElement
): ClickedElementInfo {
  const computedStyles = window.getComputedStyle(target);
  const attributes: Record<string, string> = {};

  // getBoundingClientRect() はビューポート座標（transform適用後）
  const targetRect = target.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  // サイズ（transform適用後のスクリーン上のサイズ）
  const width = targetRect.width;
  const height = targetRect.height;

  // スクリーン座標に変換（コンテナ左上が原点）
  // ビューポート座標 - コンテナ位置 + スクロール量
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

  // 親要素のパスを取得（containerまで）
  const ancestors: ElementAncestor[] = [];
  let current = target.parentElement;
  while (current && current !== container) {
    const currentRect = current.getBoundingClientRect();
    ancestors.push({
      tagName: current.tagName.toLowerCase(),
      className: getClassName(current),
      id: current.id || "",
      computedStyles: {
        width: currentRect.width,
        height: currentRect.height,
        top: currentRect.top - containerRect.top + container.scrollTop,
        left: currentRect.left - containerRect.left + container.scrollLeft,
      },
    });
    current = current.parentElement;
  }

  return {
    tagName: target.tagName.toLowerCase(),
    className: getClassName(target),
    id: target.id || "",
    textContent: target.textContent?.trim().substring(0, 100) || "",
    attributes,
    computedStyles: importantStyles,
    ancestors,
  };
}

/**
 * DOMツリーを構築する
 * @param root ルート要素
 * @param container スクロールコンテナ（座標計算の基準）
 * @param maxDepth 最大深さ（デフォルト: 10）
 */
export function buildDOMTree(
  root: HTMLElement,
  container: HTMLDivElement,
  maxDepth: number = 10
): DOMTreeNode {
  const containerRect = container.getBoundingClientRect();

  function buildNode(element: HTMLElement, depth: number): DOMTreeNode {
    const rect = element.getBoundingClientRect();

    const children: DOMTreeNode[] = [];
    if (depth < maxDepth) {
      for (const child of Array.from(element.children)) {
        if (child instanceof HTMLElement) {
          // data-editor-ignoreを持つ要素はスキップ
          if (child.hasAttribute("data-editor-ignore")) continue;
          children.push(buildNode(child, depth + 1));
        }
      }
    }

    return {
      tagName: element.tagName.toLowerCase(),
      className: getClassName(element),
      id: element.id || "",
      children,
      computedStyles: {
        width: rect.width,
        height: rect.height,
        top: rect.top - containerRect.top + container.scrollTop,
        left: rect.left - containerRect.left + container.scrollLeft,
      },
    };
  }

  return buildNode(root, 0);
}
