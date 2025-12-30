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
