import { useState, type RefObject } from "react";
import { Transform, Vec2 } from "paintvec";

interface UsePanZoomOptions {
  containerRef: RefObject<HTMLDivElement | null>;
  initialZoom?: number;
  initialOffset?: Vec2;
  minZoom?: number;
  maxZoom?: number;
  zoomFactor?: number;
}

interface UsePanZoomReturn {
  zoom: number;
  offset: Vec2;
  matrix: Transform;
  isDragging: boolean;
  setZoom: (zoom: number) => void;
  setOffset: (offset: Vec2) => void;
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseUp: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseLeave: () => void;
  handleWheel: (e: React.WheelEvent<HTMLDivElement>) => void;
}

/**
 * Pan/Zoom操作を管理するフック
 * - センタークリックドラッグでパン
 * - ホイールでカーソル中心ズーム
 */
export function usePanZoom({
  containerRef,
  initialZoom = 0.5,
  initialOffset = new Vec2(0, 0),
  minZoom = 0.1,
  maxZoom = 5,
  zoomFactor = 0.1,
}: UsePanZoomOptions): UsePanZoomReturn {
  const [zoom, setZoom] = useState(initialZoom);
  const [offset, setOffset] = useState(initialOffset);

  // センタークリックドラッグ用のstate
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Vec2 | null>(null);
  const [offsetStart, setOffsetStart] = useState<Vec2 | null>(null);

  // 変換行列を計算
  const matrix = Transform.scale(new Vec2(zoom, zoom)).merge(
    Transform.translate(offset)
  );

  // センタークリックでドラッグ開始
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 1) {
      // 中ボタン
      e.preventDefault();
      setIsDragging(true);
      setDragStart(new Vec2(e.clientX, e.clientY));
      setOffsetStart(offset);
    }
  };

  // ドラッグ中の移動処理
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && dragStart && offsetStart) {
      const currentPos = new Vec2(e.clientX, e.clientY);
      const delta = currentPos.sub(dragStart);
      setOffset(offsetStart.add(delta));
    }
  };

  // ドラッグ終了
  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 1) {
      setIsDragging(false);
      setDragStart(null);
      setOffsetStart(null);
    }
  };

  // マウスがコンテナを離れた場合
  const handleMouseLeave = () => {
    setIsDragging(false);
    setDragStart(null);
    setOffsetStart(null);
  };

  // ホイールでズーム（カーソル中心）
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;

    // カーソルのコンテナ相対座標
    const rect = container.getBoundingClientRect();
    const cursorPos = new Vec2(e.clientX - rect.left, e.clientY - rect.top);

    // カーソル位置のワールド座標（変換前の座標）
    // スクリーン座標 = ワールド座標 * zoom + offset
    // → ワールド座標 = (スクリーン座標 - offset) / zoom
    const worldPos = cursorPos.sub(offset).div(new Vec2(zoom, zoom));

    // 新しいズーム値を計算
    const delta = e.deltaY > 0 ? -zoomFactor : zoomFactor;
    const newZoom = Math.max(minZoom, Math.min(maxZoom, zoom + delta));

    // カーソル位置を固定するための新しいオフセット
    // cursorPos = worldPos * newZoom + newOffset
    // → newOffset = cursorPos - worldPos * newZoom
    const newOffset = cursorPos.sub(worldPos.mul(new Vec2(newZoom, newZoom)));

    setZoom(newZoom);
    setOffset(newOffset);
  };

  return {
    zoom,
    offset,
    matrix,
    isDragging,
    setZoom,
    setOffset,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleWheel,
  };
}

