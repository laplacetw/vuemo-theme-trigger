import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import postcss from 'postcss'

export type ThemeStyle = 'normal' | 'anime'
export type Mode = 'light' | 'dark'

export const tokensPath = fileURLToPath(new URL('../../src/tokens.css', import.meta.url))

interface Layer {
  style: ThemeStyle
  mode: Mode
  vars: Record<string, string>
}

/** Which palette and mode a selector (list) belongs to. */
function scope(selector: string): { style: ThemeStyle; mode: Mode } {
  return {
    style: selector.includes('data-style="anime"') ? 'anime' : 'normal',
    mode: /\.dark\b/.test(selector) ? 'dark' : 'light'
  }
}

/** Custom properties of a stylesheet, grouped by palette and mode (by selector). */
export function parseTokens(css: string): Layer[] {
  const layers: Layer[] = []
  postcss.parse(css).walkRules((rule) => {
    const vars: Record<string, string> = {}
    rule.each((node) => {
      if (node.type === 'decl' && node.prop.startsWith('--')) vars[node.prop] = node.value.trim()
    })
    if (!Object.keys(vars).length) return
    // every selector of a list must agree, so a rule never lands in two palettes
    const scopes = new Set(rule.selectors.map((s) => JSON.stringify(scope(s))))
    if (scopes.size !== 1) throw new Error(`selector list mixes palettes or modes: ${rule.selector}`)
    layers.push({ ...JSON.parse([...scopes][0]), vars })
  })
  return layers
}

export function readTokens(): Layer[] {
  return parseTokens(readFileSync(tokensPath, 'utf8'))
}

/** The custom properties in effect for a style and mode, in cascade order: normal light < normal dark < anime light < anime dark. */
export function resolveTokens(layers: Layer[], style: ThemeStyle, mode: Mode): Record<string, string> {
  const order: [ThemeStyle, Mode][] = [['normal', 'light']]
  if (mode === 'dark') order.push(['normal', 'dark'])
  if (style === 'anime') {
    order.push(['anime', 'light'])
    if (mode === 'dark') order.push(['anime', 'dark'])
  }
  const merged: Record<string, string> = {}
  for (const [p, m] of order) for (const l of layers) if (l.style === p && l.mode === m) Object.assign(merged, l.vars)
  return merged
}

/** Follows `var(--x)` references until a literal is left. */
export function resolveVar(vars: Record<string, string>, name: string, seen: string[] = []): string {
  const raw = vars[name]
  if (raw === undefined) throw new Error(`token ${name} is not defined`)
  if (seen.includes(name)) throw new Error(`token cycle: ${[...seen, name].join(' -> ')}`)
  return raw.replace(/var\((--[\w-]+)(?:\s*,[^)]*)?\)/g, (_, ref) => resolveVar(vars, ref, [...seen, name]))
}
