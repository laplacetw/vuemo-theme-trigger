import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, utimesSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const script = fileURLToPath(new URL('../scripts/package.mjs', import.meta.url))

/** A small theme package in a temp folder. */
function theme(pkg: object = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'trigger-zip-'))
  const put = (name: string, body = 'x') => {
    mkdirSync(join(dir, name, '..'), { recursive: true })
    writeFileSync(join(dir, name), body)
  }
  put('package.json', JSON.stringify({ name: 'vuemo-theme-t', version: '1.0.0', exports: { '.': './src/index.ts' }, ...pkg }))
  put('src/index.ts')
  put('dist/style.css', 'a{}')
  put('README.md')
  return { dir, put }
}
const run = (cwd: string, env: Record<string, string> = {}) => execFileSync(process.execPath, [script], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, ...env } })
const zipPath = (dir: string) => join(dir, 'dist-zip/vuemo-theme-t-1.0.0.zip')
/** Names in a zip's central directory. */
function names(buf: Buffer): string[] {
  const end = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]))
  let p = buf.readUInt32LE(end + 16)
  const out: string[] = []
  for (let i = 0; i < buf.readUInt16LE(end + 10); i++) {
    const n = buf.readUInt16LE(p + 28)
    out.push(buf.toString('utf8', p + 46, p + 46 + n))
    p += 46 + n
  }
  return out
}

describe('scripts/package.mjs', () => {
  it('skips dotfiles and symbolic links', () => {
    const t = theme()
    t.put('src/.env', 'SECRET')
    t.put('src/.hidden/a.ts')
    t.put('outside.txt')
    symlinkSync(join(t.dir, 'outside.txt'), join(t.dir, 'src/link.txt'))
    run(t.dir)
    const list = names(readFileSync(zipPath(t.dir)))
    expect(list.some((n) => /\/\./.test(n))).toBe(false)
    expect(list).not.toContain('t/src/link.txt')
    expect(list).toContain('t/src/index.ts')
    expect(list).toContain('t/dist/style.css')
  })
  it('honors "files"', () => {
    const t = theme({ files: ['src', 'dist'] })
    t.put('extra/a.txt')
    run(t.dir)
    const list = names(readFileSync(zipPath(t.dir)))
    expect(list).not.toContain('t/extra/a.txt')
    expect(list).toContain('t/package.json')
  })
  it('fails when "files" leaves out the entry', () => {
    const t = theme({ files: ['dist'] })
    expect(() => run(t.dir)).toThrow(/is not in the zip/)
  })
  it('fails without dist/style.css', () => {
    const t = theme()
    rmSync(join(t.dir, 'dist/style.css'))
    expect(() => run(t.dir)).toThrow(/dist\/style\.css is missing/)
  })
  it('is deterministic whatever the mtimes', () => {
    const t = theme()
    run(t.dir)
    const first = readFileSync(zipPath(t.dir))
    utimesSync(join(t.dir, 'src/index.ts'), new Date(2030, 5, 5), new Date(2030, 5, 5))
    run(t.dir)
    expect(readFileSync(zipPath(t.dir)).equals(first)).toBe(true)
    expect(first.readUInt16LE(12)).toBe(33) // 1980-01-01
    run(t.dir, { SOURCE_DATE_EPOCH: '1700000000' })
    expect(readFileSync(zipPath(t.dir)).readUInt16LE(12)).not.toBe(33)
  })
})
