/** Options of the Trigger theme, set in `themeConfig` (`defineBlogConfig({ themeConfig: { about: { ... } } })`). */
export interface TriggerThemeConfig {
  /** The About page (`layout: about`). */
  about?: {
    /** Avatar image: a file in `public/` (for example `/avatar.png`) or a full URL. No avatar is shown when omitted. */
    avatar?: string
    /** The line under the avatar. Default: `Trigger your blog !` */
    quote?: string
  }
  /**
   * The look. `'normal'` (the default) is the look of Trigger 1.x; `'anime'` is an anime-inspired look
   * (navy surfaces, signal-cyan accent, hexagon texture, post numbers, a table of contents and a back-to-top button).
   */
  style?: ThemeStyle
  /**
   * Style `'anime'` only: label things with the theme's own vocabulary (`LOG-0042`, `緊急脫出`, `BRIEFING`).
   * `false` uses plain words instead. Default: `true`. The words are in `src/flavor.ts`.
   */
  flavor?: boolean
}

export type ThemeStyle = 'normal' | 'anime'

export const STYLES: readonly ThemeStyle[] = ['normal', 'anime']

/** The `style` option: an unknown value warns and falls back to `'normal'`. */
export function readStyle(theme: Record<string, unknown>, warn: (message: string) => void = console.warn): ThemeStyle {
  const raw = theme.style
  if (raw === undefined) return 'normal'
  if (typeof raw === 'string' && (STYLES as readonly string[]).includes(raw)) return raw as ThemeStyle
  warn(`[vuemo-theme-trigger] themeConfig.style must be one of ${STYLES.map((p) => `'${p}'`).join(', ')}; using 'normal'`)
  return 'normal'
}

/** The `flavor` option: anything but a boolean warns and falls back to `true`. */
export function readFlavor(theme: Record<string, unknown>, warn: (message: string) => void = console.warn): boolean {
  const raw = theme.flavor
  if (raw === undefined) return true
  if (typeof raw === 'boolean') return raw
  warn('[vuemo-theme-trigger] themeConfig.flavor must be true or false; using true')
  return true
}

/** The `about` option as the theme understands it, with a warning for every wrong value. */
export function readAbout(theme: Record<string, unknown>, warn: (message: string) => void = console.warn) {
  const raw = theme.about
  if (raw === undefined) return {}
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    warn('[vuemo-theme-trigger] themeConfig.about must be an object ({ avatar?, quote? })')
    return {}
  }
  const { avatar, quote } = raw as Record<string, unknown>
  const about: { avatar?: string; quote?: string } = {}
  if (avatar !== undefined) {
    if (typeof avatar === 'string') about.avatar = avatar
    else warn('[vuemo-theme-trigger] themeConfig.about.avatar must be a string')
  }
  if (quote !== undefined) {
    if (typeof quote === 'string') about.quote = quote
    else warn('[vuemo-theme-trigger] themeConfig.about.quote must be a string')
  }
  return about
}
