/**
 * Every label of the trigger palette in one place. `flavored` is the theme's own vocabulary,
 * `plain` is what `themeConfig.flavor: false` shows instead. The default palette uses none of them.
 */
export interface Terms {
  /** Before a post number: `LOG-0042`. */
  log: string
  /** The back-to-top button, one line per entry. */
  bailOut: string[]
  /** Accessible name of the back-to-top button. */
  bailOutLabel: string
  /** The table of contents. */
  contents: string
}

export const flavored: Terms = {
  log: 'LOG-',
  bailOut: ['緊急', '脫出'],
  bailOutLabel: '緊急脫出（回到頂端）',
  contents: 'BRIEFING'
}

export const plain: Terms = {
  log: 'No. ',
  bailOut: ['TOP'],
  bailOutLabel: 'Back to top',
  contents: 'Contents'
}
