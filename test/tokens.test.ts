import { readdirSync, readFileSync, statSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { parseColor, toHex } from './helpers/color'
import { readTokens, resolveTokens, resolveVar } from './helpers/tokens'
import { roles } from './default-look'

const require = createRequire(import.meta.url)
const themeCss = readFileSync(require.resolve('tailwindcss/theme.css'), 'utf8')
const tailwind = (name: string) => (name.startsWith('#') ? name : new RegExp(`--color-${name}:\\s*([^;]+);`).exec(themeCss)![1].trim())

describe('tokens.css, normal style', () => {
  const layers = readTokens()

  for (const mode of ['light', 'dark'] as const) {
    it(`keeps every colour of the pre-token look (${mode})`, () => {
      const vars = resolveTokens(layers, 'normal', mode)
      for (const role of roles) {
        const actual = toHex(parseColor(resolveVar(vars, role.token)))
        const expected = toHex(parseColor(tailwind(role[mode])))
        expect(actual, `${role.token} (${mode})`).toBe(expected)
      }
    })
  }

  it('maps the VitePress accent variables to the tokens', () => {
    const vars = resolveTokens(layers, 'normal', 'light')
    for (const name of ['--vp-c-brand-1', '--vp-c-brand-2', '--vp-c-brand-3', '--vp-c-brand-soft']) {
      expect(vars[name], name).toMatch(/^var\(--tr-/)
      expect(() => parseColor(resolveVar(vars, name)), name).not.toThrow()
    }
  })
})

describe('source', () => {
  const src = fileURLToPath(new URL('../src', import.meta.url))
  const files: string[] = []
  const walk = (dir: string) => {
    for (const f of readdirSync(dir)) {
      const p = join(dir, f)
      if (statSync(p).isDirectory()) walk(p)
      else if (/\.(vue|css)$/.test(f) && f !== 'tokens.css') files.push(p)
    }
  }
  walk(src)

  it('uses no hard-coded Tailwind palette colours outside tokens.css', () => {
    const hits = files.flatMap((f) =>
      [...readFileSync(f, 'utf8').matchAll(/\b(?:cyan|blue|gray|slate|yellow|zinc|neutral)-\d{2,3}\b/g)].map((m) => `${f}: ${m[0]}`)
    )
    expect(hits).toEqual([])
  })
})
