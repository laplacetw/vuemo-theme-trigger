import { describe, expect, it } from 'vitest'
import { readAbout } from '../src/types'

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
