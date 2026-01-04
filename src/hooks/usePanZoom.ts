import { useState, type RefObject } from "react";
import { Transform, Vec2 } from "paintvec";

/**
 * 座標系の説明:
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ ビューポート座標 (clientX, clientY)                              │
 * │   ブラウザウィンドウ左上が原点(0,0)                               │
 * │                                                                 │
 * │   ┌───────────────────────────────────────┐                     │
 * │   │ スクリーン座標 (コンテナ相対座標)        │                     │
 * │   │   コンテナ左上が原点(0,0)               │                     │
 * │   │   = clientX - container.left           │                     │
 * │   │                                        │                     │
 * │   │   ┌────────────────────┐               │                     │
 * │   │   │ ワールド座標        │ ← transform  │                     │
 * │   │   │ (コンテンツ座標)    │   で変換     │                     │
 * │   │   │ 元のHTML左上が原点  │               │                     │
 * │   │   └────────────────────┘               │                     │
 * │   │                                        │                     │
 * │   └───────────────────────────────────────┘                     │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * 変換の関係:
 *   ワールド座標 → スクリーン座標: matrix.apply(worldPos)
 *   スクリーン座標 → ワールド座標: matrix.invert()?.apply(screenPos)
 */

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
      // ドラッグ開始位置を記録（ビューポート座標）
      setDragStart(new Vec2(e.clientX, e.clientY));
      setMatrixStart(matrix);
    }
  };

  // ドラッグ中の移動処理（パン）
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && dragStart && matrixStart) {
      // 現在位置（ビューポート座標）
      const currentPos = new Vec2(e.clientX, e.clientY);
      // ドラッグ開始位置からの移動量（スクリーン座標での差分）
      const delta = currentPos.sub(dragStart);
      // matrixに平行移動を合成（スクリーン座標系での移動）
      setMatrix(matrixStart.merge(Transform.translate(delta)));
    }
  };

  // ドラッグ終了
  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 1) {
      setIsDragging(false);
      setDragStart(null);
      setMatrixStart(null);
    }
  };

  // マウスがコンテナを離れた場合
  const handleMouseLeave = () => {
    setIsDragging(false);
    setDragStart(null);
    setMatrixStart(null);
  };

  // ホイールでズーム（カーソル中心）
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    // ビューポート座標 → スクリーン座標（コンテナ相対）に変換
    const rect = container.getBoundingClientRect();
    const screenCursorPos = new Vec2(
      e.clientX - rect.left, // ビューポートX - コンテナ左端
      e.clientY - rect.top, // ビューポートY - コンテナ上端
    );

    // ズームイン/アウトのスケール値
    const scale = e.deltaY > 0 ? 1 / scaleFactor : scaleFactor;
    const scaleVec = new Vec2(scale, scale);

    // カーソル位置を中心にスケールする変換を作成
    // 1. カーソル位置を原点に移動
    // 2. スケールを適用
    // 3. カーソル位置を元に戻す
    const scaleTransform = Transform.translate(screenCursorPos.neg)
      .merge(Transform.scale(scaleVec))
      .merge(Transform.translate(screenCursorPos));

    // 現在のmatrixに合成（スクリーン座標系での操作）
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
