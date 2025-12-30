import { useState, type RefObject } from "react";
import { Transform, Vec2 } from "paintvec";

interface UsePanZoomOptions {
  containerRef: RefObject<HTMLDivElement | null>;
  initialMatrix?: Transform;
  /** ホイール1回あたりのスケール倍率（デフォルト: 1.1） */
  scaleFactor?: number;
}

interface UsePanZoomReturn {
  matrix: Transform;
  isDragging: boolean;
  setMatrix: (matrix: Transform) => void;
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
  initialMatrix = Transform.scale(new Vec2(0.5, 0.5)),
  scaleFactor = 1.1,
}: UsePanZoomOptions): UsePanZoomReturn {
  const [matrix, setMatrix] = useState(initialMatrix);
  const [invertedMatrix, setInvertedMatrix] = useState<Transform | null>(null);

  // センタークリックドラッグ用のstate
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Vec2 | null>(null);
  const [matrixStart, setMatrixStart] = useState<Transform | null>(null);

  // センタークリックでドラッグ開始
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 1) {
      // 中ボタン
      e.preventDefault();
      setIsDragging(true);
      setDragStart(new Vec2(e.clientX, e.clientY));
      setMatrixStart(matrix);
      setInvertedMatrix(matrix.invert() ?? null);
    }
  };

  // ドラッグ中の移動処理
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && dragStart && matrixStart) {
      const currentPos = new Vec2(e.clientX, e.clientY);
      const delta = currentPos.sub(dragStart);
      // matrixStartにtranslateを追加
      setMatrix(matrixStart.merge(Transform.translate(delta)));
      setInvertedMatrix(matrix.invert() ?? null);
    }
  };

  // ドラッグ終了
  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 1) {
      setIsDragging(false);
      setDragStart(null);
      setMatrixStart(null);
      setInvertedMatrix(null);
    }
  };

  // マウスがコンテナを離れた場合
  const handleMouseLeave = () => {
    setIsDragging(false);
    setDragStart(null);
    setMatrixStart(null);
    setInvertedMatrix(null);
  };

  // ホイールでズーム（カーソル中心）
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;

    // カーソルのコンテナ相対座標（スクリーン座標）
    const rect = container.getBoundingClientRect();
    const screenCursorPos = new Vec2(
      e.clientX - rect.left,
      e.clientY - rect.top
    );

    // ズームイン/アウトのスケール値
    const scale = e.deltaY > 0 ? 1 / scaleFactor : scaleFactor;
    const scaleVec = new Vec2(scale, scale);

    // ワールド座標系でカーソル位置を中心にスケール変換を作成
    // translate(worldCursorPos) → scale → translate(-worldCursorPos)
    const scaleTransform = Transform.translate(screenCursorPos)
      .merge(Transform.scale(scaleVec))
      .merge(Transform.translate(screenCursorPos.neg));

    // 現在のmatrixにスケール変換を合成（ワールド座標系で適用）
    setMatrix(matrix.merge(scaleTransform));
  };

  return {
    matrix,
    isDragging,
    setMatrix,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleWheel,
  };
}
