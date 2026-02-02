const fs = require('fs')

const html = fs.readFileSync('src/index.html', 'utf8')
const js = fs.readFileSync('src/app.js', 'utf8')
const liveHtml = fs.readFileSync('src/live.html', 'utf8')
let worker = fs.readFileSync('src/index.ts', 'utf8')

worker = worker.replace('__HTML_CONTENT__', html.replace(/`/g, '\\`'))
worker = worker.replace('__JS_CONTENT__', js.replace(/`/g, '\\`'))
worker = worker.replace('__LIVE_HTML_CONTENT__', liveHtml.replace(/`/g, '\\`'))

fs.mkdirSync('dist', { recursive: true })
fs.writeFileSync('dist/index.ts', worker)
console.log('✅ Build complete!')
