import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { describe, expect, it } from 'vitest'
import { contrast, parseColor, toHex } from './helpers/color'
import { parseTokens, resolveTokens, resolveVar } from './helpers/tokens'
import { pairs, roles, surface } from './default-look'

const require = createRequire(import.meta.url)
const themeCss = readFileSync(require.resolve('tailwindcss/theme.css'), 'utf8')

/** `cyan-600` -> the oklch value from Tailwind's theme; a literal colour stays as it is. */
function tailwind(name: string): string {
  if (name.startsWith('#')) return name
  const m = new RegExp(`--color-${name}:\\s*([^;]+);`).exec(themeCss)
  if (!m) throw new Error(`unknown Tailwind colour ${name}`)
  return m[1].trim()
}

describe('colour helpers', () => {
  it('computes WCAG ratios', () => {
    expect(contrast('#000', '#fff')).toBeCloseTo(21, 5)
    expect(contrast('#fff', '#fff')).toBeCloseTo(1, 5)
    expect(contrast('#767676', '#ffffff')).toBeCloseTo(4.54, 2)
  })

  it('parses hex, rgb and oklch, with alpha', () => {
    expect(toHex(parseColor('#0af'))).toBe('#00aaff')
    expect(toHex(parseColor('rgb(8 145 178)'))).toBe('#0891b2')
    expect(parseColor('rgba(0, 0, 0, 0.5)').a).toBe(0.5)
    // Tailwind v4 cyan-600
    expect(toHex(parseColor('oklch(60.9% 0.126 221.723)'))).toBe('#0092b8')
    expect(toHex(parseColor('oklch(100% 0 0)'))).toBe('#ffffff')
  })

  it('refuses a translucent background', () => {
    expect(() => contrast('#000', 'rgba(0, 0, 0, 0.5)')).toThrow(/opaque/)
  })

  it('composites a translucent foreground over the background', () => {
    expect(contrast('rgba(0, 0, 0, 0.5)', '#ffffff')).toBeCloseTo(contrast('#808080', '#ffffff'), 1)
  })
})

describe('token parser', () => {
  const css = `
    :root { --a: #fff; --b: var(--a); }
    :root.dark { --a: #000; }
    [data-palette="trigger"], :root:has(.tr-root[data-palette="trigger"]) { --a: #123456; }
    .dark [data-palette="trigger"], :root.dark:has(.tr-root[data-palette="trigger"]) { --a: #abcdef; }
    .other { color: red; }
  `
  const layers = parseTokens(css)

  it('sorts rules into palette and mode', () => {
    expect(layers.map((l) => `${l.palette}/${l.mode}`)).toEqual(['default/light', 'default/dark', 'trigger/light', 'trigger/dark'])
  })

  it('applies the cascade and resolves var()', () => {
    expect(resolveVar(resolveTokens(layers, 'default', 'dark'), '--b')).toBe('#000')
    expect(resolveVar(resolveTokens(layers, 'trigger', 'light'), '--b')).toBe('#123456')
    expect(resolveVar(resolveTokens(layers, 'trigger', 'dark'), '--b')).toBe('#abcdef')
  })

  it('rejects an undefined token and a cycle', () => {
    expect(() => resolveVar({}, '--x')).toThrow(/not defined/)
    expect(() => resolveVar({ '--x': 'var(--y)', '--y': 'var(--x)' }, '--x')).toThrow(/cycle/)
  })
})

/** Baseline of the default palette, taken before tokens.css existed: it must not change in a refactoring. */
describe('baseline of the default look', () => {
  const resolved = (mode: 'light' | 'dark') => Object.fromEntries(roles.map((r) => [r.token, tailwind(r[mode])]))

  for (const mode of ['light', 'dark'] as const) {
    it(`colours (${mode})`, () => {
      const table = Object.fromEntries(Object.entries(resolved(mode)).map(([k, v]) => [k, toHex(parseColor(v))]))
      expect(table).toMatchSnapshot()
    })

    it(`contrast ratios (${mode})`, () => {
      const colours: Record<string, string> = { ...resolved(mode), surface: surface[mode] }
      const table = Object.fromEntries(pairs.map((p) => [p.name, +contrast(colours[p.fg], colours[p.bg]).toFixed(2)]))
      expect(table).toMatchSnapshot()
    })
  }
})
