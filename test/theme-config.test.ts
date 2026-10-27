import { describe, expect, it } from 'vitest'
import { readAbout, readPalette } from '../src/types'

describe('readAbout', () => {
  it('returns the valid options', () => {
    expect(readAbout({ about: { avatar: '/a.png', quote: 'hi' } })).toEqual({ avatar: '/a.png', quote: 'hi' })
  })

  it('is empty without the option and does not warn', () => {
    const warnings: string[] = []
    expect(readAbout({}, (m) => warnings.push(m))).toEqual({})
    expect(warnings).toEqual([])
  })

  it('warns about wrong values and drops them', () => {
    const warnings: string[] = []
    expect(readAbout({ about: { avatar: 1, quote: 'ok' } }, (m) => warnings.push(m))).toEqual({ quote: 'ok' })
    expect(readAbout({ about: 'x' }, (m) => warnings.push(m))).toEqual({})
    expect(warnings).toHaveLength(2)
    expect(warnings.every((m) => m.startsWith('[vuemo-theme-trigger]'))).toBe(true)
  })
})

describe('readPalette', () => {
  it('defaults to "default" without a warning', () => {
    const warnings: string[] = []
    expect(readPalette({}, (m) => warnings.push(m))).toBe('default')
    expect(warnings).toEqual([])
  })

  it('accepts the known palettes', () => {
    expect(readPalette({ palette: 'trigger' })).toBe('trigger')
    expect(readPalette({ palette: 'default' })).toBe('default')
  })

  it('warns about an unknown value and falls back', () => {
    const warnings: string[] = []
    expect(readPalette({ palette: 'neon' }, (m) => warnings.push(m))).toBe('default')
    expect(readPalette({ palette: 3 }, (m) => warnings.push(m))).toBe('default')
    expect(warnings).toHaveLength(2)
    expect(warnings[0]).toMatch(/^\[vuemo-theme-trigger\] themeConfig\.palette/)
  })
})
