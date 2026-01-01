import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePanZoom } from "./usePanZoom";
import { Transform, Vec2 } from "paintvec";

// paintvec の Transform は happy-dom 環境で一部メソッドが利用できないため、
// プロパティ（m00, m11, m20, m21 など）を直接参照してテストする

describe("usePanZoom", () => {
  let containerRef: { current: HTMLDivElement | null };

  beforeEach(() => {
    const container = document.createElement("div");
    // getBoundingClientRectのモック
    vi.spyOn(container, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      right: 800,
      bottom: 600,
      width: 800,
      height: 600,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    containerRef = { current: container };
  });

  describe("初期状態", () => {
    it("デフォルトのinitialMatrixで初期化される", () => {
      const { result } = renderHook(() => usePanZoom({ containerRef }));

      // デフォルトはスケール0.5
      const expectedMatrix = Transform.scale(new Vec2(0.5, 0.5));
      expect(result.current.matrix.equals(expectedMatrix)).toBe(true);
    });

    it("カスタムinitialMatrixで初期化できる", () => {
      const customMatrix = Transform.translate(new Vec2(100, 200));
      const { result } = renderHook(() =>
        usePanZoom({ containerRef, initialMatrix: customMatrix })
      );

      expect(result.current.matrix.equals(customMatrix)).toBe(true);
    });

    it("初期状態ではドラッグ中ではない", () => {
      const { result } = renderHook(() => usePanZoom({ containerRef }));
      expect(result.current.isDragging).toBe(false);
    });
  });

  describe("パン操作（中ボタンドラッグ）", () => {
    it("中ボタン（button=1）でドラッグが開始される", () => {
      const { result } = renderHook(() => usePanZoom({ containerRef }));

      act(() => {
        result.current.handleMouseDown({
          button: 1,
          clientX: 100,
          clientY: 100,
          preventDefault: vi.fn(),
        } as unknown as React.MouseEvent<HTMLDivElement>);
      });

      expect(result.current.isDragging).toBe(true);
    });

    it("左ボタン（button=0）ではドラッグが開始されない", () => {
      const { result } = renderHook(() => usePanZoom({ containerRef }));

      act(() => {
        result.current.handleMouseDown({
          button: 0,
          clientX: 100,
          clientY: 100,
          preventDefault: vi.fn(),
        } as unknown as React.MouseEvent<HTMLDivElement>);
      });

      expect(result.current.isDragging).toBe(false);
    });

    it("ドラッグ中に移動するとmatrixが更新される", () => {
      const initialMatrix = new Transform();
      const { result } = renderHook(() =>
        usePanZoom({ containerRef, initialMatrix })
      );

      // ドラッグ開始
      act(() => {
        result.current.handleMouseDown({
          button: 1,
          clientX: 100,
          clientY: 100,
          preventDefault: vi.fn(),
        } as unknown as React.MouseEvent<HTMLDivElement>);
      });

      // ドラッグ移動（50px右、30px下に移動）
      act(() => {
        result.current.handleMouseMove({
          clientX: 150,
          clientY: 130,
        } as unknown as React.MouseEvent<HTMLDivElement>);
      });

      // matrixに平行移動が適用されているか確認
      // Transform.m20 = translate x, Transform.m21 = translate y
      expect(result.current.matrix.m20).toBeCloseTo(50);
      expect(result.current.matrix.m21).toBeCloseTo(30);
    });

    it("中ボタンを離すとドラッグが終了する", () => {
      const { result } = renderHook(() => usePanZoom({ containerRef }));

      act(() => {
        result.current.handleMouseDown({
          button: 1,
          clientX: 100,
          clientY: 100,
          preventDefault: vi.fn(),
        } as unknown as React.MouseEvent<HTMLDivElement>);
      });

      expect(result.current.isDragging).toBe(true);

      act(() => {
        result.current.handleMouseUp({
          button: 1,
        } as unknown as React.MouseEvent<HTMLDivElement>);
      });

      expect(result.current.isDragging).toBe(false);
    });

    it("handleMouseLeaveでドラッグが終了する", () => {
      const { result } = renderHook(() => usePanZoom({ containerRef }));

      act(() => {
        result.current.handleMouseDown({
          button: 1,
          clientX: 100,
          clientY: 100,
          preventDefault: vi.fn(),
        } as unknown as React.MouseEvent<HTMLDivElement>);
      });

      expect(result.current.isDragging).toBe(true);

      act(() => {
        result.current.handleMouseLeave();
      });

      expect(result.current.isDragging).toBe(false);
    });
  });

  describe("ズーム操作（ホイール）", () => {
    it("ホイール下（deltaY > 0）でズームアウトする", () => {
      const initialMatrix = new Transform();
      const { result } = renderHook(() =>
        usePanZoom({ containerRef, initialMatrix, scaleFactor: 1.1 })
      );

      const initialScale = result.current.matrix.m00;

      act(() => {
        result.current.handleWheel({
          deltaY: 100, // 下方向スクロール
          clientX: 400,
          clientY: 300,
          preventDefault: vi.fn(),
        } as unknown as React.WheelEvent<HTMLDivElement>);
      });

      // ズームアウト後はスケールが小さくなる
      expect(result.current.matrix.m00).toBeLessThan(initialScale);
    });

    it("ホイール上（deltaY < 0）でズームインする", () => {
      const initialMatrix = new Transform();
      const { result } = renderHook(() =>
        usePanZoom({ containerRef, initialMatrix, scaleFactor: 1.1 })
      );

      const initialScale = result.current.matrix.m00;

      act(() => {
        result.current.handleWheel({
          deltaY: -100, // 上方向スクロール
          clientX: 400,
          clientY: 300,
          preventDefault: vi.fn(),
        } as unknown as React.WheelEvent<HTMLDivElement>);
      });

      // ズームイン後はスケールが大きくなる
      expect(result.current.matrix.m00).toBeGreaterThan(initialScale);
    });

    it("カーソル位置を中心にズームされる（スケールと平行移動が連動する）", () => {
      const initialMatrix = new Transform();
      const scaleFactor = 1.5;
      const { result } = renderHook(() =>
        usePanZoom({ containerRef, initialMatrix, scaleFactor })
      );

      // カーソル位置 (200, 100) でズーム
      const cursorX = 200;
      const cursorY = 100;

      const initialScale = result.current.matrix.m00; // 1.0

      act(() => {
        result.current.handleWheel({
          deltaY: -100, // ズームイン
          clientX: cursorX,
          clientY: cursorY,
          preventDefault: vi.fn(),
        } as unknown as React.WheelEvent<HTMLDivElement>);
      });

      // ズーム後はスケールが変わる
      expect(result.current.matrix.m00).not.toBeCloseTo(initialScale);
      // X方向とY方向のスケールは同じ
      expect(result.current.matrix.m00).toBeCloseTo(result.current.matrix.m11);

      // カーソル位置が(0,0)でない場合、平行移動も発生する
      const hasTranslation =
        Math.abs(result.current.matrix.m20) > 0.001 ||
        Math.abs(result.current.matrix.m21) > 0.001;
      expect(hasTranslation).toBe(true);
    });

    it("containerRefがnullの場合はズームしない", () => {
      const nullContainerRef = { current: null };
      const initialMatrix = new Transform();
      const { result } = renderHook(() =>
        usePanZoom({ containerRef: nullContainerRef, initialMatrix })
      );

      const matrixBefore = result.current.matrix;

      act(() => {
        result.current.handleWheel({
          deltaY: -100,
          clientX: 400,
          clientY: 300,
          preventDefault: vi.fn(),
        } as unknown as React.WheelEvent<HTMLDivElement>);
      });

      expect(result.current.matrix.equals(matrixBefore)).toBe(true);
    });
  });

  describe("setMatrix", () => {
    it("matrixを直接設定できる", () => {
      const { result } = renderHook(() => usePanZoom({ containerRef }));

      const newMatrix = Transform.translate(new Vec2(500, 500));

      act(() => {
        result.current.setMatrix(newMatrix);
      });

      expect(result.current.matrix.equals(newMatrix)).toBe(true);
    });
  });
});
