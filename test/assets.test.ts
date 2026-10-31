import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const read = (rel: string) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8')
const css = read('../src/palette-trigger.css')

describe('palette assets', () => {
  for (const name of ['hex-grid', 'divider-node']) {
    it(`${name}.svg matches the data URI in palette-trigger.css`, () => {
      const svg = read(`../src/assets/${name}.svg`).trim()
      const uris = [...css.matchAll(/url\("data:image\/svg\+xml,([^"]+)"\)/g)].map((m) => decodeURIComponent(m[1]))
      expect(uris).toContain(svg)
    })

    it(`${name}.svg is listed in ASSETS.md`, () => {
      expect(read('../ASSETS.md')).toContain(`src/assets/${name}.svg`)
    })
  }
})

describe('palette styles', () => {
  it('scopes every rule to the trigger palette (or the tag hook)', () => {
    const selectors = [...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/(^|\})\s*([^{}@]+)\{/g)].map((m) => m[2].trim())
    const stray = selectors.filter((s) => !/data-palette="trigger"/.test(s) && !/^(\.tr-tag|\.tr-tag-led|0%, 100%|50%)$/.test(s))
    expect(stray).toEqual([])
  })

  it('respects reduced motion and marks focus with an outline, not by colour alone', () => {
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*animation: none !important/)
    expect(css).toMatch(/:focus-visible\s*\{[^}]*outline: 2px solid var\(--tr-focus\)[^}]*outline-offset: 2px/)
    // the signal tag is a static cube
    expect(css).not.toMatch(/tr-led/)
  })
})

describe('bail-out button', () => {
  it('is listed in ASSETS.md', () => {
    expect(read('../ASSETS.md')).toContain('src/components/BailOut.vue')
  })

  it('has no clip-path, so its focus outline is never cut', () => {
    expect(css).not.toMatch(/\.tr-bailout[^{]*\{[^}]*clip-path/)
  })
})
