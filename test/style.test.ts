import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import postcss from 'postcss'
import { describe, expect, it } from 'vitest'
import { composite, contrast, parseColor } from './helpers/color'
import { readTokens, resolveTokens, resolveVar, type Mode } from './helpers/tokens'
import { roles } from './default-look'

const layers = readTokens()
const modes: Mode[] = ['light', 'dark']

/** Tokens every palette in the theme contract must end up with. */
const required = [
  '--tr-accent', '--tr-accent-strong', '--tr-accent-solid', '--tr-brand-text', '--tr-on-accent',
  '--tr-surface-0', '--tr-surface-1', '--tr-surface-2',
  '--tr-text', '--tr-text-muted', '--tr-border', '--tr-focus',
  '--tr-selection-bg', '--tr-selection-fg', '--tr-code-bg', '--tr-code-border',
  '--tr-scrollbar-thumb', '--tr-scrollbar-track',
  '--tr-radius', '--tr-cut', '--tr-grid-opacity', '--tr-motion-duration'
]

describe('style anime: completeness', () => {
  for (const mode of modes) {
    it(`defines every semantic token (${mode})`, () => {
      const vars = resolveTokens(layers, 'anime', mode)
      for (const name of required) expect(vars[name], `${name} (${mode})`).toBeDefined()
    })

    it(`sets every default-palette role itself, so nothing falls back to the default look (${mode})`, () => {
      const own = new Set(
        layers.filter((l) => l.style === 'anime' && (l.mode === 'light' || mode === 'dark')).flatMap((l) => Object.keys(l.vars))
      )
      const missing = roles.map((r) => r.token).filter((t) => !own.has(t))
      expect(missing).toEqual([])
    })

    it(`all colour tokens resolve to a parsable colour (${mode})`, () => {
      const vars = resolveTokens(layers, 'anime', mode)
      for (const [name, v] of Object.entries(vars)) {
        if (!/^--tr-(?!radius|cut|grid-opacity|motion)/.test(name) || /cyan|blue|gray|slate|yellow/.test(name)) continue
        expect(() => parseColor(resolveVar(vars, name)), name).not.toThrow()
        void v
      }
    })
  }
})

/** [foreground, background, minimum ratio, what it is]. 4.5 for text, 3 for UI parts and the focus ring. */
const text = 4.5
const ui = 3
const pairs: [string, string, number, string][] = [
  ['--tr-text', '--tr-surface-0', text, 'body text'],
  ['--tr-text', '--tr-surface-1', text, 'text on a card'],
  ['--tr-text', '--tr-surface-2', text, 'text on a raised surface'],
  ['--tr-text-strong', '--tr-surface-0', text, 'headings'],
  ['--tr-text-muted', '--tr-surface-0', text, 'secondary text'],
  ['--tr-text-muted', '--tr-surface-1', text, 'secondary text on a card'],
  ['--tr-accent', '--tr-surface-0', text, 'links'],
  ['--tr-accent', '--tr-surface-1', text, 'links on a card'],
  ['--tr-accent-strong', '--tr-surface-0', text, 'post title'],
  ['--tr-accent-ui', '--tr-surface-0', text, 'pagination text'],
  ['--tr-accent-active', '--tr-hover-bg', text, 'current page'],
  ['--tr-accent-ui', '--tr-hover-bg', text, 'pagination text on hover'],
  ['--tr-on-accent', '--tr-accent-solid', text, 'button text'],
  ['--tr-badge-fg', '--tr-badge-bg', text, 'badge'],
  ['--tr-title-from', '--tr-surface-0', text, 'page title gradient, start'],
  ['--tr-title-to', '--tr-surface-0', text, 'page title gradient, end'],
  ['--tr-card-text', '--tr-card-bg', text, 'about quote'],
  ['--tr-dashed-text', '--tr-surface-0', text, 'AI summary text'],
  ['--tr-on-warn', '--tr-warn', text, 'AI summary button'],
  ['--tr-warn-text', '--tr-surface-0', text, 'warning text'],
  ['--tr-selection-fg', '--tr-selection-bg', text, 'selected text'],
  ['--tr-text', '--tr-code-bg', text, 'code'],
  ['--tr-focus', '--tr-surface-0', ui, 'focus ring on the page'],
  ['--tr-focus', '--tr-surface-1', ui, 'focus ring on a card'],
  ['--tr-focus', '--tr-code-bg', ui, 'focus ring on code'],
  ['--tr-border', '--tr-surface-0', ui, 'control and card border'],
  ['--tr-code-border', '--tr-code-bg', ui, 'code block edge'],
  ['--tr-accent-ring', '--tr-surface-0', ui, '"Read more" ring'],
  ['--tr-scrollbar-thumb', '--tr-scrollbar-track', ui, 'scrollbar thumb']
]

