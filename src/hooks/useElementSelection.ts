import { useState, type RefObject } from "react";
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

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const container = containerRef.current;
    if (!target || !container) return;

    const elementInfo = getElementInfo(target, container);
    setSelectedElement(elementInfo);
    onElementClick?.(elementInfo);
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

  return {
    selectedElement,
    hoveredElement,
    handleClick,
    handleMouseMove,
    handleMouseLeave,
  };
}

