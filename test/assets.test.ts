import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import postcss from 'postcss'
import { describe, expect, it } from 'vitest'

const read = (rel: string) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8')
const css = read('../src/palette-trigger.css')
const uncommented = css.replace(/\/\*[\s\S]*?\*\//g, '')

/** The Vue files of the trigger palette. */
function triggerVue(): string[] {
  const src = fileURLToPath(new URL('../src', import.meta.url))
  const files: string[] = []
  const walk = (dir: string) => {
    for (const f of readdirSync(dir)) {
      const p = join(dir, f)
      if (statSync(p).isDirectory()) walk(p)
      else if (f.endsWith('.vue')) files.push(p)
    }
  }
  walk(join(src, 'layouts/trigger'))
  for (const f of ['AuthorCard', 'BailOut', 'Gate', 'LogMeta', 'ModeToggle', 'ReadingProgress', 'Toc', 'TriggerSlots']) files.push(join(src, `components/${f}.vue`))
  return files
}

describe('palette styles', () => {
  it('scopes every rule to the trigger palette', () => {
    const selectors: string[] = []
    postcss.parse(css).walkRules((r) => {
      selectors.push(...r.selectors)
    })
    const stray = selectors.filter((s) => !/data-palette="trigger"/.test(s))
    expect(stray).toEqual([])
  })

  it('has the guard against motion, shadows and rounded corners', () => {
    expect(css).toMatch(/\*::after \{\s*transition: none !important;\s*animation: none !important;\s*scroll-behavior: auto !important;\s*box-shadow: none !important;/)
  })

  it('has no transition, animation, keyframes or smooth scrolling of its own (DESIGN.md §5)', () => {
    const decls: string[] = []
    postcss.parse(css).walkDecls((d) => {
      if (/^(transition|animation)/.test(d.prop) && d.value !== 'none !important' && d.value !== 'none') decls.push(`${d.prop}: ${d.value}`)
      if (d.prop === 'scroll-behavior' && !d.value.startsWith('auto')) decls.push(`${d.prop}: ${d.value}`)
    })
    expect(decls).toEqual([])
    expect(uncommented).not.toMatch(/@keyframes|smooth/)
    for (const f of triggerVue()) expect(readFileSync(f, 'utf8'), f).not.toMatch(/<Transition|transition|animation|keyframes|smooth/)
  })

  it('has no gradients, glow, shadows or hexagon ornaments (DESIGN.md §6)', () => {
    expect(uncommented).not.toMatch(/gradient|text-shadow:(?!\s*none)|box-shadow:(?!\s*none)|data:image|hex/i)
  })

  it('uses the accent only for links, the current position, the quote line, the progress line and focus', () => {
    const uses: string[] = []
    postcss.parse(css).walkDecls((d) => {
      if (/var\(--tr-(trion|accent|focus)/.test(d.value)) uses.push(`${(d.parent as postcss.Rule).selector.replace(/\s+/g, ' ')} { ${d.prop} }`)
    })
    const allowed = /a:hover|a\[aria-current\]|\.tr-slot\[aria-current\]|blockquote|tr-progress|:focus-visible|vuemo-gallery|bailout:hover|summary-button:hover/
    expect(uses.filter((u) => !allowed.test(u))).toEqual([])
  })

  it('keeps corners square: no radius above 2px', () => {
    const radii: string[] = []
    postcss.parse(css).walkDecls(/radius/, (d) => {
      const px = /(\d+(?:\.\d+)?)px/.exec(d.value)
      if (px && +px[1] > 2) radii.push(d.value)
    })
    expect(radii).toEqual([])
  })
})

describe('assets', () => {
  it('ships no image files: the shapes are CSS borders and one inline circle', () => {
    expect(() => readdirSync(fileURLToPath(new URL('../src/assets', import.meta.url)))).toThrow()
  })

  it('lists the 404 circle and the corner mark in ASSETS.md', () => {
    const assets = read('../ASSETS.md')
    expect(assets).toContain('src/components/Gate.vue')
    expect(assets).toContain('.tr-mark')
  })
})
