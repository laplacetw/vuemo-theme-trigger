import { describe, expect, it } from 'vitest'
import { readAbout, readFlavor, readPalette } from '../src/types'
import { flavored, plain } from '../src/flavor'
import { categoryCodes, dotDate, readingMinutes } from '../src/format'

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

describe('readFlavor', () => {
  it('defaults to true without a warning and accepts booleans', () => {
    const warnings: string[] = []
    expect(readFlavor({}, (m) => warnings.push(m))).toBe(true)
    expect(readFlavor({ flavor: false })).toBe(false)
    expect(warnings).toEqual([])
  })

  it('warns about anything else and keeps the flavour', () => {
    const warnings: string[] = []
    expect(readFlavor({ flavor: 'no' }, (m) => warnings.push(m))).toBe(true)
    expect(warnings[0]).toMatch(/^\[vuemo-theme-trigger\] themeConfig\.flavor/)
  })
})

describe('terms', () => {
  it('has the same keys with and without flavour', () => {
    expect(Object.keys(plain).sort()).toEqual(Object.keys(flavored).sort())
    expect(Object.keys(plain.stats).sort()).toEqual(Object.keys(flavored.stats).sort())
  })

  it('uses none of the flavoured words when the flavour is off', () => {
    const words = ['LOG', 'SQ-', 'BAIL', 'TRIGGER', 'GATE', 'MEMBERS', 'BRIEFING', 'DAY', 'NIGHT']
    const text = JSON.stringify([...Object.values(plain), ...Object.values(plain.stats)]).toUpperCase()
    expect(words.filter((w) => text.includes(w))).toEqual([])
  })
})

describe('helpers', () => {
  const post = (words?: number) => ({ title: 't', url: '/p', date: { time: 0, string: '2026-10-30' }, tags: [], ...(words === undefined ? {} : { words }) })

  it('reads at 250 words a minute, at least one minute, nothing without a count', () => {
    expect(readingMinutes(post(1500) as any)).toBe(6)
    expect(readingMinutes(post(10) as any)).toBe(1)
    expect(readingMinutes(post() as any)).toBeUndefined()
  })

  it('formats dates and category codes', () => {
    expect(dotDate('2026-10-30')).toBe('2026.10.30')
    expect([...categoryCodes(['b', 'a'])]).toEqual([['a', 'A01'], ['b', 'A02']])
  })
})
