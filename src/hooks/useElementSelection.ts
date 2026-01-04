import { useState, useRef, useCallback, type RefObject } from "react";
import type { ClickedElementInfo } from "../App";
import { getElementInfo } from "../utils/dom";
interface UseElementSelectionOptions {
  containerRef: RefObject<HTMLDivElement | null>;
  onElementClick?: (element: ClickedElementInfo | null) => void;
}

interface UseElementSelectionReturn {
  selectedElement: ClickedElementInfo | null;
  hoveredElement: ClickedElementInfo | null;
  handleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseLeave: () => void;
  /** パン/ズーム時に位置を再計算するための関数 */
  recalculatePositions: () => void;
}

/**
 * 要素の選択・ホバー状態を管理するフック
 */
export function useElementSelection({
  containerRef,
  onElementClick,
}: UseElementSelectionOptions): UseElementSelectionReturn {
  // クリックで確定した要素
  const [selectedElement, setSelectedElement] =
    useState<ClickedElementInfo | null>(null);
  // ホバー中の要素
  const [hoveredElement, setHoveredElement] =
    useState<ClickedElementInfo | null>(null);

  // DOM要素の参照を保持
  const selectedElementRef = useRef<HTMLElement | null>(null);
  const hoveredElementRef = useRef<HTMLElement | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const container = containerRef.current;
    if (!target || !container) return;
    // エディタのUI要素は選択対象から除外
    if (target.hasAttribute("data-editor-ignore")) return;
    const elementInfo = getElementInfo(target, container);
    selectedElementRef.current = target;
    setSelectedElement(elementInfo);
    onElementClick?.(elementInfo);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const container = containerRef.current;
    if (!target || !container) return;
    // エディタのUI要素は選択対象から除外
    if (target.hasAttribute("data-editor-ignore")) return;

    const elementInfo = getElementInfo(target, container);
    hoveredElementRef.current = target;
    setHoveredElement(elementInfo);
  };

  const handleMouseLeave = () => {
    hoveredElementRef.current = null;
    setHoveredElement(null);
  };

  // パン/ズーム時に位置を再計算
  const recalculatePositions = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (selectedElementRef.current) {
      const elementInfo = getElementInfo(selectedElementRef.current, container);
      setSelectedElement(elementInfo);
    }

    if (hoveredElementRef.current) {
      const elementInfo = getElementInfo(hoveredElementRef.current, container);
      setHoveredElement(elementInfo);
    }
  }, [containerRef]);

  return {
    selectedElement,
    hoveredElement,
    handleClick,
    handleMouseMove,
    handleMouseLeave,
    recalculatePositions,
  };
}
