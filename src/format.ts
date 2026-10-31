// Pure helpers of the trigger palette (no Vue, no VitePress), so tests can import them.
import type { Post } from '@vuemo/core/client'

/** `words` is in the post model since @vuemo/core 0.1.0-alpha.3; older cores have no reading time. */
export const wordsOf = (post: Post): number | undefined => (post as Post & { words?: number }).words

/** Reading time in whole minutes (at least 1), or undefined without a word count. */
export function readingMinutes(post: Post): number | undefined {
  const words = wordsOf(post)
  return words === undefined ? undefined : Math.max(1, Math.round(words / 250))
}

/** `2026-10-30` -> `2026.10.30` */
export const dotDate = (date: string) => date.slice(0, 10).replaceAll('-', '.')

export const pad = (n: number, width: number) => String(n).padStart(width, '0')
