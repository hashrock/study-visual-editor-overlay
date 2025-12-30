import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useElementSelection } from './useElementSelection'

describe('useElementSelection', () => {
  let containerRef: { current: HTMLDivElement | null }
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)

    // getBoundingClientRectのモック
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      right: 800,
      bottom: 600,
      width: 800,
      height: 600,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })

    containerRef = { current: container }
  })

  describe('初期状態', () => {
    it('selectedElementはnull', () => {
      const { result } = renderHook(() =>
        useElementSelection({ containerRef })
      )
      expect(result.current.selectedElement).toBeNull()
    })

    it('hoveredElementはnull', () => {
      const { result } = renderHook(() =>
        useElementSelection({ containerRef })
      )
      expect(result.current.hoveredElement).toBeNull()
    })
  })

  describe('handleClick', () => {
    it('クリックで要素が選択される', () => {
      const { result } = renderHook(() =>
        useElementSelection({ containerRef })
      )

      const button = document.createElement('button')
      button.id = 'test-btn'
      button.className = 'btn'
      button.textContent = 'Click me'
      container.appendChild(button)

      // getBoundingClientRectのモック
      vi.spyOn(button, 'getBoundingClientRect').mockReturnValue({
        left: 10,
        top: 20,
        right: 110,
        bottom: 70,
        width: 100,
        height: 50,
        x: 10,
        y: 20,
        toJSON: () => ({}),
      })

      act(() => {
        result.current.handleClick({
          target: button,
        } as unknown as React.MouseEvent<HTMLDivElement>)
      })

      expect(result.current.selectedElement).not.toBeNull()
      expect(result.current.selectedElement?.tagName).toBe('button')
      expect(result.current.selectedElement?.id).toBe('test-btn')
      expect(result.current.selectedElement?.className).toBe('btn')
    })

    it('onElementClickコールバックが呼ばれる', () => {
      const onElementClick = vi.fn()
      const { result } = renderHook(() =>
        useElementSelection({ containerRef, onElementClick })
      )

      const div = document.createElement('div')
      container.appendChild(div)

      vi.spyOn(div, 'getBoundingClientRect').mockReturnValue({
        left: 0,
        top: 0,
        right: 100,
        bottom: 100,
        width: 100,
        height: 100,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      })

      act(() => {
        result.current.handleClick({
          target: div,
        } as unknown as React.MouseEvent<HTMLDivElement>)
      })

      expect(onElementClick).toHaveBeenCalledTimes(1)
      expect(onElementClick).toHaveBeenCalledWith(
        expect.objectContaining({ tagName: 'div' })
      )
    })

    it('targetがnullの場合は何もしない', () => {
      const onElementClick = vi.fn()
      const { result } = renderHook(() =>
        useElementSelection({ containerRef, onElementClick })
      )

      act(() => {
        result.current.handleClick({
          target: null,
        } as unknown as React.MouseEvent<HTMLDivElement>)
      })

      expect(result.current.selectedElement).toBeNull()
      expect(onElementClick).not.toHaveBeenCalled()
    })
  })

  describe('handleMouseMove', () => {
    it('マウス移動でhoveredElementが更新される', () => {
      const { result } = renderHook(() =>
        useElementSelection({ containerRef })
      )

      const span = document.createElement('span')
      span.className = 'hover-target'
      container.appendChild(span)

      vi.spyOn(span, 'getBoundingClientRect').mockReturnValue({
        left: 50,
        top: 50,
        right: 150,
        bottom: 100,
        width: 100,
        height: 50,
        x: 50,
        y: 50,
        toJSON: () => ({}),
      })

      act(() => {
        result.current.handleMouseMove({
          target: span,
        } as unknown as React.MouseEvent<HTMLDivElement>)
      })

      expect(result.current.hoveredElement).not.toBeNull()
      expect(result.current.hoveredElement?.tagName).toBe('span')
      expect(result.current.hoveredElement?.className).toBe('hover-target')
    })

    it('別の要素に移動するとhoveredElementが更新される', () => {
      const { result } = renderHook(() =>
        useElementSelection({ containerRef })
      )

      const div1 = document.createElement('div')
      div1.id = 'first'
      const div2 = document.createElement('div')
      div2.id = 'second'
      container.appendChild(div1)
      container.appendChild(div2)

      vi.spyOn(div1, 'getBoundingClientRect').mockReturnValue({
        left: 0, top: 0, right: 100, bottom: 100,
        width: 100, height: 100, x: 0, y: 0, toJSON: () => ({}),
      })
      vi.spyOn(div2, 'getBoundingClientRect').mockReturnValue({
        left: 100, top: 0, right: 200, bottom: 100,
        width: 100, height: 100, x: 100, y: 0, toJSON: () => ({}),
      })

      act(() => {
        result.current.handleMouseMove({
          target: div1,
        } as unknown as React.MouseEvent<HTMLDivElement>)
      })

      expect(result.current.hoveredElement?.id).toBe('first')

      act(() => {
        result.current.handleMouseMove({
          target: div2,
        } as unknown as React.MouseEvent<HTMLDivElement>)
      })

      expect(result.current.hoveredElement?.id).toBe('second')
    })
  })

  describe('handleMouseLeave', () => {
    it('hoveredElementがnullになる', () => {
      const { result } = renderHook(() =>
        useElementSelection({ containerRef })
      )

      const div = document.createElement('div')
      container.appendChild(div)

      vi.spyOn(div, 'getBoundingClientRect').mockReturnValue({
        left: 0, top: 0, right: 100, bottom: 100,
        width: 100, height: 100, x: 0, y: 0, toJSON: () => ({}),
      })

      act(() => {
        result.current.handleMouseMove({
          target: div,
        } as unknown as React.MouseEvent<HTMLDivElement>)
      })

      expect(result.current.hoveredElement).not.toBeNull()

      act(() => {
        result.current.handleMouseLeave()
      })

      expect(result.current.hoveredElement).toBeNull()
    })

    it('selectedElementは影響を受けない', () => {
      const { result } = renderHook(() =>
        useElementSelection({ containerRef })
      )

      const div = document.createElement('div')
      div.id = 'selected'
      container.appendChild(div)

      vi.spyOn(div, 'getBoundingClientRect').mockReturnValue({
        left: 0, top: 0, right: 100, bottom: 100,
        width: 100, height: 100, x: 0, y: 0, toJSON: () => ({}),
      })

      // 要素を選択
      act(() => {
        result.current.handleClick({
          target: div,
        } as unknown as React.MouseEvent<HTMLDivElement>)
      })

      expect(result.current.selectedElement?.id).toBe('selected')

      // マウスがコンテナを離れる
      act(() => {
        result.current.handleMouseLeave()
      })

      // selectedElementは残っている
      expect(result.current.selectedElement?.id).toBe('selected')
    })
  })

  describe('recalculatePositions', () => {
    it('選択された要素の位置が再計算される', () => {
      const { result } = renderHook(() =>
        useElementSelection({ containerRef })
      )

      const div = document.createElement('div')
      div.id = 'recalc-test'
      container.appendChild(div)

      // 初期位置
      vi.spyOn(div, 'getBoundingClientRect').mockReturnValue({
        left: 10, top: 20, right: 110, bottom: 120,
        width: 100, height: 100, x: 10, y: 20, toJSON: () => ({}),
      })

      act(() => {
        result.current.handleClick({
          target: div,
        } as unknown as React.MouseEvent<HTMLDivElement>)
      })

      expect(result.current.selectedElement?.computedStyles?.left).toBe(10)
      expect(result.current.selectedElement?.computedStyles?.top).toBe(20)

      // 位置が変わったとシミュレート
      vi.spyOn(div, 'getBoundingClientRect').mockReturnValue({
        left: 100, top: 200, right: 200, bottom: 300,
        width: 100, height: 100, x: 100, y: 200, toJSON: () => ({}),
      })

      act(() => {
        result.current.recalculatePositions()
      })

      expect(result.current.selectedElement?.computedStyles?.left).toBe(100)
      expect(result.current.selectedElement?.computedStyles?.top).toBe(200)
    })

    it('containerRefがnullの場合は何もしない', () => {
      const nullContainerRef = { current: null }
      const { result } = renderHook(() =>
        useElementSelection({ containerRef: nullContainerRef })
      )

      // エラーが発生しないことを確認
      act(() => {
        result.current.recalculatePositions()
      })

      expect(result.current.selectedElement).toBeNull()
    })
  })
})

