/**
 * The colours of the default palette as they were before tokens.css existed (Trigger 2.0.0-alpha.1):
 * Tailwind colour names, as used in src/style.css and the components. T1 moves them into tokens.css
 * without changing a value; the tokens test checks that, and `contrast.test.ts` snapshots the resolved values.
 * The page backgrounds are VitePress's own (not set by Trigger).
 */
export interface Role {
  /** The semantic token that carries this role from T1 on. */
  token: string
  light: string
  dark: string
}

export const surface = { light: '#ffffff', dark: '#1b1b1f' }

export const roles: Role[] = [
  { token: '--tr-accent', light: 'cyan-600', dark: 'cyan-300' }, // links, dates, prev/next, underline
  { token: '--tr-accent-strong', light: 'cyan-700', dark: 'cyan-100' }, // post title
  { token: '--tr-accent-ui', light: 'cyan-700', dark: 'cyan-500' }, // pagination text
  { token: '--tr-accent-active', light: 'cyan-500', dark: 'cyan-100' }, // current page text
  { token: '--tr-accent-ring', light: 'cyan-500', dark: 'cyan-500' }, // "Read more" ring and glow
  { token: '--tr-badge-bg', light: 'cyan-200', dark: 'cyan-700' },
  { token: '--tr-badge-fg', light: 'cyan-700', dark: 'cyan-200' },
  { token: '--tr-title-from', light: 'cyan-700', dark: 'cyan-200' },
  { token: '--tr-title-to', light: 'blue-800', dark: 'blue-600' },
  { token: '--tr-text-muted', light: 'gray-500', dark: 'gray-300' },
  { token: '--tr-text-strong', light: 'gray-900', dark: '#ffffff' }, // white
  { token: '--tr-border', light: 'gray-300', dark: 'gray-700' },
  { token: '--tr-rule', light: 'gray-200', dark: 'gray-500' },
  { token: '--tr-divide', light: 'gray-600', dark: 'gray-600' },
  { token: '--tr-hover-bg', light: 'gray-300', dark: 'gray-700' },
  { token: '--tr-card-bg', light: 'slate-200', dark: 'slate-700' },
  { token: '--tr-card-text', light: 'gray-500', dark: 'cyan-200' },
  { token: '--tr-dashed-border', light: 'gray-400', dark: 'gray-600' },
  { token: '--tr-dashed-text', light: 'gray-700', dark: 'gray-300' },
  { token: '--tr-warn', light: 'yellow-500', dark: 'yellow-500' },
  { token: '--tr-on-warn', light: '#000000', dark: '#000000' }
]

/** Foreground / background pairs of the default look (the roles above, plus the page surface). */
export const pairs: { name: string; fg: string; bg: string }[] = [
  { name: 'link on page', fg: '--tr-accent', bg: 'surface' },
  { name: 'muted text on page', fg: '--tr-text-muted', bg: 'surface' },
  { name: 'strong text on page', fg: '--tr-text-strong', bg: 'surface' },
  { name: 'post title on page', fg: '--tr-accent-strong', bg: 'surface' },
  { name: 'pagination text on page', fg: '--tr-accent-ui', bg: 'surface' },
  { name: 'current page on hover bg', fg: '--tr-accent-active', bg: '--tr-hover-bg' },
  { name: 'pagination text on hover bg', fg: '--tr-accent-ui', bg: '--tr-hover-bg' },
  { name: 'badge', fg: '--tr-badge-fg', bg: '--tr-badge-bg' },
  { name: 'about quote on card', fg: '--tr-card-text', bg: '--tr-card-bg' },
  { name: 'AI summary text on page', fg: '--tr-dashed-text', bg: 'surface' },
  { name: 'AI summary button', fg: '--tr-on-warn', bg: '--tr-warn' }
]
