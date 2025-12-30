import { describe, it, expect, beforeEach } from 'vitest'
import { getClassName, getElementInfo } from './dom'

describe('getClassName', () => {
  it('通常のHTML要素のclassNameを取得できる', () => {
    const div = document.createElement('div')
    div.className = 'test-class another-class'
    expect(getClassName(div)).toBe('test-class another-class')
  })

  it('classNameが空の場合は空文字列を返す', () => {
    const div = document.createElement('div')
    expect(getClassName(div)).toBe('')
  })

  it('SVG要素のclassNameを取得できる', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('class', 'svg-class')
    expect(getClassName(svg)).toBe('svg-class')
  })

  it('SVG要素でclassNameが空の場合は空文字列を返す', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    expect(getClassName(svg)).toBe('')
  })
})

describe('getElementInfo', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  it('要素の基本情報を取得できる', () => {
    const target = document.createElement('button')
    target.id = 'test-button'
    target.className = 'btn btn-primary'
    target.textContent = 'Click me'
    target.setAttribute('data-testid', 'my-button')
    container.appendChild(target)

    const info = getElementInfo(target, container)

    expect(info.tagName).toBe('button')
    expect(info.id).toBe('test-button')
    expect(info.className).toBe('btn btn-primary')
    expect(info.textContent).toBe('Click me')
    expect(info.attributes['data-testid']).toBe('my-button')
  })

  it('IDがない場合は空文字列を返す', () => {
    const target = document.createElement('div')
    container.appendChild(target)

    const info = getElementInfo(target, container)
    expect(info.id).toBe('')
  })

  it('textContentが100文字を超える場合は切り詰める', () => {
    const target = document.createElement('p')
    target.textContent = 'a'.repeat(150)
    container.appendChild(target)

    const info = getElementInfo(target, container)
    expect(info.textContent.length).toBe(100)
  })

  it('textContentが空の場合は空文字列を返す', () => {
    const target = document.createElement('div')
    container.appendChild(target)

    const info = getElementInfo(target, container)
    expect(info.textContent).toBe('')
  })

  it('computedStylesにwidth, height, top, leftが含まれる', () => {
    const target = document.createElement('div')
    container.appendChild(target)

    const info = getElementInfo(target, container)

    expect(info.computedStyles).toBeDefined()
    expect('width' in info.computedStyles!).toBe(true)
    expect('height' in info.computedStyles!).toBe(true)
    expect('top' in info.computedStyles!).toBe(true)
    expect('left' in info.computedStyles!).toBe(true)
    expect('display' in info.computedStyles!).toBe(true)
    expect('position' in info.computedStyles!).toBe(true)
  })

  it('全てのattributesを取得できる', () => {
    const target = document.createElement('input')
    target.setAttribute('type', 'text')
    target.setAttribute('name', 'username')
    target.setAttribute('placeholder', 'Enter name')
    container.appendChild(target)

    const info = getElementInfo(target, container)

    expect(info.attributes.type).toBe('text')
    expect(info.attributes.name).toBe('username')
    expect(info.attributes.placeholder).toBe('Enter name')
  })
})

