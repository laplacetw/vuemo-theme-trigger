/** Colour parsing and WCAG 2.x contrast, for the palette tests. Supports #hex, rgb()/rgba() and oklch(). */
export interface Rgba {
  r: number
  g: number
  b: number
  a: number
}

/*
 * Limitation: oklch colours outside the sRGB gamut are clamped per channel here, while a browser maps them
 * into gamut differently (CSS Color 4 gamut mapping). For the in-gamut Tailwind colours used as primitives the
 * two agree to within a rounding step; a very saturated oklch value could differ, so prefer #hex for new colours.
 */
const clamp = (n: number) => Math.min(1, Math.max(0, n))
const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const toGamma = (c: number) => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055)

function oklchToRgb(l: number, c: number, hDeg: number): [number, number, number] {
  const h = (hDeg * Math.PI) / 180
  const a = c * Math.cos(h)
  const b = c * Math.sin(h)
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    toGamma(clamp(4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_)),
    toGamma(clamp(-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_)),
    toGamma(clamp(-0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_))
  ]
}

export function parseColor(input: string): Rgba {
  const v = input.trim().toLowerCase()
  let m = /^#([0-9a-f]{3,8})$/.exec(v)
  if (m) {
    let h = m[1]
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('')
    if (h.length !== 6 && h.length !== 8) throw new Error(`bad hex colour: ${input}`)
    const n = (i: number) => parseInt(h.slice(i, i + 2), 16) / 255
    return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) : 1 }
  }
  m = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/.exec(v)
  if (m) {
    const alpha = m[4] === undefined ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4])
    return { r: +m[1] / 255, g: +m[2] / 255, b: +m[3] / 255, a: alpha }
  }
  m = /^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?(?:\s*\/\s*([\d.]+%?))?\s*\)$/.exec(v)
  if (m) {
    const [r, g, b] = oklchToRgb(m[2] ? +m[1] / 100 : +m[1], +m[3], +m[4])
    const alpha = m[5] === undefined ? 1 : m[5].endsWith('%') ? parseFloat(m[5]) / 100 : parseFloat(m[5])
    return { r, g, b, a: alpha }
  }
  throw new Error(`unsupported colour: ${input}`)
}

/** Paints `fg` (with its alpha) over an opaque `bg`. */
export function composite(fg: Rgba, bg: Rgba): Rgba {
  const mix = (f: number, b: number) => f * fg.a + b * (1 - fg.a)
  return { r: mix(fg.r, bg.r), g: mix(fg.g, bg.g), b: mix(fg.b, bg.b), a: 1 }
}

export function luminance(c: Rgba): number {
  return 0.2126 * toLinear(c.r) + 0.7152 * toLinear(c.g) + 0.0722 * toLinear(c.b)
}

/** WCAG contrast ratio; a translucent `fg` is composited over `bg` first. `bg` must be opaque (flatten it with `composite` first). */
export function contrast(fg: string | Rgba, bg: string | Rgba): number {
  const b = typeof bg === 'string' ? parseColor(bg) : bg
  if (b.a < 1) throw new Error('contrast(): the background must be opaque, composite it over the page first')
  let f = typeof fg === 'string' ? parseColor(fg) : fg
  if (f.a < 1) f = composite(f, b)
  const [hi, lo] = [luminance(f), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

export function toHex(c: Rgba): string {
  return '#' + [c.r, c.g, c.b].map((n) => Math.round(clamp(n) * 255).toString(16).padStart(2, '0')).join('')
}
