/**
 * Every label of the trigger palette in one place. `flavored` is the theme's own vocabulary,
 * `plain` is what `themeConfig.flavor: false` shows instead. The default palette uses none of them.
 */
export interface Terms {
  /** Before a post number: `LOG-0042`. */
  log: string
  /** Before a category code: `SQ-A01`; empty hides the codes. */
  squad: string
  /** Heading of the post list of a category. */
  members: string
  /** The back-to-top button. */
  bailOut: string
  /** Before the language name of a code block: `TRIGGER: ts`. */
  codeLang: string
  /** The two states of the dark mode button. */
  day: string
  night: string
  /** The 404 page. */
  notFound: string
  /** The table of contents. */
  contents: string
  /** The stats of the author card. */
  stats: { posts: string; words: string; years: string }
}

export const flavored: Terms = {
  log: 'LOG-',
  squad: 'SQ-',
  members: 'MEMBERS',
  bailOut: 'BAIL OUT ↑',
  codeLang: 'TRIGGER: ',
  day: 'DAY',
  night: 'NIGHT',
  notFound: 'GATE 404 · No record at this address.',
  contents: 'BRIEFING',
  stats: { posts: 'LOGS', words: 'WORDS', years: 'YEARS' }
}

export const plain: Terms = {
  log: 'No. ',
  squad: '',
  members: 'Posts',
  bailOut: 'Back to top ↑',
  codeLang: '',
  day: 'LIGHT',
  night: 'DARK',
  notFound: '404 · This page does not exist.',
  contents: 'Contents',
  stats: { posts: 'Posts', words: 'Words', years: 'Years' }
}