describe('style anime: contrast', () => {
  for (const mode of modes) {
    const vars = resolveTokens(layers, 'anime', mode)
    for (const [fg, bg, min, what] of pairs) {
      it(`${what}: ${fg} on ${bg} >= ${min}:1 (${mode})`, () => {
        const ratio = contrast(resolveVar(vars, fg), resolveVar(vars, bg))
        expect(ratio, `${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(min)
      })
    }
  }
})

/**
 * The accent variables VitePress reads (`--vp-c-brand-1/3`): its links, inline code, buttons, tip blocks and
 * search. VitePress's own page backgrounds apply to the `'normal'` style (it sets none); the anime style
 * sets its own. Both palettes and both modes are checked.
 */
describe('VitePress brand variables: contrast', () => {
  const vpDefault = {
    light: { bg: '#ffffff', bgSoft: '#f6f6f7', codeBlock: '#f6f6f7', inlineCode: 'rgba(142, 150, 170, 0.14)', white: '#ffffff' },
    dark: { bg: '#1b1b1f', bgSoft: '#202127', codeBlock: '#161618', inlineCode: 'rgba(101, 117, 133, 0.16)', white: '#ffffff' }
  }
  for (const style of ['normal', 'anime'] as const) {
    for (const mode of modes) {
      const vars = resolveTokens(layers, style, mode)
      const own = (name: string, fallback: string) => (style === 'anime' ? resolveVar(vars, name) : fallback)
      const d = vpDefault[mode]
      const bg = own('--vp-c-bg', d.bg)
      const bgSoft = own('--vp-c-bg-soft', d.bgSoft)
      const codeBlock = own('--vp-code-block-bg', d.codeBlock)
      // inline code sits on a translucent tint over the page: flatten it
      const inlineCode = composite(parseColor(d.inlineCode), parseColor(bg))
      const brand = (n: string) => resolveVar(vars, `--vp-c-brand-${n}`)
      const buttonText = style === 'anime' ? resolveVar(vars, '--vp-button-brand-text') : d.white
      const cases: [string, string, string | ReturnType<typeof composite>, number][] = [
        ['links (--vp-c-brand-1) on the page', brand('1'), bg, text],
        ['links on a soft surface', brand('1'), bgSoft, text],
        ['inline code (--vp-c-brand-1) on its tint', brand('1'), inlineCode, text],
        ['inline code in a code block surface', brand('1'), codeBlock, text],
        ['button text on --vp-c-brand-3', buttonText, brand('3'), text]
      ]
      for (const [what, fg, back, min] of cases) {
        it(`${style} ${mode}: ${what} >= ${min}:1`, () => {
          const ratio = contrast(fg, back)
          expect(ratio, `${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(min)
        })
      }
    }
  }
})

describe('tokens.css structure', () => {
  const css = readFileSync(fileURLToPath(new URL('../src/tokens.css', import.meta.url)), 'utf8')
  const rules: { selector: string; decls: string }[] = []
  postcss.parse(css).walkRules((r) => {
    rules.push({ selector: r.selector, decls: r.nodes.map((n) => n.toString()).join(';') })
  })

  it('never groups the theme root with :root:has() in one selector list', () => {
    // a browser without :has() drops the whole list, and the palette with it
    const grouped = rules.filter((r) => r.selector.includes(',') && (r.selector.includes(':has(') || r.selector.includes('data-style')))
    expect(grouped.map((r) => r.selector)).toEqual([])
  })

  it('keeps the two rules of a palette set identical', () => {
    for (const dark of [false, true]) {
      const root = rules.find((r) => r.selector.startsWith(dark ? '.dark [data-style="anime"]' : '[data-style="anime"]'))
      const html = rules.find((r) => r.selector.startsWith(dark ? ':root.dark:has(' : ':root:has(') && r.selector.includes('data-style="anime"'))
      expect(root, `theme root rule (${dark ? 'dark' : 'light'})`).toBeDefined()
      expect(html, `:root rule (${dark ? 'dark' : 'light'})`).toBeDefined()
      expect(html!.decls).toBe(root!.decls)
    }
  })

  it('does not declare a variable VitePress does not read', () => {
    expect(css).not.toMatch(/--vp-c-focus\b/)
  })
})

describe('focus is never clipped', () => {
  const css = readFileSync(fileURLToPath(new URL('../src/style-anime.css', import.meta.url)), 'utf8')
  const clipped: string[] = []
  const focusOverrides: string[] = []
  postcss.parse(css).walkRules((rule) => {
    const decls = rule.nodes.filter((n) => n.type === 'decl') as postcss.Declaration[]
    for (const sel of rule.selectors) {
      if (decls.some((d) => d.prop === 'clip-path' && d.value.trim() === 'none') && sel.endsWith(':focus-visible')) focusOverrides.push(sel.slice(0, -':focus-visible'.length))
      // a pseudo-element cannot take focus, and a clip-path on it cannot clip the element's outline
      if (decls.some((d) => d.prop === 'clip-path' && d.value.trim() !== 'none') && !/::(before|after)/.test(sel)) clipped.push(sel)
    }
  })
  // what can take keyboard focus: links, buttons, form controls, the theme's link and button classes
  const focusable = /(^|[\s>+~.])(a|button|input|select|textarea|summary)(?![\w-])|theme-readmore|theme-pagination|theme-prev|theme-next|\[tabindex|\[href/

  it('has a clip-path only on badges and pseudo-elements, which cannot take focus (the check below is not vacuous)', () => {
    expect(clipped.some((s) => s.includes('.theme-badge'))).toBe(true)
  })

  it('puts no clip-path on a focusable element without removing it on :focus-visible', () => {
    const missing = clipped.filter((s) => focusable.test(s) && !focusOverrides.includes(s))
    expect(missing).toEqual([])
  })

  it('gives "Read more" a full frame: no cut corner', () => {
    expect(clipped.filter((s) => s.includes('.theme-readmore'))).toEqual([])
  })

  it('keeps the heading counter out of the accessibility tree', () => {
    expect(css).toMatch(/content: counter\(tr-h2, decimal-leading-zero\) \/ ""/)
  })
})

describe('built HTML carries the style (SSR)', () => {
  const root = fileURLToPath(new URL('..', import.meta.url))
  const build = (style?: string) => {
    const out = mkdtempSync(join(tmpdir(), 'trigger-build-'))
    try {
      execFileSync('pnpm', ['exec', 'vitepress', 'build', 'example'], {
        cwd: root,
        env: { ...process.env, STYLE: style ?? '', OUT_DIR: out },
        stdio: 'pipe'
      })
      return readFileSync(join(out, 'index.html'), 'utf8')
    } finally {
      rmSync(out, { recursive: true, force: true })
    }
  }

  it('STYLE=anime: the server-rendered wrapper has data-style="anime"', () => {
    expect(build('anime')).toMatch(/<div class="tr-root" data-style="anime"/)
  }, 240_000)

  it('default: the wrapper has data-style="normal"', () => {
    expect(build()).toMatch(/<div class="tr-root" data-style="normal"/)
  }, 240_000)
})
