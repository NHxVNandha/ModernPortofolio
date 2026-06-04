import fs from 'node:fs'
import path from 'node:path'

const rootDir = process.cwd()
const stitchDir = path.join(rootDir, 'public', 'portofolioStitch')
const outputDir = path.join(rootDir, 'src', 'data')
const outputFile = path.join(outputDir, 'stitchProjects.json')

const toTitle = (value) => value
  .replace(/[-_]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .replace(/\b\w/g, (char) => char.toUpperCase())

const toUrl = (...segments) => `/${segments.map((segment) => encodeURIComponent(segment).replace(/%2F/g, '/')).join('/')}`

const readMarkdownMeta = (filePath) => {
  if (!filePath) return {}

  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const lines = content.split(/\r?\n/).map((line) => line.trim())
    const frontmatterEnd = lines[0] === '---' ? lines.findIndex((line, index) => index > 0 && line === '---') : -1
    const contentLines = frontmatterEnd > -1 ? lines.slice(frontmatterEnd + 1) : lines
    const frontmatterLines = frontmatterEnd > -1 ? lines.slice(1, frontmatterEnd) : []
    const frontmatterName = frontmatterLines.find((line) => line.startsWith('name:'))?.replace(/^name:\s*/, '').replace(/^['"]|['"]$/g, '')
    const title = contentLines.find((line) => line.startsWith('# '))?.replace(/^#\s+/, '') || frontmatterName
    const description = contentLines.find((line) => line && !line.startsWith('#') && !line.startsWith('![') && line !== '---')
    return { title, description }
  } catch {
    return {}
  }
}

const scanProjects = () => {
  if (!fs.existsSync(stitchDir)) return []

  return fs.readdirSync(stitchDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => {
      const folderPath = path.join(stitchDir, entry.name)
      const files = fs.readdirSync(folderPath, { withFileTypes: true })
        .filter((file) => file.isFile())
        .map((file) => file.name)
        .sort((a, b) => a.localeCompare(b))

      const htmlFile = files.find((file) => file.toLowerCase().endsWith('.html'))
      const imageFile = files.find((file) => /\.(png|jpg|jpeg|webp)$/i.test(file))
      const markdownFile = files.find((file) => file.toLowerCase().endsWith('.md'))
      const meta = readMarkdownMeta(markdownFile ? path.join(folderPath, markdownFile) : '')

      if (!htmlFile || !imageFile) return null

      return {
        slug: entry.name,
        title: meta.title || toTitle(entry.name),
        description: meta.description || 'Google Stitch export preview rendered directly inside this portfolio.',
        thumbnail: toUrl('portofolioStitch', entry.name, imageFile),
        htmlUrl: toUrl('portofolioStitch', entry.name, htmlFile),
        sourceFolder: `public/portofolioStitch/${entry.name}`,
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.title.localeCompare(b.title))
}

fs.mkdirSync(outputDir, { recursive: true })
fs.writeFileSync(outputFile, `${JSON.stringify(scanProjects(), null, 2)}\n`)
