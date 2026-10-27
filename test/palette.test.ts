import { describe, expect, it } from 'vitest'
import { contrast, parseColor } from './helpers/color'
import { readTokens, resolveTokens, resolveVar, type Mode } from './helpers/tokens'
import { roles } from './default-look'

const layers = readTokens()
const modes: Mode[] = ['light', 'dark']

/** Tokens every palette in the theme contract must end up with. */
const required = [
  '--tr-accent', '--tr-accent-strong', '--tr-on-accent',
  '--tr-surface-0', '--tr-surface-1', '--tr-surface-2',
  '--tr-text', '--tr-text-muted', '--tr-border', '--tr-focus',
  '--tr-selection-bg', '--tr-selection-fg', '--tr-code-bg', '--tr-code-border',
  '--tr-scrollbar-thumb', '--tr-scrollbar-track',
  '--tr-radius', '--tr-chip-cut', '--tr-grid-opacity', '--tr-motion-duration'
]

describe('palette trigger: completeness', () => {
  for (const mode of modes) {
    it(`defines every semantic token (${mode})`, () => {
      const vars = resolveTokens(layers, 'trigger', mode)
      for (const name of required) expect(vars[name], `${name} (${mode})`).toBeDefined()
    })

    it(`sets every default-palette role itself, so nothing falls back to the default look (${mode})`, () => {
      const own = new Set(
        layers.filter((l) => l.palette === 'trigger' && (l.mode === 'light' || mode === 'dark')).flatMap((l) => Object.keys(l.vars))
      )
      const missing = roles.map((r) => r.token).filter((t) => !own.has(t))
      expect(missing).toEqual([])
    })

    it(`all colour tokens resolve to a parsable colour (${mode})`, () => {
      const vars = resolveTokens(layers, 'trigger', mode)
      for (const [name, v] of Object.entries(vars)) {
        if (!/^--tr-(?!radius|chip-cut|grid-opacity|motion)/.test(name) || /cyan|blue|gray|slate|yellow/.test(name)) continue
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

describe('palette trigger: contrast', () => {
  for (const mode of modes) {
    const vars = resolveTokens(layers, 'trigger', mode)
    for (const [fg, bg, min, what] of pairs) {
      it(`${what}: ${fg} on ${bg} >= ${min}:1 (${mode})`, () => {
        const ratio = contrast(resolveVar(vars, fg), resolveVar(vars, bg))
        expect(ratio, `${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(min)
      })
    }
  }
})
