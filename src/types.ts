/** Options of the Trigger theme, set in `themeConfig` (`defineBlogConfig({ themeConfig: { about: { ... } } })`). */
export interface TriggerThemeConfig {
  /** The About page (`<About />`). */
  about?: {
    /** Avatar image: a file in `public/` (for example `/avatar.png`) or a full URL. No avatar is shown when omitted. */
    avatar?: string
    /** The line under the avatar. Default: `Trigger your blog !` */
    quote?: string
  }
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
